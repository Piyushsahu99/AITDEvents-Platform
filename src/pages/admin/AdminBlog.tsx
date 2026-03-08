import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import AdminLayout from "@/components/admin/AdminLayout";
import ContentTable, { Column, StatusBadge } from "@/components/admin/ContentTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import type { Tables } from "@/integrations/supabase/types";

type BlogPost = Tables<"blog_posts">;

const columns: Column[] = [
  { key: "title", label: "Title" },
  { key: "slug", label: "Slug" },
  { key: "published", label: "Status", render: (v) => <StatusBadge status={v ? "published" : "draft"} /> },
  { key: "views", label: "Views" },
  { key: "created_at", label: "Created", render: (v) => format(new Date(v), "MMM d, yyyy") },
];

const AdminBlog = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ title: "", slug: "", excerpt: "", content: "", cover_image: "", tags: "", published: false });

  const fetchPosts = async () => {
    const { data } = await supabase.from("blog_posts").select("*").order("created_at", { ascending: false });
    setPosts(data ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchPosts(); }, []);

  const generateSlug = (title: string) => title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  const handleCreate = async () => {
    const slug = form.slug || generateSlug(form.title);
    if (!form.title || !slug) {
      toast({ title: "Title is required", variant: "destructive" });
      return;
    }
    const { error } = await supabase.from("blog_posts").insert({
      title: form.title,
      slug,
      excerpt: form.excerpt || null,
      content: form.content || null,
      cover_image: form.cover_image || null,
      tags: form.tags ? form.tags.split(",").map((t) => t.trim()) : null,
      published: form.published,
      author_id: user?.id ?? null,
    });
    if (error) {
      toast({ title: "Error creating post", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Blog post created!" });
      setOpen(false);
      setForm({ title: "", slug: "", excerpt: "", content: "", cover_image: "", tags: "", published: false });
      fetchPosts();
    }
  };

  const handleDelete = async (id: string) => {
    await supabase.from("blog_posts").delete().eq("id", id);
    fetchPosts();
  };

  return (
    <AdminLayout
      title="Blog Posts"
      description="Write and manage blog content"
      actions={
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-hero text-primary-foreground"><Plus className="h-4 w-4 mr-2" />New Post</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
            <DialogHeader><DialogTitle>Create Blog Post</DialogTitle></DialogHeader>
            <div className="space-y-4 pt-2">
              <div><Label>Title *</Label><Input value={form.title} onChange={(e) => { setForm({ ...form, title: e.target.value, slug: generateSlug(e.target.value) }); }} /></div>
              <div><Label>Slug</Label><Input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} /></div>
              <div><Label>Excerpt</Label><Textarea value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} rows={2} /></div>
              <div><Label>Content</Label><Textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} rows={8} /></div>
              <div><Label>Cover Image URL</Label><Input value={form.cover_image} onChange={(e) => setForm({ ...form, cover_image: e.target.value })} placeholder="https://..." /></div>
              <div><Label>Tags (comma separated)</Label><Input value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} placeholder="react, typescript, web" /></div>
              <div className="flex items-center gap-3">
                <Switch checked={form.published} onCheckedChange={(v) => setForm({ ...form, published: v })} />
                <Label>Publish immediately</Label>
              </div>
              <Button className="w-full bg-gradient-hero text-primary-foreground" onClick={handleCreate}>Create Post</Button>
            </div>
          </DialogContent>
        </Dialog>
      }
    >
      <ContentTable columns={columns} data={posts} loading={loading} onDelete={handleDelete} />
    </AdminLayout>
  );
};

export default AdminBlog;
