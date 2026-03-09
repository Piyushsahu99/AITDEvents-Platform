

## Blog Detail Page at `/blog/:slug`

### What we're building
A new page component `src/pages/BlogDetail.tsx` that displays a full blog post with markdown rendering, author info, metadata, and share functionality. The "Read more →" links on the Blog listing page already point to `/blog/:slug`.

### Implementation

**1. Create `src/pages/BlogDetail.tsx`**
- Use `useParams` to get the `slug` from the URL
- Fetch the blog post from `blog_posts` table filtered by `slug`
- Increment `views` count via a Supabase RPC or direct update (best-effort, ignore errors)
- Render markdown content to HTML using a simple custom renderer (no new dependency — handle `#`, `**`, `*`, `` ` ``, `>`, `-`, `1.`, `[link](url)`, and newlines)
- Layout: cover image hero → title + meta (date, read time, views, tags) → rendered content → share button → back link
- Use `Layout` wrapper, `AnimatedSection` for entrance animations
- Typography: large readable font (prose-like styling via Tailwind classes), responsive sizing
- Loading state with skeleton, 404 state if slug not found

**2. Update `src/App.tsx`**
- Import `BlogDetail` and add route: `<Route path="/blog/:slug" element={<BlogDetail />} />`

### Markdown Rendering Approach
Rather than adding a dependency, we'll write a lightweight `renderMarkdown(text: string): string` utility that converts common markdown patterns to HTML. This covers headings, bold, italic, links, code blocks, blockquotes, and lists — sufficient for the blog content we have.

### No database changes needed
The `blog_posts` table already has all required fields (`slug`, `content`, `cover_image`, `tags`, `hashtags`, `views`, etc.) and the RLS policy allows anyone to read published posts.

