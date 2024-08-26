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
    title: 'Fachinformatiker Anwendungsentwicklung Ausbildung',
    organization: 'Schulzentrum SII Utbremen Bremen',
    date: 'Sep 2021 - Mai 2024',
    description: 'Ausbildung zum Fachinformatiker mit Schwerpunkt Anwendungsentwicklung. Fokus auf moderne Webtechnologien und Softwareentwicklungspraktiken.',
    skills: ['JavaScript', 'React', 'Node.js', 'SQL', 'Agile Methoden']
  },
  {
    type: 'education',
    title: 'Bachelor in Netzwerke und Telekommunikation',
    organization: 'Université du Littoral Côte d\'Opale',
    date: 'Okt 2018 - Nov 2019',
    description: 'Französisches Staatsdiplom mit Schwerpunkt auf Netzwerkadministration, IT-Sicherheit und Webentwicklung. Vorbereitung auf CISCO-Zertifizierungen (CCNA1 bis CCNA4).',
    skills: ['Netzwerkadministration', 'IT-Sicherheit', 'PHP', 'MySQL', 'Projektmanagement', 'CISCO CCNA']
  },
  {
    type: 'education',
    title: 'Ausbildung in Techniken der Computerentwicklung',
    organization: 'OFPPT Ouarzazate',
    date: 'Sep 2016 - Jul 2018',
    description: 'Umfassende Ausbildung in IT-Fähigkeiten, einschließlich Programmierung, Webentwicklung, Datenbankmanagement und Netzwerke.',
    skills: ['C#', 'HTML', 'CSS', 'JavaScript', 'SQL', 'WordPress', 'Bootstrap', 'UML']
  }
];

const experienceItems: TimelineItem[] = [
  {
    type: 'experience',
    title: 'Softwareentwickler',
    organization: 'ePhilos AG',
    date: 'Aug 2021 - Jetzt · 3 Jahre 1 Monat',
    location: 'Bremen, Deutschland · Hybrid',
    description: 'Verantwortlich für die Weiterentwicklung von Comfortmarkt (CM), einer Software auf Basis von PHP, Ext JS, Webix und MySQL. Optimierung und Erweiterung bestehender Webtechnologien.',
    skills: ['PHP', 'Ext JS', 'Webix', 'MySQL', 'JavaScript', 'HTML', 'CSS']
  },
  {
    type: 'experience',
    title: 'NodeJS Webentwickler (Praktikum)',
    organization: 'HM Communication',
    date: 'Juni 2019 - Sep 2019 · 4 Monate',
    location: 'Marrakesch, Marokko',
    description: 'Entwicklung von Webanwendungen mit Node.js. Arbeit an verschiedenen Kundenprojekten und Verbesserung der Backend-Fähigkeiten.',
    skills: ['Node.js', 'Express.js', 'MongoDB', 'RESTful APIs', 'Git']
  },
  {
    type: 'experience',
    title: 'PHP Entwickler (Praktikum)',
    organization: 'HM Communication',
    date: 'Juli 2018 - August 2018 · 2 Monate',
    location: 'Marrakesch, Marokko',
    description: 'Mitarbeit an der Entwicklung von PHP-basierten Webanwendungen. Fokus auf Backend-Entwicklung und Datenbankintegration.',
    skills: ['PHP', 'MySQL', 'Laravel', 'HTML', 'CSS', 'JavaScript']
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
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-900 dark:text-white">Mein Werdegang</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Berufserfahrung</h2>
          {experienceItems.map((item, index) => (
            <TimelineItem key={index} item={item} />
          ))}
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Ausbildung</h2>
          {educationItems.map((item, index) => (
            <TimelineItem key={index} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Timeline;