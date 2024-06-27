import { Metadata } from "next";
import { skills, recentPosts, featuredProjects } from '../assets/data';
import Hero  from "@/components/Hero";

export const metadata: Metadata = {
  title: "Home",
  description: "Welcome to Ahmed's portfolio. Explore my work and get in touch.",
};

export default function HomePage() {
  const currentTime = new Date().toLocaleTimeString();
  const currentLocation = "Bremen, Germany";

  return (
    <div className="flex flex-col min-h-screen">
      <Hero />
      <section className="">
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
