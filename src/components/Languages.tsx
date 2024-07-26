import React from 'react';

interface Language {
  name: string;
  level: string;
  flag: string;
}

const languages: Language[] = [
  { name: 'English', level: 'Fluent', flag: '🇬🇧' },
  { name: 'German', level: 'Fluent', flag: '🇩🇪' },
  { name: 'French', level: 'Fluent', flag: '🇫🇷' },
  { name: 'Tamazight', level: 'Native', flag: 'ⵣ' },
  { name: 'Arabic', level: 'Fluent', flag: '🇲🇦' },
  { name: 'Spanish', level: 'Learning', flag: '🇪🇸' },
];

interface LanguageCardProps {
  language: Language;
  index: number;
}

const LanguageCard: React.FC<LanguageCardProps> = ({ language, index }) => (
  <div 
    className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-2 flex items-center space-x-4 transform hover:scale-105 transition duration-300 ease-in-out"
    style={{ animationDelay: `${index * 100}ms` }}
  >
    <span className="text-3xl">{language.flag}</span>
    <div>
      <h3 className="text-md font-semibold text-gray-800 dark:text-white">{language.name}</h3>
      <p className="text-gray-600 dark:text-gray-300">{language.level}</p>
    </div>
  </div>
);

const Languages: React.FC = () => {
  return (
    <div className="mb-16">
      <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6 animate-fade-in-down">Languages</h2>
      <div className="grid grid-cols-1  gap-2">
        {languages.map((language, index) => (
          <LanguageCard key={language.name} language={language} index={index} />
        ))}
      </div>
    </div>
  );
};

export default Languages;