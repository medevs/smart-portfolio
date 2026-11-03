import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import readingTime from "reading-time";

const postsDirectory = path.join(process.cwd(), "posts");
const validId = (id: string) => /^[a-z0-9][a-z0-9_-]*$/i.test(id);

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

async function postIds(): Promise<string[]> {
  const entries = await fs.readdir(postsDirectory, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isFile() && entry.name.endsWith(".md"))
    .map((entry) => entry.name.slice(0, -3))
    .filter(validId)
    .sort();
}

export async function getPostData(id: string): Promise<PostContent | null> {
  if (!validId(id)) return null;
  let source: string;
  try {
    source = await fs.readFile(path.join(postsDirectory, `${id}.md`), "utf8");
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return null;
    throw error;
  }
  const { data, content } = matter(source);
  const text = (key: string, fallback = "") =>
    typeof data[key] === "string" ? data[key] : fallback;
  return {
    id,
    content,
    readTime: readingTime(content).text,
    title: text("title", id),
    date: text("date"),
    category: text("category", "Journal"),
    description: text("description"),
    author: text("author", "medevsmaker"),
    tags: Array.isArray(data.tags)
      ? data.tags.filter((tag): tag is string => typeof tag === "string")
      : [],
  };
}

export async function getSortedPostsData(): Promise<PostData[]> {
  const posts = await Promise.all((await postIds()).map(getPostData));
  return posts
    .filter((post): post is PostContent => post !== null)
    .map(({ content: _content, ...post }) => post)
    .sort((a, b) => b.date.localeCompare(a.date) || a.id.localeCompare(b.id));
}

/** App Router expects segment objects, not the Pages Router's nested params. */
export async function getAllPostIds(): Promise<{ id: string }[]> {
  return (await postIds()).map((id) => ({ id }));
}
