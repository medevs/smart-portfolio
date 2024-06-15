import { Metadata } from "next";
import Image from "next/image";
import placeholder from "@/assets/placeholder.png";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Blog",
  description: "Discover Ahmed's story and achievements.",
};

const posts = [
  {
    title: "Mastering the Art of Minimalist Design",
    date: "June 14, 2024",
    readTime: "5 min read",
    description: "Discover the power of minimalism in design and how it can transform your projects. Learn the key principles and techniques to create clean, elegant, and impactful designs.",
    imgSrc: placeholder,
  },
  {
    title: "Unleashing the Power of Responsive Design",
    date: "June 7, 2024",
    readTime: "7 min read",
    description: "Explore the best practices and techniques for creating responsive designs that adapt seamlessly to different devices and screen sizes. Learn how to build websites that provide an optimal user experience on any device.",
    imgSrc: placeholder,
  },
  {
    title: "Crafting Engaging User Experiences",
    date: "May 28, 2024",
    readTime: "9 min read",
    description: "Learn how to design user experiences that captivate and delight your audience. Discover the principles of user-centered design and explore practical techniques to create intuitive and enjoyable interfaces.",
    imgSrc: placeholder,
  },
  {
    title: "Unlocking the Secrets of Color Theory",
    date: "May 15, 2024",
    readTime: "6 min read",
    description: "Explore the fundamental principles of color theory and learn how to leverage color to create visually stunning designs. Discover the power of color combinations and how to use them effectively in your projects.",
    imgSrc: placeholder,
  },
  {
    title: "Designing for Accessibility: A Comprehensive Guide",
    date: "May 1, 2024",
    readTime: "8 min read",
    description: "Discover the importance of accessibility in design and learn practical techniques to create inclusive experiences for users of all abilities. Explore the latest standards and guidelines to ensure your designs are accessible and inclusive.",
    imgSrc: placeholder,
  },
  {
    title: "Mastering the Art of Typographic Design",
    date: "April 20, 2024",
    readTime: "7 min read",
    description: "Explore the principles of typography and learn how to use fonts effectively in your designs. Discover techniques for pairing typefaces, creating hierarchy, and optimizing readability to elevate your design projects.",
    imgSrc: placeholder,
  },
];

export default function Page() {
  return (
    <section className="container mx-auto px-4 py-12 lg:py-16">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-2">
        {posts.map((post, index) => (
          <article
            key={index}
            className="rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <Link href="#" prefetch={false}>
              <Image
                src={post.imgSrc}
                width={600}
                height={400}
                alt={`Blog Post Image for ${post.title}`}
                className="w-full h-48 object-cover"
              />
              <div className="p-2 bg-white dark:bg-gray-950">
                <h3 className="text-xl font-bold mb-2">{post.title}</h3>
                <p className="text-gray-500 dark:text-gray-400 line-clamp-3 mb-4">
                  {post.description}
                </p>
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <span>{post.date}</span>
                  <span className="mx-2">•</span>
                  <span>{post.readTime}</span>
                </div>
              </div>
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
