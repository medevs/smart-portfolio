import { getPostData, getAllPostIds, PostContent, getSortedPostsData } from "../../../../utils/markdown";
import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import heroImage from "@/assets/Ahmed.jpg";
import { Calendar, Clock, Tag, User, ArrowLeft } from 'lucide-react';

interface Params {
  id: string;
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const postData = await getPostData(params.id);
  return {
    title: `${postData.title} | Your Name`,
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
      <Link href="/blog" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-8">
        <ArrowLeft size={20} className="mr-2" />
        Back to blog
      </Link>
      <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">{postData.title}</h1>
      <div className="flex flex-wrap items-center text-sm text-gray-600 dark:text-gray-400 mb-8">
        <span className="flex items-center mr-4">
          <Calendar size={16} className="mr-1" />
          {postData.date}
        </span>
        <span className="flex items-center mr-4">
          <Clock size={16} className="mr-1" />
          {postData.readTime}
        </span>
        <span className="flex items-center mr-4">
          <Tag size={16} className="mr-1" />
          {postData.category}
        </span>
        <span className="flex items-center">
          <User size={16} className="mr-1" />
          {postData.author}
        </span>
      </div>
      <Image
        src={`/images/${postData.id}.png`}
        alt={postData.title}
        width={800}
        height={400}
        className="rounded-lg mb-8 object-cover"
      />
      <div
        className="prose dark:prose-invert max-w-none"
        dangerouslySetInnerHTML={{ __html: postData.contentHtml }}
      />
      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-2">Tags:</h3>
        <div className="flex flex-wrap gap-2">
          {postData.tags.map((tag) => (
            <span
              key={tag}
              className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-2 py-1 rounded-full text-sm"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
      {relatedPosts.length > 0 && (
        <div className="mt-12">
          <h3 className="text-2xl font-semibold mb-4">Related Posts</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedPosts.map((post) => (
              <Link key={post.id} href={`/blog/${post.id}`} className="block">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl">
                  <Image
                    src={`/images/${post.id}.jpg`}
                    alt={post.title}
                    width={400}
                    height={200}
                    className="w-full h-40 object-cover"
                  />
                  <div className="p-4">
                    <h4 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                      {post.title}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{post.date}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
      <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
        <h3 className="text-2xl font-semibold mb-4">About the Author</h3>
        <div className="flex items-center">
          <Image
            src={heroImage}
            alt={postData.author}
            width={64}
            height={64}
            className="rounded-full mr-4"
          />
          <div>
            <h4 className="text-lg font-semibold">{postData.author}</h4>
            <p className="text-gray-600 dark:text-gray-400">
              A passionate writer and technologist exploring the intersections of code and creativity.
            </p>
          </div>
        </div>
      </div>
    </article>
  );
}