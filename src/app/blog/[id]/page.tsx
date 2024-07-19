import Image from "next/image";
import MarkdownContent from '@/components/MarkdownContent';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getSortedPostsData, getPostData, getAllPostIds } from '../../../../utils/markdown';

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
    <article className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-4">{postData.title}</h1>
      <div className="mb-8 text-gray-600">
        <span>{postData.date}</span> • <span>{postData.readTime}</span> • <span>{postData.category}</span>
      </div>
      <div className="relative h-64 mb-8">
        <Image
          src={`/images/${postData.id}.png`}
          alt={postData.title}
          fill
          style={{ objectFit: "cover" }}
        />
      </div>
      <div className="flex items-center mb-8">
        <Image
          src={`/images/authors/${postData.author}.jpg`}
          alt={postData.author}
          width={50}
          height={50}
          className="rounded-full mr-4"
        />
        <span>{postData.author}</span>
      </div>
      <MarkdownContent content={postData.content} />
      <div className="mt-12">
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
    </article>
  );
}

export const revalidate = 3600; // Revalidate every hour