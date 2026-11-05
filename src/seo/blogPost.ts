import type { Metadata } from "next";
import { seoConfig } from "../config/seo";

interface BlogPostSeoInput {
  id: string;
  title: string;
  description: string;
  date: string;
  author: string;
}

const OG_IMAGE_PATH = "/opengraph-image";

export function blogPostUrl(id: string): string {
  return `${seoConfig.siteUrl}/blog/${encodeURIComponent(id)}`;
}

function isoDate(date: string): string {
  const parsed = new Date(date);
  return Number.isNaN(parsed.getTime()) ? date : parsed.toISOString();
}

export function buildBlogPostMetadata(post: BlogPostSeoInput | null): Metadata {
  if (!post) return { title: "Post Not Found", robots: { index: false } };
  const url = blogPostUrl(post.id);
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.description,
      url,
      siteName: seoConfig.siteName,
      publishedTime: isoDate(post.date),
      authors: [post.author],
      images: [OG_IMAGE_PATH],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: [OG_IMAGE_PATH],
    },
  };
}

export function buildBlogPostingJsonLd(post: BlogPostSeoInput): string {
  const url = blogPostUrl(post.id);
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: isoDate(post.date),
    author: { "@type": "Person", name: post.author },
    url,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
  }).replace(/</g, "\\u003c");
}
