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
    <section className="container mx-auto px-4 py-16 lg:py-24">
  <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-800 dark:text-white">
    Latest Blog Posts
  </h2>
  <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-2">
    {posts.map((post, index) => (
      <article
        key={index}
        className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
      >
        <Link href="#" prefetch={false} className="block">
          <div className="relative">
            <Image
              src={post.imgSrc}
              width={600}
              height={400}
              alt={`Blog Post Image for ${post.title}`}
              className="w-full h-60 object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-30 transition-opacity duration-300 opacity-0 hover:opacity-100 flex items-center justify-center">
              <span className="text-white text-lg font-semibold px-4 py-2 rounded-full border-2 border-white">
                Read More
              </span>
            </div>
          </div>
          <div className="p-6">
            <h3 className="text-2xl font-bold mb-3 text-gray-800 dark:text-white">
              {post.title}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 line-clamp-3 mb-4">
              {post.description}
            </p>
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
              <span>{post.date}</span>
              <span className="mx-2">•</span>
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <span>{post.readTime}</span>
            </div>
          </div>
        </Link>
      </article>
    ))}
  </div>
  <div className="text-center mt-12">
    <Link href="/blog" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full transition-colors duration-300">
      View All Posts
    </Link>
  </div>
</section>
  );
}
