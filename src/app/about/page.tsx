import { Metadata } from "next";
import Image from "next/image";
import me from "@/assets/Ahmed.jpg";

export const metadata: Metadata = {
  title: "About Me",
  description: "Discover Ahmed's story and achievements.",
};

export default function Page() {
  return (
    <div className="flex flex-col min-h-screen">
      <section className="py-12 md:py-24 lg:py-32">
        <div className="container grid gap-12 px-4 md:px-6 lg:grid-cols-2">
          <div className="space-y-4">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tighter">
              Hi, I&apos;m Ahmed
            </h1>
            <div className="relative overflow-hidden rounded-xl">
              <Image
                src={me}
                alt="A photo of me"
                height={300}
                width={300}
                className="border-2 object-cover shadow-md dark:border-foreground"
              />
            </div>
          </div>
          <div className="space-y-8">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-gray-900 dark:text-gray-50">💻</span>
                <h2 className="text-xl font-bold">Skills</h2>
              </div>
              <ul className="grid gap-2">
                <li className="flex items-center gap-2">
                  <span className="text-gray-500 dark:text-gray-400">⚛️</span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">React.js</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-gray-500 dark:text-gray-400">⚡️</span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">Next.js</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-gray-500 dark:text-gray-400">🔤</span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">TypeScript</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-gray-500 dark:text-gray-400">🟢</span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">Node.js</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-gray-500 dark:text-gray-400">🎨</span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">Tailwind CSS</span>
                </li>
              </ul>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-gray-900 dark:text-gray-50">💼</span>
                <h2 className="text-xl font-bold">Experience</h2>
              </div>
              <ul className="grid gap-2">
                <li className="flex items-center gap-2">
                  <span className="text-gray-500 dark:text-gray-400">📆</span>
                  <div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Software Engineer</div>
                    <div className="text-sm font-medium">Acme Inc.</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">2020 - Present</div>
                  </div>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-gray-500 dark:text-gray-400">📆</span>
                  <div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Front-end Developer</div>
                    <div className="text-sm font-medium">XYZ Corp.</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">2018 - 2020</div>
                  </div>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-gray-500 dark:text-gray-400">📆</span>
                  <div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Intern</div>
                    <div className="text-sm font-medium">Startup Inc.</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">2017 - 2018</div>
                  </div>
                </li>
              </ul>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-gray-900 dark:text-gray-50">📁</span>
                <h2 className="text-xl font-bold">Projects</h2>
              </div>
              <ul className="grid gap-2">
                <li className="flex items-center gap-2">
                  <span className="text-gray-500 dark:text-gray-400">🐙</span>
                  <div>
                    <div className="text-sm font-medium">shadcn/ui</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Beautifully designed components</div>
                  </div>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-gray-500 dark:text-gray-400">🐙</span>
                  <div>
                    <div className="text-sm font-medium">vercel/next.js</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">The React Framework</div>
                  </div>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-gray-500 dark:text-gray-400">🐙</span>
                  <div>
                    <div className="text-sm font-medium">tailwindlabs/tailwindcss</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">A utility-first CSS framework</div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      <section className="py-12 md:py-24 lg:py-32">
        <div className="container grid gap-12 px-4 md:px-6 lg:grid-cols-2">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-gray-900 dark:text-gray-50">🎨</span>
              <h2 className="text-xl font-bold">Hobbies &amp; Interests</h2>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2 rounded-lg bg-gray-100 p-4 dark:bg-gray-800">
                <span className="text-gray-900 dark:text-gray-50">🥾</span>
                <span className="text-sm font-medium text-gray-900 dark:text-gray-50">Hiking</span>
              </div>
              <div className="flex items-center gap-2 rounded-lg bg-gray-100 p-4 dark:bg-gray-800">
                <span className="text-gray-900 dark:text-gray-50">📷</span>
                <span className="text-sm font-medium text-gray-900 dark:text-gray-50">Photography</span>
              </div>
              <div className="flex items-center gap-2 rounded-lg bg-gray-100 p-4 dark:bg-gray-800">
                <span className="text-gray-900 dark:text-gray-50">🎸</span>
                <span className="text-sm font-medium text-gray-900 dark:text-gray-50">Guitar</span>
              </div>
              <div className="flex items-center gap-2 rounded-lg bg-gray-100 p-4 dark:bg-gray-800">
                <span className="text-gray-900 dark:text-gray-50">📚</span>
                <span className="text-sm font-medium text-gray-900 dark:text-gray-50">Reading</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
