import React from 'react';

interface TimelineItem {
  type: 'education' | 'experience';
  title: string;
  organization: string;
  date: string;
  location?: string;
  description?: string;
  skills?: string[];
}

const educationItems: TimelineItem[] = [
  {
    type: 'education',
    title: 'Fachinformatiker Anwendungsentwicklung',
    organization: 'Schulzentrum SII Utbremen Bremen',
    date: 'Sep 2021 - May 2024',
  },
  {
    type: 'education',
    title: 'Networks and Telecommunications',
    organization: 'Université du Littoral Côte d\'Opale',
    date: 'Oct 2018 - Nov 2019',
    description: 'Bachelor\'s degree in Network Admin, IT Security, and Web Dev.',
    skills: ['PHP', 'JavaScript', 'Network Admin', 'IT Security', 'MySQL']
  },
  {
    type: 'education',
    title: 'Computer Development Techniques',
    organization: 'OFPPT Ouarzazate',
    date: 'Sep 2016 - Jul 2018',
    description: 'Comprehensive IT skills training program.',
    skills: ['PHP', 'SQL', 'JavaScript', 'HTML', 'CSS', 'jQuery', 'C#']
  }
];

const experienceItems: TimelineItem[] = [
  {
    type: 'experience',
    title: 'Software Developer',
    organization: 'ePhilos AG',
    date: 'Aug 2021 - Present · 3 yrs',
    location: 'Bremen, Germany · Hybrid',
    skills: ['PHP', 'SQL', 'JavaScript', 'HTML', 'CSS']
  },
  {
    type: 'experience',
    title: 'Freelance Web Developer',
    organization: 'Self-employed',
    date: 'Jan 2020 - Jul 2021 · 1 yr 7 mos',
    location: 'Remote',
    description: 'Developed custom websites and web applications for various clients.',
    skills: ['React', 'Node.js', 'MongoDB', 'GraphQL', 'Tailwind CSS']
  },
  {
    type: 'experience',
    title: 'Software Development Intern',
    organization: 'TechStart Solutions',
    date: 'Jun 2019 - Dec 2019 · 7 mos',
    location: 'Paris, France',
    description: 'Assisted in developing and testing mobile applications.',
    skills: ['Swift', 'Kotlin', 'Git', 'Agile methodologies']
  }
];

const TimelineItem: React.FC<{ item: TimelineItem }> = ({ item }) => (
  <div className="mb-8 relative">
    <div className="absolute top-0 left-0 w-2 h-full bg-gray-200 dark:bg-gray-700" />
    <div className="ml-6 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <div className="absolute left-0 top-4 w-6 h-6 bg-blue-500 rounded-full border-4 border-white dark:border-gray-800" />
      <h3 className="text-lg font-medium text-gray-900 dark:text-white">{item.title}</h3>
      <p className="text-sm text-gray-600 dark:text-gray-400">{item.organization}</p>
      <p className="text-sm text-gray-500 dark:text-gray-500">{item.date}</p>
      {item.location && (
        <p className="text-sm text-gray-500 dark:text-gray-500">{item.location}</p>
      )}
      {item.description && (
        <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">{item.description}</p>
      )}
      {item.skills && (
        <div className="mt-2 flex flex-wrap gap-2">
          {item.skills.map((skill, index) => (
            <span key={index} className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
              {skill}
            </span>
          ))}
        </div>
      )}
    </div>
  </div>
);

const Timeline: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto p-4 bg-gray-100 dark:bg-gray-900 rounded-lg shadow">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-900 dark:text-white">My Journey</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Experience</h2>
          {experienceItems.map((item, index) => (
            <TimelineItem key={index} item={item} />
          ))}
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Education</h2>
          {educationItems.map((item, index) => (
            <TimelineItem key={index} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Timeline;