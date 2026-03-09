import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Layout from "@/components/layout/Layout";
import { AnimatedSection } from "@/components/animated/AnimatedSection";
import { UniversalShareButton } from "@/components/UniversalShareButton";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Calendar, Eye, Clock } from "lucide-react";
import { format } from "date-fns";
import { useEffect } from "react";

function renderMarkdown(text: string): string {
  let html = text
    // Code blocks
    .replace(/```(\w*)\n([\s\S]*?)```/g, '<pre class="rounded-lg bg-muted p-4 overflow-x-auto text-sm my-4"><code>$2</code></pre>')
    // Inline code
    .replace(/`([^`]+)`/g, '<code class="rounded bg-muted px-1.5 py-0.5 text-sm font-mono">$1</code>')
    // Images
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="rounded-lg my-4 max-w-full" />')
    // Links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-primary underline hover:text-primary/80" target="_blank" rel="noopener noreferrer">$1</a>')
    // Headings
    .replace(/^### (.+)$/gm, '<h3 class="text-xl font-semibold mt-8 mb-3">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 class="text-2xl font-bold mt-10 mb-4">$1</h2>')
    .replace(/^# (.+)$/gm, '<h1 class="text-3xl font-bold mt-10 mb-4">$1</h1>')
    // Blockquotes
    .replace(/^> (.+)$/gm, '<blockquote class="border-l-4 border-primary/30 pl-4 italic text-muted-foreground my-4">$1</blockquote>')
    // Bold & italic
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    // Horizontal rule
    .replace(/^---$/gm, '<hr class="my-8 border-border" />')
    // Unordered lists
    .replace(/^- (.+)$/gm, '<li class="ml-6 list-disc">$1</li>')
    // Ordered lists
    .replace(/^\d+\. (.+)$/gm, '<li class="ml-6 list-decimal">$1</li>')
    // Paragraphs (double newline)
    .replace(/\n\n/g, '</p><p class="my-4 leading-relaxed">')
    // Single newlines
    .replace(/\n/g, '<br />');

  return `<p class="my-4 leading-relaxed">${html}</p>`;
}

function estimateReadTime(content: string | null): number {
  if (!content) return 1;
  return Math.max(1, Math.ceil(content.split(/\s+/).length / 200));
}

const BlogDetail = () => {
  const { slug } = useParams<{ slug: string }>();

  const { data: post, isLoading, error } = useQuery({
    queryKey: ["blog-post", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("slug", slug!)
        .eq("published", true)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!slug,
  });

  // Best-effort view increment
  useEffect(() => {
    if (!post?.id) return;
    supabase
      .from("blog_posts")
      .update({ views: (post.views || 0) + 1 })
      .eq("id", post.id)
      .then(() => {});
  }, [post?.id]);

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto max-w-3xl px-4 py-12">
          <Skeleton className="mb-6 h-8 w-48" />
          <Skeleton className="mb-4 h-64 w-full rounded-xl" />
          <Skeleton className="mb-2 h-10 w-3/4" />
          <Skeleton className="mb-8 h-5 w-1/2" />
          <div className="space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-4 w-full" />
            ))}
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !post) {
    return (
      <Layout>
        <div className="container mx-auto flex min-h-[60vh] max-w-3xl flex-col items-center justify-center px-4 py-12 text-center">
          <h1 className="mb-4 text-4xl font-bold">Post Not Found</h1>
          <p className="mb-8 text-muted-foreground">The blog post you're looking for doesn't exist or isn't published yet.</p>
          <Link to="/blog" className="inline-flex items-center gap-2 text-primary hover:underline">
            <ArrowLeft className="h-4 w-4" /> Back to Blog
          </Link>
        </div>
      </Layout>
    );
  }

  const readTime = estimateReadTime(post.content);

  return (
    <Layout>
      <article className="container mx-auto max-w-3xl px-4 py-12">
        <AnimatedSection>
          <Link to="/blog" className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" /> Back to Blog
          </Link>

          {post.cover_image && (
            <img
              src={post.cover_image}
              alt={post.title}
              className="mb-8 w-full rounded-xl object-cover max-h-[400px]"
            />
          )}

          <h1 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">{post.title}</h1>

          <div className="mb-8 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              {format(new Date(post.created_at), "MMMM d, yyyy")}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              {readTime} min read
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Eye className="h-4 w-4" />
              {post.views} views
            </span>
          </div>

          {post.tags && post.tags.length > 0 && (
            <div className="mb-8 flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <Badge key={tag} variant="secondary">{tag}</Badge>
              ))}
            </div>
          )}
        </AnimatedSection>

        <AnimatedSection delay={0.15}>
          {post.content ? (
            <div
              className="prose-custom text-foreground leading-relaxed"
              dangerouslySetInnerHTML={{ __html: renderMarkdown(post.content) }}
            />
          ) : (
            <p className="text-muted-foreground italic">No content available.</p>
          )}
        </AnimatedSection>

        <AnimatedSection delay={0.3}>
          <div className="mt-12 border-t border-border pt-8">
            <UniversalShareButton
              title={post.title}
              description={post.excerpt || ""}
              url={`${window.location.origin}/blog/${post.slug}`}
              type="blog"
              referenceId={post.id}
            />
          </div>
        </AnimatedSection>
      </article>
    </Layout>
  );
};

export default BlogDetail;
