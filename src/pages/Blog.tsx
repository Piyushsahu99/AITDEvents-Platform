import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import Layout from "@/components/layout/Layout";
import { SkeletonGrid, SkeletonBlogCard } from "@/components/ui/skeleton-loader";
import { AnimatedSection, AnimatedStagger, AnimatedStaggerItem } from "@/components/animated/AnimatedSection";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { UniversalShareButton } from "@/components/UniversalShareButton";
import { FileText, Search, Calendar, Eye, Clock } from "lucide-react";
import { format } from "date-fns";
import type { Tables } from "@/integrations/supabase/types";

type BlogPost = Tables<"blog_posts">;

const BlogCard = ({ post }: { post: BlogPost }) => {
  const readTime = Math.ceil((post.content?.length ?? 0) / 1500);

  return (
    <Card className="group overflow-hidden border-border/50 bg-card transition-all duration-300 hover:shadow-elegant hover:-translate-y-1">
      {/* Cover Image */}
      <div className="relative h-48 overflow-hidden bg-gradient-primary">
        {post.cover_image ? (
          <img
            src={post.cover_image}
            alt={post.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <FileText className="h-16 w-16 text-primary-foreground/40" />
          </div>
        )}
        {/* Tags overlay */}
        {post.tags && post.tags.length > 0 && (
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
            {post.tags.slice(0, 2).map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="bg-background/90 backdrop-blur-sm text-xs"
              >
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </div>

      <CardContent className="p-5 space-y-3">
        {/* Title */}
        <h3 className="font-display text-lg font-bold leading-snug text-foreground line-clamp-2 group-hover:text-primary transition-colors">
          {post.title}
        </h3>

        {/* Excerpt */}
        {post.excerpt && (
          <p className="text-sm text-muted-foreground line-clamp-2">{post.excerpt}</p>
        )}

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {format(new Date(post.created_at), "MMM d, yyyy")}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {readTime} min read
          </span>
          {post.views > 0 && (
            <span className="flex items-center gap-1">
              <Eye className="h-3 w-3" />
              {post.views.toLocaleString()} views
            </span>
          )}
        </div>

        {/* Hashtags */}
        {post.hashtags && post.hashtags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {post.hashtags.slice(0, 3).map((tag) => (
              <span key={tag} className="text-xs text-primary/80 font-medium">
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Share */}
        <div className="pt-2 flex items-center justify-between">
          <a
            href={`/blog/${post.slug}`}
            className="text-sm font-medium text-primary hover:underline"
          >
            Read more →
          </a>
          <UniversalShareButton
            title={post.title}
            description={post.excerpt ?? ""}
            type="blog"
            referenceId={post.id}
            compact
            variant="ghost"
            showRewardBadge={false}
          />
        </div>
      </CardContent>
    </Card>
  );
};

const Blog = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeTag, setActiveTag] = useState("All");

  useEffect(() => {
    const fetchPosts = async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("published", true)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching posts:", error);
      }
      setPosts(data ?? []);
      setLoading(false);
    };
    fetchPosts();
  }, []);

  // Extract unique tags
  const allTags = useMemo(() => {
    const tags = posts.flatMap((p) => p.tags ?? []);
    return [...new Set(tags)].sort();
  }, [posts]);

  // Filter posts
  const filtered = useMemo(() => {
    return posts.filter((p) => {
      const matchesSearch =
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        (p.excerpt ?? "").toLowerCase().includes(search.toLowerCase()) ||
        (p.content ?? "").toLowerCase().includes(search.toLowerCase());
      const matchesTag =
        activeTag === "All" || (p.tags ?? []).includes(activeTag);
      return matchesSearch && matchesTag;
    });
  }, [posts, search, activeTag]);

  return (
    <Layout>
      <section className="container py-12 space-y-8">
        {/* Header */}
        <AnimatedSection>
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-primary">
                <FileText className="h-5 w-5 text-primary-foreground" />
              </div>
              <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
                Blog & <span className="text-gradient">Insights</span>
              </h1>
            </div>
            <p className="text-muted-foreground max-w-2xl">
              Explore articles on tech, career tips, open source, and student
              success stories from the AITD community.
            </p>
          </div>
        </AnimatedSection>

        {/* Filters */}
        <AnimatedSection delay={0.1}>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            {/* Search */}
            <div className="relative max-w-xs w-full">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search posts..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>

            {/* Tag filters */}
            <div className="flex flex-wrap gap-2">
              <Badge
                variant={activeTag === "All" ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => setActiveTag("All")}
              >
                All
              </Badge>
              {allTags.slice(0, 5).map((tag) => (
                <Badge
                  key={tag}
                  variant={activeTag === tag ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => setActiveTag(tag)}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </AnimatedSection>

        {/* Grid */}
        {loading ? (
          <SkeletonGrid count={6} component={SkeletonBlogCard} />
        ) : filtered.length === 0 ? (
          <AnimatedSection>
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <FileText className="h-12 w-12 text-muted-foreground/40 mb-4" />
              <h3 className="font-display text-xl font-semibold">
                No posts found
              </h3>
              <p className="text-muted-foreground mt-1">
                Check back soon for new articles!
              </p>
            </div>
          </AnimatedSection>
        ) : (
          <AnimatedStagger
            staggerDelay={0.08}
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {filtered.map((post) => (
              <AnimatedStaggerItem key={post.id}>
                <BlogCard post={post} />
              </AnimatedStaggerItem>
            ))}
          </AnimatedStagger>
        )}
      </section>
    </Layout>
  );
};

export default Blog;
