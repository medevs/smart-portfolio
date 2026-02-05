import Image from "next/image";
import MarkdownContent from "@/components/MarkdownContent";
import TableOfContents from "@/components/TableOfContents";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import {
  getSortedPostsData,
  getPostData,
  getAllPostIds,
} from "../../../../utils/markdown";
import Link from "next/link";
import { ArrowLeft, Calendar, Clock, Tag, User, Terminal } from "lucide-react";
import heroImage from "@/assets/Ahmed.jpeg";

export async function generateStaticParams() {
  const paths = await getAllPostIds();
  return paths;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const postData = await getPostData(id);

  if (!postData) {
    return {
      title: "Post Not Found",
    };
  }
  return {
    title: postData.title,
    description: postData.description,
  };
}

async function getRelatedPosts(currentPostId: string, category: string) {
  const allPosts = await getSortedPostsData();
  return allPosts
    .filter((post) => post.id !== currentPostId && post.category === category)
    .slice(0, 3);
}

export default async function BlogPost({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const postData = await getPostData(id);

  if (!postData) {
    notFound();
  }

  const relatedPosts = await getRelatedPosts(id, postData.category);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 pb-20">
      {/* Back link */}
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-terminal-muted hover:text-terminal-green transition-colors mb-6 font-mono text-sm"
      >
        <ArrowLeft size={16} />
        <span>cd ~/portfolio</span>
      </Link>

      {/* Terminal header */}
      <div className="flex items-center gap-2 mb-6 font-mono text-sm text-terminal-muted">
        <Terminal size={16} className="text-terminal-green" />
        <span>cat posts/</span>
        <span className="text-terminal-cyan">{id}</span>
        <span>.md</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-8">
        {/* Main content */}
        <div className="max-w-3xl mx-auto lg:mx-0 w-full">
          {/* Title */}
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-6 text-terminal-text leading-tight">
            {postData.title}
          </h1>

          {/* Meta info */}
          <div className="flex flex-wrap items-center gap-4 text-sm font-mono text-terminal-muted mb-8">
            <span className="flex items-center gap-1.5">
              <Calendar size={14} className="text-terminal-cyan" />
              {postData.date}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock size={14} className="text-terminal-cyan" />
              {postData.readTime}
            </span>
            <span className="flex items-center gap-1.5">
              <Tag size={14} className="text-terminal-cyan" />
              {postData.category}
            </span>
            <span className="flex items-center gap-1.5">
              <User size={14} className="text-terminal-cyan" />
              {postData.author}
            </span>
          </div>

          {/* Featured image */}
          <div className="rounded-lg overflow-hidden border border-terminal-border mb-8">
            <Image
              src={`/images/${postData.id}.png`}
              alt={postData.title}
              width={800}
              height={400}
              className="object-cover w-full"
            />
          </div>

          {/* Table of Contents - Mobile */}
          <div className="block lg:hidden mb-8">
            <TableOfContents className="bg-terminal-bg-alt p-4 rounded-lg border border-terminal-border" />
          </div>

          {/* Article content */}
          <article className="overflow-hidden">
            <div className="prose prose-invert prose-terminal max-w-none">
              <MarkdownContent content={postData.content} />
            </div>

            {/* Tags */}
            <div className="mt-12 pt-8 border-t border-terminal-border">
              <h3 className="text-lg font-semibold mb-4 text-terminal-text font-mono">
                # Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {postData.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 rounded-md text-sm font-mono
                               bg-terminal-bg-alt border border-terminal-border
                               text-terminal-cyan"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Related Posts */}
            {relatedPosts.length > 0 && (
              <div className="mt-12 pt-8 border-t border-terminal-border">
                <h3 className="text-lg font-semibold mb-4 text-terminal-text font-mono">
                  # Related Posts
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {relatedPosts.map((post) => (
                    <Link
                      key={post.id}
                      href={`/blog/${post.id}`}
                      className="block p-4 rounded-lg border border-terminal-border
                                 bg-terminal-bg-alt/50 hover:border-terminal-green/50
                                 transition-colors"
                    >
                      <h4 className="font-semibold text-terminal-green mb-2 line-clamp-2">
                        {post.title}
                      </h4>
                      <p className="text-sm text-terminal-muted line-clamp-2">
                        {post.description}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Author */}
            <div className="mt-12 pt-8 border-t border-terminal-border">
              <h3 className="text-lg font-semibold mb-4 text-terminal-text font-mono">
                # Author
              </h3>
              <div className="flex items-center gap-4 p-4 rounded-lg bg-terminal-bg-alt border border-terminal-border">
                <Image
                  src={heroImage}
                  alt={postData.author}
                  width={64}
                  height={64}
                  className="rounded-lg"
                />
                <div>
                  <h4 className="font-semibold text-terminal-green">
                    {postData.author}
                  </h4>
                  <p className="text-sm text-terminal-muted mt-1">
                    Full Stack Developer & AI Engineer exploring the
                    intersections of code and creativity.
                  </p>
                </div>
              </div>
            </div>
          </article>
        </div>

        {/* Sidebar - Desktop */}
        <aside className="hidden lg:block">
          <div className="sticky top-20">
            <TableOfContents className="bg-terminal-bg-alt p-4 rounded-lg border border-terminal-border" />
          </div>
        </aside>
      </div>
    </div>
  );
}
