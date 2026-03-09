import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { ArrowLeft, Heart, MessageCircle, Plus, Loader2, Sparkles, ChevronUp, ChevronDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface ShortPost {
  id: string;
  user_id: string;
  content: string;
  image_url: string | null;
  likes_count: number;
  created_at: string;
  profile?: { full_name: string | null };
  liked_by_me?: boolean;
}

const CommunityFeed = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const containerRef = useRef<HTMLDivElement>(null);

  const [posts, setPosts] = useState<ShortPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  const [createOpen, setCreateOpen] = useState(false);
  const [newContent, setNewContent] = useState("");
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { navigate("/auth"); return; }
    fetchPosts();
  }, [user, authLoading]);

  const fetchPosts = async () => {
    setLoading(true);
    const { data: postsData } = await supabase
      .from("short_posts")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);

    // Get profiles
    const userIds = [...new Set(postsData?.map((p) => p.user_id) || [])];
    const { data: profiles } = await supabase.from("profiles").select("id, full_name").in("id", userIds);
    const profileMap = new Map(profiles?.map((p) => [p.id, p]) || []);

    // Get likes by me
    const { data: myLikes } = await supabase
      .from("short_post_likes")
      .select("post_id")
      .eq("user_id", user!.id);
    const myLikesSet = new Set(myLikes?.map((l) => l.post_id) || []);

    setPosts(
      (postsData || []).map((p) => ({
        ...p,
        profile: profileMap.get(p.user_id),
        liked_by_me: myLikesSet.has(p.id),
      }))
    );
    setLoading(false);
  };

  const handleLike = async (postId: string, liked: boolean) => {
    if (liked) {
      await supabase.from("short_post_likes").delete().eq("post_id", postId).eq("user_id", user!.id);
    } else {
      await supabase.from("short_post_likes").insert({ post_id: postId, user_id: user!.id });
    }

    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? { ...p, liked_by_me: !liked, likes_count: liked ? p.likes_count - 1 : p.likes_count + 1 }
          : p
      )
    );
  };

  const handleCreate = async () => {
    if (!newContent.trim()) return;
    setCreating(true);
    const { error } = await supabase.from("short_posts").insert({ user_id: user!.id, content: newContent.trim() });
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Posted!", description: "Your post is now live." });
      setCreateOpen(false);
      setNewContent("");
      fetchPosts();
      setCurrentIndex(0);
    }
    setCreating(false);
  };

  const goNext = useCallback(() => {
    if (currentIndex < posts.length - 1) setCurrentIndex((i) => i + 1);
  }, [currentIndex, posts.length]);

  const goPrev = useCallback(() => {
    if (currentIndex > 0) setCurrentIndex((i) => i - 1);
  }, [currentIndex]);

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown" || e.key === "j") goNext();
      if (e.key === "ArrowUp" || e.key === "k") goPrev();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [goNext, goPrev]);

  // Scroll snap navigation
  const handleWheel = useCallback(
    (e: WheelEvent) => {
      e.preventDefault();
      if (e.deltaY > 30) goNext();
      else if (e.deltaY < -30) goPrev();
    },
    [goNext, goPrev]
  );

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    container.addEventListener("wheel", handleWheel, { passive: false });
    return () => container.removeEventListener("wheel", handleWheel);
  }, [handleWheel]);

  if (authLoading || loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  const currentPost = posts[currentIndex];

  return (
    <Layout>
      <div className="min-h-screen pt-16" ref={containerRef}>
        {/* Header */}
        <div className="fixed top-16 left-0 right-0 z-40 glass">
          <div className="container flex items-center gap-3 h-14">
            <Button variant="ghost" size="icon" onClick={() => navigate("/community")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex-1">
              <h1 className="font-semibold">Feed</h1>
              <p className="text-xs text-muted-foreground">{posts.length} posts</p>
            </div>
            <Button onClick={() => setCreateOpen(true)} size="sm" className="bg-gradient-hero text-primary-foreground">
              <Plus className="h-4 w-4 mr-1" /> Post
            </Button>
          </div>
        </div>

        {/* Feed */}
        <div className="pt-14 h-[calc(100vh-4rem)] flex items-center justify-center relative">
          {posts.length === 0 ? (
            <div className="text-center text-muted-foreground">
              <Sparkles className="h-12 w-12 mx-auto mb-4 opacity-30" />
              <p>No posts yet. Be the first!</p>
              <Button className="mt-4" onClick={() => setCreateOpen(true)}>Create Post</Button>
            </div>
          ) : currentPost ? (
            <div className="w-full max-w-md mx-auto px-4">
              {/* Post Card */}
              <div className="bg-card border border-border rounded-2xl p-6 shadow-lg min-h-[60vh] flex flex-col">
                {/* Author */}
                <div className="flex items-center gap-3 mb-4">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-primary/10 text-primary text-sm font-bold">
                      {currentPost.profile?.full_name?.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) || "?"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-sm">{currentPost.profile?.full_name || "Anonymous"}</p>
                    <p className="text-xs text-muted-foreground">{new Date(currentPost.created_at).toLocaleDateString()}</p>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 flex items-center">
                  <p className="text-lg leading-relaxed whitespace-pre-wrap">{currentPost.content}</p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-4 mt-6 pt-4 border-t border-border">
                  <button
                    onClick={() => handleLike(currentPost.id, !!currentPost.liked_by_me)}
                    className={cn(
                      "flex items-center gap-2 transition-colors",
                      currentPost.liked_by_me ? "text-red-500" : "text-muted-foreground hover:text-red-500"
                    )}
                  >
                    <Heart className={cn("h-6 w-6", currentPost.liked_by_me && "fill-current")} />
                    <span className="font-medium">{currentPost.likes_count}</span>
                  </button>
                  <button
                    onClick={() => navigate(`/community/messages?with=${currentPost.user_id}`)}
                    className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
                  >
                    <MessageCircle className="h-6 w-6" />
                    <span className="text-sm">Message</span>
                  </button>
                </div>
              </div>

              {/* Nav indicators */}
              <div className="flex justify-center gap-2 mt-6">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={goPrev}
                  disabled={currentIndex === 0}
                  className="rounded-full"
                >
                  <ChevronUp className="h-5 w-5" />
                </Button>
                <span className="text-sm text-muted-foreground self-center">
                  {currentIndex + 1} / {posts.length}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={goNext}
                  disabled={currentIndex === posts.length - 1}
                  className="rounded-full"
                >
                  <ChevronDown className="h-5 w-5" />
                </Button>
              </div>
            </div>
          ) : null}
        </div>
      </div>

      {/* Create Post Dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create a Post</DialogTitle>
          </DialogHeader>
          <Textarea
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            placeholder="What's on your mind?"
            rows={5}
            maxLength={500}
          />
          <p className="text-xs text-muted-foreground text-right">{newContent.length}/500</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>Cancel</Button>
            <Button onClick={handleCreate} disabled={creating || !newContent.trim()} className="bg-gradient-hero text-primary-foreground">
              {creating ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Post
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default CommunityFeed;
