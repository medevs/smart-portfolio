// File: utils/markdown.ts
import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';
import readingTime from 'reading-time';

const postsDirectory = path.join(process.cwd(), 'posts');

export interface PostData {
  id: string;
  date: string;
  title: string;
  readTime: string;
  tags: string[];
  category: string;
  description: string;
  author: string;
}

export interface PostContent extends PostData {
  content: string;
}

export async function getSortedPostsData(): Promise<PostData[]> {
  const fileNames = await fs.readdir(postsDirectory);
  const allPostsData = await Promise.all(fileNames.map(async (fileName) => {
    const id = fileName.replace(/\.md$/, '');
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = await fs.readFile(fullPath, 'utf8');
    const matterResult = matter(fileContents);
    const readTime = readingTime(matterResult.content).text;

    return {
      id,
      readTime,
      ...(matterResult.data as Omit<PostData, 'id' | 'readTime'>),
    };
  }));

  return allPostsData.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export async function getPostData(id: string): Promise<PostContent> {
  const fullPath = path.join(postsDirectory, `${id}.md`);
  const fileContents = await fs.readFile(fullPath, 'utf8');
  const matterResult = matter(fileContents);
  const readTime = readingTime(matterResult.content).text;

  return {
    id,
    content: matterResult.content,
    readTime,
    ...(matterResult.data as Omit<PostData, 'id' | 'readTime'>),
  };
}

export async function getAllPostIds(): Promise<{ params: { id: string } }[]> {
  const fileNames = await fs.readdir(postsDirectory);
  return fileNames.map((fileName) => ({
    params: {
      id: fileName.replace(/\.md$/, ''),
    },
  }));
}

export async function getAllTags(): Promise<string[]> {
  const posts = await getSortedPostsData();
  const tags = new Set<string>();
  posts.forEach((post) => {
    post.tags.forEach((tag: string) => tags.add(tag));
  });
  return Array.from(tags);
}

export async function getAllCategories(): Promise<string[]> {
  const posts = await getSortedPostsData();
  const categories = new Set<string>();
  posts.forEach((post) => {
    categories.add(post.category);
  });
  return Array.from(categories);
}