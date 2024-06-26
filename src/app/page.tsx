import { Metadata } from "next";
import Image from "next/image";
import heroImage from "@/assets/Ahmed.jpg";

export const metadata: Metadata = {
  title: "Home",
  description: "Welcome to Ahmed's portfolio. Explore my work and get in touch.",
};

const technologies = [
  { icon: "🟨", name: "JavaScript" },
  { icon: "🟦", name: "TypeScript" },
  { icon: "⚛️", name: "React" },
  { icon: "⚡️", name: "Next.js" },
  { icon: "🎨", name: "Tailwind CSS" },
  { icon: "🌐", name: "Webix JS" },
  { icon: "📊", name: "Ext JS" },
  { icon: "🟢", name: "Node.js" },
  { icon: "🐘", name: "PHP" },
  { icon: "🍃", name: "MongoDB" },
  { icon: "🗃️", name: "MySQL" },
  { icon: "🔄", name: "Prisma" },
  { icon: "🔧", name: "Git" },
  { icon: "🐙", name: "GitHub" },
  { icon: "🔀", name: "SVN" },
  { icon: "🐳", name: "Docker" },
  { icon: "💻", name: "VS Code" },
  { icon: "🪐", name: "Astro" },
  { icon: "🤖", name: "OpenAI" },
  { icon: "🔗", name: "Langchain" },
];

const featuredProjects = [
  { icon: "💻", name: "Project Alpha", description: "A web app built with React and Next.js" },
  { icon: "📊", name: "Project Beta", description: "A data dashboard using D3.js and Tailwind CSS" },
  { icon: "🎨", name: "Project Gamma", description: "A design system for modern web applications" },
  { icon: "🔧", name: "Project Delta", description: "An API service built with Node.js and Express" },
];

const recentPosts = [
  { title: "Understanding JavaScript Closures", date: "June 15, 2024" },
  { title: "Building Responsive Layouts with Tailwind CSS", date: "May 28, 2024" },
  { title: "Getting Started with TypeScript", date: "April 10, 2024" },
];

export default function HomePage() {
  const currentTime = new Date().toLocaleTimeString();
  const currentLocation = "Bremen, Germany";

  return (
    <div className="flex flex-col min-h-screen">
      <section className="py-12 md:py-24 lg:py-32">
        <div className="container mx-auto px-4 md:px-6 lg:px-8 text-center">
          <div className="mb-8">
            <Image src={heroImage} alt="Hero image" height={450} width={450} className="mx-auto rounded-full shadow-md" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Welcome to My Portfolio</h1>
          <p className="text-lg mb-8">Hi, I'm Ahmed. I build web applications that solve real-world problems.</p>
          <a href="#technologies" className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg">Explore My Work</a>
        </div>
      </section>

      <section className="py-12 md:py-24 lg:py-32 bg-white dark:bg-gray-800">
        <div className="container grid gap-12 px-4 md:px-6 lg:px-8 grid-cols-1 lg:grid-cols-2 xl:grid-cols-4">
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
          </div>

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

          <div className="space-y-4 lg:col-span-2 xl:col-span-4" id="technologies">
            <div className="p-4 max-w-full mx-auto bg-gray-100 dark:bg-gray-700 rounded-lg shadow-lg">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-gray-900 dark:text-gray-50 text-2xl">💻</span>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-50">Technologies</h2>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {technologies.map((tech, index) => (
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
                <img src="https://github-readme-stats.vercel.app/api/top-langs?username=medevs&show_icons=true&locale=en&layout=compact&theme=radical" alt="Top Languages" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
