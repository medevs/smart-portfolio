import { Metadata } from "next";
import Image from "next/image";
import heroImage from "@/assets/Ahmed.jpg";
import { Github, Linkedin, Twitter, Mail } from 'lucide-react';
import { skills, recentPosts, featuredProjects } from '../assets/data';
import AIChatButton from "@/components/AIChatButton";

export const metadata: Metadata = {
  title: "Home",
  description: "Welcome to Ahmed's portfolio. Explore my work and get in touch.",
};

export default function HomePage() {
  const currentTime = new Date().toLocaleTimeString();
  const currentLocation = "Bremen, Germany";

  return (
    <div className="flex flex-col min-h-screen">

      <section className="relative py-12 md:py-24 lg:py-32 transition-colors duration-500 overflow-hidden">
        {/* Background Stars */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="stars">🔆</div>
          <div className="stars">🔆</div>
          <div className="stars">🔆</div>
          <div className="stars">🔆</div>
          <div className="stars">🔆</div>
        </div>

        <div className="container mx-auto px-4 md:px-6 lg:px-8 flex flex-col lg:flex-row items-center justify-between relative z-10">
          <div className="lg:w-1/2 text-center lg:text-left">
            <h1 className="text-5xl font-bold mb-4">
              Welcome to My Portfolio
            </h1>
            <p className="text-lg mb-8">
              Hey there, I&apos;m Ahmed, a Software Developer based in Bremen, Germany. I dive deep into JavaScript and love crafting sleek, efficient web apps. With an eye for detail and a hunger for learning, I&apos;m all about delivering high-quality solutions that meet both user needs and business objectives..
            </p>
            <span>
              <AIChatButton />
            </span>
            <p className="text-lg mb-8">
            AI? Oh, that&apos;s my jam. I geek out on building software that taps into AI magic.
            </p>
            <div className="flex mb-8">
              {/* Social Media Icons */}
              <a href="#" className="mr-4 text-3xl hover:text-blue-500 transition-colors duration-300">
                <Github />
              </a>
              <a href="#" className="mr-4 text-3xl hover:text-blue-500 transition-colors duration-300">
                <Linkedin />
              </a>
              <a href="#" className="mr-4 text-3xl hover:text-blue-500 transition-colors duration-300">
                <Twitter />
              </a>
              <a href="mailto:ahmed@example.com" className="mr-4 text-3xl hover:text-blue-500 transition-colors duration-300">
                <Mail />
              </a>
            </div>
          </div>
          <div className="lg:w-1/2 flex justify-center lg:justify-end mt-6 lg:mt-0">
            <Image
              src={heroImage}
              alt="Ahmed's profile picture"
              className="rounded-full shadow-md h-64 w-64 object-cover object-center"
            />
          </div>
        </div>
      </section >
      <section className="py-12 md:py-24 lg:py-32">
        <div className="container grid gap-12 px-4 md:px-6 lg:px-8 grid-cols-1 lg:grid-cols-2 xl:grid-cols-4">

          <div className="space-y-4 lg:col-span-2 xl:col-span-4">
            <div className="p-4 max-w-full mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-gray-900 dark:text-gray-50 text-2xl">🚀</span>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-50">Featured Projects</h2>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {featuredProjects.map((project, index) => (
                  <div key={index} className="p-4 rounded-lg bg-gray-100 dark:bg-gray-700 shadow-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg text-gray-500 dark:text-gray-400">{project.icon}</span>
                      <span className="text-xl font-bold text-gray-900 dark:text-gray-50">{project.name}</span>
                    </div>
                    <p className="text-md text-gray-700 dark:text-gray-300">{project.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4 lg:col-span-2 xl:col-span-2">
            <div className="p-4 max-w-full mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-gray-900 dark:text-gray-50 text-2xl">📝</span>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-50">Recent Blog Posts</h2>
              </div>
              <ul className="space-y-4">
                {recentPosts.map((post, index) => (
                  <li key={index} className="p-4 rounded-lg bg-gray-100 dark:bg-gray-700 shadow-lg">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-50">{post.title}</h3>
                    <p className="text-md text-gray-700 dark:text-gray-300">{post.date}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="space-y-4 lg:col-span-2 xl:col-span-2">

            <div className="p-4 max-w-full mx-auto bg-gray-100 dark:bg-gray-700 rounded-lg shadow-lg">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-gray-900 dark:text-gray-50 text-2xl">📍</span>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-50">Current Location & Time</h2>
              </div>
              <p className="text-md text-gray-700 dark:text-gray-300">
                <strong>Location:</strong> {currentLocation}
              </p>
              <p className="text-md text-gray-700 dark:text-gray-300">
                <strong>Time:</strong> {currentTime}
              </p>
            </div>

            <div className="p-4 max-w-full mx-auto bg-gray-100 dark:bg-gray-700 rounded-lg shadow-lg">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-gray-900 dark:text-gray-50 text-2xl">🔆</span>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-50">I Love Tagine</h2>
              </div>
            </div>

            <div className="p-4 max-w-full mx-auto bg-gray-100 dark:bg-gray-700 rounded-lg shadow-lg">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-gray-900 dark:text-gray-50 text-2xl">🔆</span>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-50">I Love Tagine</h2>
              </div>
            </div>

          </div>

          <div className="space-y-4 lg:col-span-2 xl:col-span-4" id="skills">
            <div className="p-4 max-w-full mx-auto bg-gray-100 dark:bg-gray-700 rounded-lg shadow-lg">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-gray-900 dark:text-gray-50 text-2xl">💻</span>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-50">skills</h2>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {skills.map((tech, index) => (
                  <div key={index} className="p-4 rounded-lg bg-white dark:bg-gray-800 shadow-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg text-gray-500 dark:text-gray-400">{tech.icon}</span>
                      <span className="text-xl font-bold text-gray-900 dark:text-gray-50">{tech.name}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4 lg:col-span-2 xl:col-span-4">
            <div className="p-4 max-w-full mx-auto bg-gray-100 dark:bg-gray-700 rounded-lg shadow-lg">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-gray-900 dark:text-gray-50 text-2xl">📊</span>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-50">GitHub Stats</h2>
              </div>
              <div className="flex justify-center">
                <img height={590} width={590} src="https://github-readme-stats.vercel.app/api/top-langs?username=medevs&show_icons=true&locale=en&layout=compact&theme=radical" alt="Top Languages" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div >
  );
}
