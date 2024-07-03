import { getPostData, getAllPostIds, PostContent, getSortedPostsData } from "../../../../utils/markdown";
import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import heroImage from "@/assets/Ahmed.jpg";
import { Calendar, Clock, Tag, User, ArrowLeft } from 'lucide-react';
import MarkdownContent from "@/components/MarkdownContent";

interface Params {
  id: string;
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const postData = await getPostData(params.id);
  return {
    title: `${postData.title} | Ahmed`,
    description: postData.description,
  };
}

export async function generateStaticParams() {
  const paths = await getAllPostIds();
  return paths;
}

async function getRelatedPosts(currentPost: PostContent, maxRelated: number = 3) {
  const allPosts = await getSortedPostsData();
  return allPosts
    .filter(post => post.id !== currentPost.id)
    .sort((a, b) => {
      const aCommonTags = a.tags.filter(tag => currentPost.tags.includes(tag)).length;
      const bCommonTags = b.tags.filter(tag => currentPost.tags.includes(tag)).length;
      return bCommonTags - aCommonTags;
    })
    .slice(0, maxRelated);
}

export default async function PostPage({ params }: { params: Params }) {
  const postData: PostContent = await getPostData(params.id);
  const relatedPosts = await getRelatedPosts(postData);

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
        <div className="flex flex-wrap gap-2">
          {postData.tags.map((tag) => (
            <span
              key={tag}
              className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm font-medium"
            >
              {tag}
            </span>
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