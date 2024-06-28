import ProjectCard from './ProjectCard'

interface Project {
  title: string;
  description: string;
  websiteUrl: string;
  githubUrl: string;
  techStack: string[];
  image: string;
}

const projects: Project[] = [
  {
    title: "E-commerce Platform",
    description: "A full-stack e-commerce solution with real-time inventory management.",
    websiteUrl: "https://ecommerce-example.com",
    githubUrl: "https://github.com/yourusername/ecommerce-platform",
    techStack: ["Next.js", "Node.js", "MongoDB", "Redux"],
    image: "https://picsum.photos/seed/ecommerce/800/600"
  },
  {
    title: "Task Management App",
    description: "A collaborative task management tool with real-time updates.",
    websiteUrl: "https://taskapp-example.com",
    githubUrl: "https://github.com/yourusername/task-management-app",
    techStack: ["React", "Firebase", "Material-UI"],
    image: "https://picsum.photos/seed/taskapp/800/600"
  },
  {
    title: "Weather Forecast",
    description: "A weather forecast application with interactive maps and charts.",
    websiteUrl: "https://weather-example.com",
    githubUrl: "https://github.com/yourusername/weather-forecast",
    techStack: ["Vue.js", "D3.js", "OpenWeatherMap API"],
    image: "https://picsum.photos/seed/weather/800/600"
  },
  // Add more projects as needed
]

export default function ProjectsGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {projects.map((project, index) => (
        <ProjectCard key={index} {...project} />
      ))}
    </div>
  )
}