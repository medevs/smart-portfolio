import Image from "next/image";
import MarkdownContent from '@/components/MarkdownContent';
import TableOfContents from '@/components/TableOfContents';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getSortedPostsData, getPostData, getAllPostIds } from '../../../../utils/markdown';
import Link from "next/link";
import { ArrowLeft, Calendar, Clock, Tag, User } from "lucide-react";
import heroImage from "@/assets/Ahmed.jpeg";

// This matches the return type of getAllPostIds
export async function generateStaticParams() {
  const paths = await getAllPostIds();
  return paths;
}

// Use the same params type for metadata generation
export async function generateMetadata({ 
  params 
}: { 
  params: { id: string } 
}): Promise<Metadata> {
  // In Next.js 15, we need to await params before accessing properties
  const { id } = await params;
  const postData = await getPostData(id);
  
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

// Add searchParams parameter to match Next.js expectations
export default async function BlogPost({ 
  params,
  searchParams
}: { 
  params: { id: string },
  searchParams?: Record<string, string | string[]>
}) {
  // In Next.js 15, we need to await params before accessing properties
  const { id } = await params;
  const postData = await getPostData(id);

  if (!postData) {
    notFound();
  }

  const relatedPosts = await getRelatedPosts(id, postData.category);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <Link href="/blog" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6 transition-colors duration-200">
        <ArrowLeft size={20} className="mr-2" />
        <span className="text-lg">Back to blog</span>
      </Link>
      
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-8">
        {/* Main content */}
        <div className="max-w-3xl mx-auto lg:mx-0 w-full">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-gray-900 dark:text-white leading-tight">{postData.title}</h1>
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
          
          {/* Table of Contents - Mobile and tablet only */}
          <div className="block lg:hidden mb-8">
            <TableOfContents className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg shadow-sm" />
          </div>
          
          <article className="overflow-hidden">
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
              {relatedPosts.length > 0 && (
                <div className="mt-8">
                  <h2 className="text-2xl font-bold mb-4">Related Posts</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {relatedPosts.map((post) => (
                      <a 
                      className="block rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-700 p-6"
                      key={post.id}
                      href={`/blog/${post.id}`}>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{post.title}</h3>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{post.description}</p>
                      </a>
                    ))}
                  </div>
                </div>
              )}
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
                    A passionate Software Developer and technologist exploring the intersections of code and creativity.
                  </p>
                </div>
              </div>
            </div>
          </article>
        </div>
        
        {/* Sidebar with Table of Contents - Desktop only */}
        <aside className="hidden lg:block">
          <div className="sticky top-24">
            <TableOfContents className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg shadow-sm" />
          </div>
        </aside>
      </div>
    </div>
  );
}