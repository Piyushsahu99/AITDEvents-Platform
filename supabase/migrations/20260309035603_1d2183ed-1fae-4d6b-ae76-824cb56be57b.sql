
-- Drop the overly permissive update policy
DROP POLICY "System can update likes count" ON public.short_posts;

-- Replace with user-scoped update (only own posts) + security definer trigger handles likes_count
CREATE POLICY "Users can update own posts" ON public.short_posts
  FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
