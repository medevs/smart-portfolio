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
    title: 'Vocational Training in Application Development',
    organization: 'Schulzentrum SII Utbremen Bremen',
    date: 'Aug 2021 - May 2024',
    description: 'Dual education: Theory and practice in Full Stack Development. Focus on modern web technologies and agile software development practices.',
    skills: ['JavaScript', 'React', 'Node.js', 'SQL', 'Agile Methodologies']
  },
  {
    type: 'education',
    title: 'Bachelor in Networks and Telecommunications',
    organization: 'Université du Littoral Côte d\'Opale',
    date: 'Oct 2018 - Nov 2019',
    description: 'French state diploma focusing on network administration, IT security, and web development. Preparation for CISCO certifications (CCNA1 to CCNA4).',
    skills: ['Network Administration', 'IT Security', 'PHP', 'MySQL', 'Project Management', 'CISCO CCNA']
  },
  {
    type: 'education',
    title: 'Training in Computer Development Techniques',
    organization: 'OFPPT Ouarzazate',
    date: 'Sep 2016 - Jul 2018',
    description: 'Comprehensive training in IT skills, including programming, web development, database management, and networks.',
    skills: ['C#', 'HTML', 'CSS', 'JavaScript', 'SQL', 'WordPress', 'Bootstrap', 'UML']
  }
];

const experienceItems: TimelineItem[] = [
  {
    type: 'experience',
    title: 'Full Stack Developer',
    organization: 'ePhilos AG',
    date: 'Aug 2021 - Present · 2 years 8 months',
    location: 'Bremen, Germany · Hybrid',
    description: 'Responsible for the further development of Comfortmarkt (CM), a software based on PHP, Ext JS, Webix, and MySQL. Optimization of database queries and performance. Implementation of new features focusing on user-friendliness. Application of best practices in software development and code optimization. Conducting unit tests and collaborating on CI/CD processes.',
    skills: ['PHP', 'Ext JS', 'Webix', 'MySQL', 'JavaScript', 'HTML', 'CSS', 'Unit Testing']
  },
  {
    type: 'experience',
    title: 'Web Developer',
    organization: 'Freelancer',
    date: 'Mar 2020 - Jun 2021 · 1 year 4 months',
    location: 'Remote - Morocco',
    description: 'Development of responsive websites (HTML, CSS, Bootstrap, jQuery, WordPress). Customizations and SEO optimization. Close collaboration with clients to implement tailored solutions.',
    skills: ['HTML', 'CSS', 'Bootstrap', 'jQuery', 'WordPress', 'SEO', 'Client Communication']
  },
  {
    type: 'experience',
    title: 'NodeJS Developer (Internship)',
    organization: 'HM Communication',
    date: 'Jul 2019 - Sep 2019 · 3 months',
    location: 'Marrakech, Morocco',
    description: 'Development of web applications with Node.js and Express.js. Working with MongoDB and RESTful APIs.',
    skills: ['Node.js', 'Express.js', 'MongoDB', 'RESTful APIs', 'Git']
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
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-900 dark:text-white">Timeline</h1>
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