import Head from 'next/head'
import ProjectsGrid  from "@/components/ProjectsGrid";

export default function Projects() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <Head>
        <title>My Portfolio - Projects</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto px-4 py-16">
        <h1 className="text-5xl font-bold mb-8 text-center">
          My Projects
        </h1>
        <ProjectsGrid />
      </main>
    </div>
  )
}