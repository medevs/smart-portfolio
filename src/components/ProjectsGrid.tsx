import ProjectCard from './ProjectCard'

interface Project {
  title: string;
  description: string;
  websiteUrl: string;
  githubUrl: string;
  techStack: string[];
  image: string;
}

const projects = [
  {
    title: "E-commerce Platform",
    description: "A full-stack e-commerce solution with user authentication, product management, and payment integration.",
    technologies: ["Next.js", "Node.js", "MongoDB", "Stripe"],
    githubLink: "https://github.com/username/ecommerce-platform",
    liveLink: "https://myecommerceplatform.com"
  },
  {
    title: "Task Management App",
    description: "A responsive task management application with real-time updates and collaboration features.",
    technologies: ["React", "Firebase", "Tailwind CSS"],
    githubLink: "https://github.com/username/task-manager",
    liveLink: "https://mytaskmanager.com"
  },
  {
    title: "Weather Dashboard",
    description: "An interactive weather dashboard that provides real-time weather information and forecasts.",
    technologies: ["Vue.js", "OpenWeatherMap API", "Chart.js"],
    githubLink: "https://github.com/username/weather-dashboard",
    liveLink: "https://myweatherdashboard.com"
  },
  {
    title: "Portfolio Website",
    description: "A personal portfolio website showcasing projects and skills.",
    technologies: ["Next.js", "Tailwind CSS", "Framer Motion"],
    githubLink: "https://github.com/username/portfolio",
    liveLink: "https://myportfolio.com"
  }
];

export default function ProjectsGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
      {projects.map((project, index) => (
        <ProjectCard key={index} {...project} />
      ))}
    </div>
  )
}