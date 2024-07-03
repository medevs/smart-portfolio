import ProjectsGrid  from "@/components/ProjectsGrid";

export default function Projects() {
  return (
    <div className="min-h-screen">

      <main className="container mx-auto px-4 py-16">
        <h1 className="text-5xl font-bold mb-24 text-center">
          🧑‍💻Projects
        </h1>
        <ProjectsGrid />
      </main>
    </div>
  )
}