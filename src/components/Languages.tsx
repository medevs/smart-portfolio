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
];

interface LanguageCardProps {
  language: Language;
  index: number;
}

const LanguageCard: React.FC<LanguageCardProps> = ({ language, index }) => (
  <div className="group flex items-center justify-between p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-[#252B3B] transition-all">
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 flex items-center justify-center text-2xl rounded-lg bg-gray-100 dark:bg-[#252B3B] group-hover:bg-white dark:group-hover:bg-[#2A3040] shadow-sm">
        {language.flag}
      </div>
      <div className="flex flex-col">
        <span className="text-sm font-medium text-gray-900 dark:text-gray-200">{language.name}</span>
        <span className="text-xs text-gray-500 dark:text-gray-400">{language.level}</span>
      </div>
    </div>
    <div className="h-1.5 w-24 bg-gray-100 dark:bg-[#252B3B] rounded-full overflow-hidden">
      <div
        className="h-full bg-gradient-to-r from-blue-500 to-blue-400"
        style={{
          width: language.level === 'Native' ? '100%' :
            language.level === 'Fluent' ? '90%' :
              language.level === 'Learning' ? '40%' : '0%'
        }}
      />
    </div>
  </div>
);

const Languages: React.FC = () => {
  return (
    <div className="bg-[#F8FAFC] dark:bg-[#151B28] rounded-lg p-6 shadow-md">
      <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent mb-6">
        Languages
      </h2>
      <div className="space-y-2">
        {languages.map((language, index) => (
          <LanguageCard key={language.name} language={language} index={index} />
        ))}
      </div>
    </div>
  );
};

export default Languages;