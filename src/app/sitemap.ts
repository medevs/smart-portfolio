import { MetadataRoute } from "next";
import { getSortedPostsData } from "../../utils/markdown";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://medevsmaker.vercel.app";

  // Get all blog posts
  const posts = await getSortedPostsData();

  // Generate blog post URLs
  const blogUrls = posts.map((post) => ({
    url: `${baseUrl}/blog/${post.id}`,
    lastModified: new Date(post.date),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    ...blogUrls,
  ];
}
