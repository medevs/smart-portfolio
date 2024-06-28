// components/Technologies.tsx
import React from 'react';

interface Skill {
  icon: string;
  name: string;
}

interface TechnologiesProps {
  skills: Skill[];
}

const Technologies: React.FC<TechnologiesProps> = ({ skills }) => {
  return (
    <div className={`bg-neutral-400 p-4 rounded-lg shadow-md md:col-span-2 lg:col-span-3`}>
      <h2 className="text-xl font-semibold mb-4">Technologies</h2>
      <ul className="flex flex-wrap gap-4 justify-center">
        {skills.map((skill, index) => (
          <li key={index} className="flex items-center gap-2 p-2 rounded-lg bg-gray-100 dark:bg-gray-700">
            <span className="text-sm text-gray-500 dark:text-gray-400">{skill.icon}</span>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{skill.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Technologies;