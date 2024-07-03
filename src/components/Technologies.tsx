import React from 'react';
import { 
  Code, 
  FileJson, 
  Atom, 
  Zap, 
  Palette, 
  Globe, 
  BarChart, 
  Server, 
  FileCode, 
  Database, 
  Table, 
  GitBranch, 
  Github, 
  GitCommit, 
  Container, 
  Terminal, 
  Rocket, 
  Bot, 
  Link
} from 'lucide-react';

const skills = [
  { icon: <Code />, name: "JavaScript" },
  { icon: <FileJson />, name: "TypeScript" },
  { icon: <Atom />, name: "React" },
  { icon: <Zap />, name: "Next.js" },
  { icon: <Palette />, name: "Tailwind CSS" },
  { icon: <Globe />, name: "Webix JS" },
  { icon: <BarChart />, name: "Ext JS" },
  { icon: <Server />, name: "Node.js" },
  { icon: <FileCode />, name: "PHP" },
  { icon: <Database />, name: "MongoDB" },
  { icon: <Table />, name: "MySQL" },
  { icon: <GitBranch />, name: "Prisma" },
  { icon: <GitCommit />, name: "Git" },
  { icon: <Github />, name: "GitHub" },
  { icon: <GitCommit />, name: "SVN" },
  { icon: <Container />, name: "Docker" },
  { icon: <Terminal />, name: "VS Code" },
  { icon: <Rocket />, name: "Astro" },
  { icon: <Bot />, name: "OpenAI" },
  { icon: <Link />, name: "Langchain" },
];

const Technologies: React.FC = () => {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg md:col-span-2 lg:col-span-3 transition-all duration-300 hover:shadow-xl flex-grow">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white text-center">Technologies</h2>
      <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {skills.map((skill, index) => (
          <li 
            key={index}
            className="flex flex-col items-center p-4 rounded-lg bg-gray-100 dark:bg-gray-700 transition-all duration-300 hover:bg-gray-200 dark:hover:bg-gray-600 hover:scale-105 transform"
          >
            <div className="text-gray-600 dark:text-gray-300 mb-2">
              {React.cloneElement(skill.icon, { size: 24 })}
            </div>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 text-center">{skill.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Technologies;