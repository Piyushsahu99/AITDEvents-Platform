
-- Community Groups
CREATE TABLE public.community_groups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  image_url text,
  category text DEFAULT 'general',
  is_public boolean NOT NULL DEFAULT true,
  created_by uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.community_groups ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone authenticated can view public groups" ON public.community_groups
  FOR SELECT TO authenticated USING (is_public = true);

CREATE POLICY "Users can create groups" ON public.community_groups
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Group creators can update" ON public.community_groups
  FOR UPDATE TO authenticated USING (auth.uid() = created_by);

CREATE POLICY "Group creators can delete" ON public.community_groups
  FOR DELETE TO authenticated USING (auth.uid() = created_by);

CREATE POLICY "Admins can manage groups" ON public.community_groups
  FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'));

-- Group Members
CREATE TYPE public.group_member_role AS ENUM ('member', 'admin');

CREATE TABLE public.group_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id uuid NOT NULL REFERENCES public.community_groups(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  role group_member_role NOT NULL DEFAULT 'member',
  joined_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(group_id, user_id)
);

ALTER TABLE public.group_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Members can view group members" ON public.group_members
  FOR SELECT TO authenticated USING (
    EXISTS (SELECT 1 FROM public.group_members gm WHERE gm.group_id = group_members.group_id AND gm.user_id = auth.uid())
    OR EXISTS (SELECT 1 FROM public.community_groups g WHERE g.id = group_members.group_id AND g.is_public = true)
  );

CREATE POLICY "Users can join groups" ON public.group_members
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can leave groups" ON public.group_members
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage members" ON public.group_members
  FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'));

-- Group Messages (chat)
CREATE TABLE public.group_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id uuid NOT NULL REFERENCES public.community_groups(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  content text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.group_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Group members can view messages" ON public.group_messages
  FOR SELECT TO authenticated USING (
    EXISTS (SELECT 1 FROM public.group_members gm WHERE gm.group_id = group_messages.group_id AND gm.user_id = auth.uid())
  );

CREATE POLICY "Group members can send messages" ON public.group_messages
  FOR INSERT TO authenticated WITH CHECK (
    auth.uid() = user_id AND
    EXISTS (SELECT 1 FROM public.group_members gm WHERE gm.group_id = group_messages.group_id AND gm.user_id = auth.uid())
  );

CREATE POLICY "Users can delete own messages" ON public.group_messages
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage messages" ON public.group_messages
  FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'));

-- Enable realtime for group messages
ALTER PUBLICATION supabase_realtime ADD TABLE public.group_messages;

-- Direct Messages
CREATE TABLE public.direct_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id uuid NOT NULL,
  receiver_id uuid NOT NULL,
  content text NOT NULL,
  read boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.direct_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own DMs" ON public.direct_messages
  FOR SELECT TO authenticated USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

CREATE POLICY "Users can send DMs" ON public.direct_messages
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Users can delete own sent DMs" ON public.direct_messages
  FOR DELETE TO authenticated USING (auth.uid() = sender_id);

CREATE POLICY "Receiver can mark as read" ON public.direct_messages
  FOR UPDATE TO authenticated USING (auth.uid() = receiver_id) WITH CHECK (auth.uid() = receiver_id);

-- Enable realtime for DMs
ALTER PUBLICATION supabase_realtime ADD TABLE public.direct_messages;

-- Short Posts (Reels)
CREATE TABLE public.short_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  content text NOT NULL,
  image_url text,
  likes_count integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.short_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone authenticated can view posts" ON public.short_posts
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can create posts" ON public.short_posts
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own posts" ON public.short_posts
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage posts" ON public.short_posts
  FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'));

-- Short Post Likes
CREATE TABLE public.short_post_likes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL REFERENCES public.short_posts(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(post_id, user_id)
);

ALTER TABLE public.short_post_likes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view likes" ON public.short_post_likes
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can like posts" ON public.short_post_likes
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unlike" ON public.short_post_likes
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Function to increment/decrement likes count
CREATE OR REPLACE FUNCTION public.handle_short_post_like()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.short_posts SET likes_count = likes_count + 1 WHERE id = NEW.post_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.short_posts SET likes_count = GREATEST(likes_count - 1, 0) WHERE id = OLD.post_id;
    RETURN OLD;
  END IF;
END;
$$;

CREATE TRIGGER on_short_post_like
  AFTER INSERT OR DELETE ON public.short_post_likes
  FOR EACH ROW EXECUTE FUNCTION public.handle_short_post_like();

-- Update likes_count policy
CREATE POLICY "System can update likes count" ON public.short_posts
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
