import Image from "next/image";
import MarkdownContent from '@/components/MarkdownContent';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getSortedPostsData, getPostData, getAllPostIds } from '../../../../utils/markdown';
import Link from "next/link";
import { ArrowLeft, Calendar, Clock, Tag, User } from "lucide-react";
import heroImage from "@/assets/Ahmed.jpeg";

interface BlogPostProps {
  params: { id: string };
}

export async function generateStaticParams() {
  const paths = await getAllPostIds();
  return paths.map((path) => ({
    id: path.params.id,
  }));
}

export async function generateMetadata({ params }: BlogPostProps): Promise<Metadata> {
  const postData = await getPostData(params.id);
  if (!postData) {
    return {
      title: 'Post Not Found',
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
    .filter(post => post.id !== currentPostId && post.category === category)
    .slice(0, 3);
}

export default async function BlogPost({ params }: BlogPostProps) {
  const postData = await getPostData(params.id);

  if (!postData) {
    notFound();
  }

  const relatedPosts = await getRelatedPosts(params.id, postData.category);

  return (
    <article className="max-w-3xl mx-auto px-4 py-16">
      <Link href="/blog" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-8 transition-colors duration-200">
        <ArrowLeft size={20} className="mr-2" />
        <span className="text-lg">Back to blog</span>
      </Link>
      <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white leading-tight">{postData.title}</h1>
      <div className="flex flex-wrap items-center text-sm text-gray-600 dark:text-gray-400 mb-8 space-x-4">
        <span className="flex items-center">
          <Calendar size={16} className="mr-2" />
          {postData.date}
        </span>
        <span className="flex items-center">
          <Clock size={16} className="mr-2" />
          {postData.readTime}
        </span>
        <span className="flex items-center">
          <Tag size={16} className="mr-2" />
          {postData.category}
        </span>
        <span className="flex items-center">
          <User size={16} className="mr-2" />
          {postData.author}
        </span>
        </div>
      <Image
        src={`/images/${postData.id}.png`}
        alt={postData.title}
        width={800}
        height={400}
        className="rounded-lg mb-8 object-cover w-full"
      />
      <MarkdownContent content={postData.content} />

      <div className="mt-12">
        <h3 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">Tags</h3>
        <div className="flex flex-wrap gap-2 mb-12">
          {postData.tags.map((tag) => (
            <span
              key={tag}
              className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm font-medium"
            >
              {tag}
            </span>
          ))}
        </div>
        <h2 className="text-2xl font-bold mb-4">Related Posts</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {relatedPosts.map((post) => (
            <div key={post.id} className="border p-4 rounded">
              <h3 className="font-semibold">{post.title}</h3>
              <p className="text-sm text-gray-600">{post.date}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-700">
        <h3 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white">About the Author</h3>
        <div className="flex items-center bg-gray-100 dark:bg-gray-800 p-6 rounded-lg">
          <Image
            src={heroImage}
            alt={postData.author}
            width={80}
            height={80}
            className="rounded-full mr-6"
          />
          <div>
            <h4 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">{postData.author}</h4>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              A passionate writer and technologist exploring the intersections of code and creativity.
            </p>
          </div>
        </div>
      </div>
    </article>
  );
}

export const revalidate = 3600; // Revalidate every hour