import { Metadata } from "next";
import Image from "next/image";
import me from "@/assets/Ahmed.jpg";
import { skills, projects, timeline } from '../../assets/data';

export const metadata: Metadata = {
  title: "About Me",
  description: "Discover Ahmed's story and achievements.",
};

// const skills = [
//   { icon: "🟨", name: "JavaScript" },
//   { icon: "🟦", name: "TypeScript" },
//   { icon: "⚛️", name: "React" },
//   { icon: "⚡️", name: "Next.js" },
//   { icon: "🎨", name: "Tailwind CSS" },
//   { icon: "🌐", name: "Webix JS" },
//   { icon: "📊", name: "Ext JS" },
//   { icon: "🟢", name: "Node.js" },
//   { icon: "🐘", name: "PHP" },
//   { icon: "🍃", name: "MongoDB" },
//   { icon: "🗃️", name: "MySQL" },
//   { icon: "🔄", name: "Prisma" },
//   { icon: "🔧", name: "Git" },
//   { icon: "🐙", name: "GitHub" },
//   { icon: "🔀", name: "SVN" },
//   { icon: "🐳", name: "Docker" },
//   { icon: "💻", name: "VS Code" },
//   { icon: "🪐", name: "Astro" },
//   { icon: "🤖", name: "OpenAI" },
//   { icon: "🔗", name: "Langchain" },
// ];

// const projects = [
//   { icon: "💻", name: "Web App" },
//   { icon: "📊", name: "Data Dashboard" },
//   { icon: "🎨", name: "Design System" },
//   { icon: "🔧", name: "API Service" },
//   { icon: "🤖", name: "AI Agent" },
// ];

// const timeline = [
//   { year: "2020", event: "Started learning JavaScript" },
//   { year: "2021", event: "Built my first web application" },
//   { year: "2022", event: "Joined a tech company as a developer" },
//   { year: "2023", event: "Started contributing to open source" },
// ];

export default function Page() {
  return (
    <div className="flex flex-col min-h-screen">
      <section className="py-12 md:py-24 lg:py-32">
        <div className="container grid gap-12 px-4 md:px-6 lg:px-8 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
          <div className="space-y-4 lg:col-span-1 xl:col-span-1">
            <div className="p-4 max-w-full mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-gray-900 dark:text-gray-50 text-2xl">👤</span>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-50">About me</h2>
              </div>
              <div className="relative overflow-hidden rounded-xl">
                <Image
                  src={me}
                  alt="A photo of me"
                  height={450}
                  width={450}
                  className="border-2 object-cover shadow-md dark:border-foreground"
                />
              </div>
            </div>
          </div>

          <div className="space-y-8 lg:col-span-1 xl:col-span-2">
            <div className="p-4 max-w-full mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-gray-900 dark:text-gray-50 text-2xl">💻</span>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-50">Skills</h2>
              </div>
              <ul className="flex flex-wrap gap-4 justify-center">
                {skills.map((skill, index) => (
                  <li key={index} className="flex items-center gap-2 p-2 rounded-lg bg-gray-100 dark:bg-gray-700">
                    <span className="text-lg text-gray-500 dark:text-gray-400">{skill.icon}</span>
                    <span className="text-md font-medium text-gray-700 dark:text-gray-300">{skill.name}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 max-w-full mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-gray-900 dark:text-gray-50 text-2xl">🚀</span>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-50">Projects</h2>
              </div>
              <ul className="flex flex-wrap gap-4 justify-center">
                {projects.map((project, index) => (
                  <li key={index} className="flex items-center gap-2 p-2 rounded-lg bg-gray-100 dark:bg-gray-700">
                    <span className="text-lg text-gray-500 dark:text-gray-400">{project.icon}</span>
                    <span className="text-md font-medium text-gray-700 dark:text-gray-300">{project.name}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 max-w-full mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-gray-900 dark:text-gray-50 text-2xl">🕒</span>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-50">Timeline</h2>
              </div>
              <ul className="space-y-4">
                {timeline.map((item, index) => (
                  <li key={index} className="flex items-center gap-2 p-2 rounded-lg bg-gray-100 dark:bg-gray-700">
                    <span className="text-lg text-gray-500 dark:text-gray-400">{item.year}</span>
                    <span className="text-md font-medium text-gray-700 dark:text-gray-300">{item.event}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="space-y-4 lg:col-span-1 xl:col-span-3">
            <div className="p-4 max-w-full mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-gray-900 dark:text-gray-50 text-2xl">🎨</span>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-50">Hobbies & Interests</h2>
              </div>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                <div className="flex items-center gap-2 rounded-lg bg-gray-100 p-4 dark:bg-gray-800">
                  <span className="text-lg text-gray-900 dark:text-gray-50">🥾</span>
                  <span className="text-md font-medium text-gray-900 dark:text-gray-50">Hiking</span>
                </div>
                <div className="flex items-center gap-2 rounded-lg bg-gray-100 p-4 dark:bg-gray-800">
                  <span className="text-lg text-gray-900 dark:text-gray-50">🎸</span>
                  <span className="text-md font-medium text-gray-900 dark:text-gray-50">Guitar</span>
                </div>
                <div className="flex items-center gap-2 rounded-lg bg-gray-100 p-4 dark:bg-gray-800">
                  <span className="text-lg text-gray-900 dark:text-gray-50">🎨</span>
                  <span className="text-md font-medium text-gray-900 dark:text-gray-50">Painting</span>
                </div>
                <div className="flex items-center gap-2 rounded-lg bg-gray-100 p-4 dark:bg-gray-800">
                  <span className="text-lg text-gray-900 dark:text-gray-50">📚</span>
                  <span className="text-md font-medium text-gray-900 dark:text-gray-50">Reading</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
