import { Suspense } from 'react';
import Link from "next/link";
import Image from "next/image";
import { getSortedPostsData, PostData, getAllCategories, getAllTags } from "../../../utils/markdown";
import { Calendar, Clock, Tag, Loader } from 'lucide-react';

export const metadata = {
  title: "Blog | Your Name",
  description: "Explore insightful articles on web development, design, and technology.",
};

async function BlogPosts() {
  const posts = await getSortedPostsData();
  const allCategories = await getAllCategories();
  const allTags = await getAllTags();

  return (
    <>
    {/* <BlogFilters categories={allCategories} tags={allTags} /> */}
      <h1 className="text-4xl font-bold mb-12 text-center text-gray-800 dark:text-white">Insights & Thoughts</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {posts.map((post: PostData) => (
          <Link href={`/blog/${post.id}`} key={post.id} className="group">
            <article className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 h-full flex flex-col">
              <div className="relative h-48 w-full">
                <Image
                  src={`/images/${post.id}.png`}
                  alt={post.title}
                  layout="fill"
                  objectFit="cover"
                  className="transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {post.title}
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-4 flex-grow">{post.description}</p>
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-auto">
                  <span className="flex items-center mr-4">
                    <Calendar size={14} className="mr-1" />
                    {post.date}
                  </span>
                  <span className="flex items-center mr-4">
                    <Clock size={14} className="mr-1" />
                    {post.readTime}
                  </span>
                  <span className="flex items-center">
                    <Tag size={14} className="mr-1" />
                    {post.category}
                  </span>
                </div>
              </div>
            </article>
          </Link>
        ))}
      </div>
    </>
  );
}

export default function BlogPage() {
  return (
    <section className="max-w-6xl mx-auto px-4 py-16">
      <Suspense fallback={
        <div className="flex justify-center items-center h-64">
          <Loader className="animate-spin text-indigo-500" size={48} />
        </div>
      }>
        <BlogPosts />
      </Suspense>
    </section>
  );
}