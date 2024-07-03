import React from 'react';
import { Briefcase, GraduationCap, Calendar, MapPin } from 'lucide-react';

interface TimelineItem {
  type: 'education' | 'experience';
  title: string;
  organization: string;
  date: string;
  location?: string;
  description?: string;
  skills?: string[];
}

const timelineItems: TimelineItem[] = [
  {
    type: 'experience',
    title: 'Software Developer',
    organization: 'ePhilos AG',
    date: 'Aug 2021 - Present · 3 yrs',
    location: 'Bremen, Germany · Hybrid',
    skills: ['PHP', 'SQL', 'JavaScript', 'HTML', 'CSS']
  },
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

const HexagonTimeline: React.FC = () => {
  return (
    <section className="py-16 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-16 text-gray-800 dark:text-white">
          My Journey
        </h2>
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-blue-500 dark:bg-blue-400" />
          
          {timelineItems.map((item, index) => (
            <div key={index} className={`mb-24 flex justify-between items-center w-full ${
              index % 2 === 0 ? 'flex-row-reverse' : ''
            }`}>
              <div className="order-1 w-5/12" />
              <div className="z-20 flex items-center order-1 bg-blue-500 dark:bg-blue-400 shadow-xl w-16 h-16 rounded-full">
                <h1 className="mx-auto font-semibold text-lg text-white">
                  {item.type === 'education' ? (
                    <GraduationCap size={24} />
                  ) : (
                    <Briefcase size={24} />
                  )}
                </h1>
              </div>
              <div className="order-1 bg-white dark:bg-gray-800 rounded-lg shadow-xl w-5/12 px-6 py-4 transform hover:scale-105 transition-transform duration-300 ease-in-out">
                <div className="absolute top-0 -mt-8 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[20px] border-l-transparent border-r-[20px] border-r-transparent border-b-[20px] border-b-white dark:border-b-gray-800" />
                <h3 className="mb-3 font-bold text-gray-800 dark:text-white text-xl">{item.title}</h3>
                <h4 className="mb-3 font-semibold text-blue-600 dark:text-blue-400 text-lg">{item.organization}</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 flex items-center">
                  <Calendar size={14} className="mr-2" />
                  {item.date}
                </p>
                {item.location && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 flex items-center">
                    <MapPin size={14} className="mr-2" />
                    {item.location}
                  </p>
                )}
                {item.description && (
                  <p className="text-gray-700 dark:text-gray-300 mb-3">{item.description}</p>
                )}
                {item.skills && (
                  <div className="flex flex-wrap gap-2">
                    {item.skills.map((skill, skillIndex) => (
                      <span 
                        key={skillIndex}
                        className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs font-medium rounded-full"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HexagonTimeline;