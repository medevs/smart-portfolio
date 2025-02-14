import React from 'react';

interface Hobby {
  name: string;
  icon: string;
}

const hobbies: Hobby[] = [
  { name: 'Guitar', icon: '🎸' },
  { name: 'Hiking', icon: '🥾' },
  { name: 'Climbing', icon: '🧗' },
  { name: 'Travel', icon: '✈️' },
];

interface HobbyCardProps {
  hobby: Hobby;
  index: number;
}

const HobbyCard: React.FC<HobbyCardProps> = ({ hobby }) => (
  <div className="flex flex-col items-center justify-center p-3 transition-all hover:bg-gray-100 dark:hover:bg-[#252B3B] rounded-lg">
    <div className="text-3xl mb-2 transform group-hover:scale-110 transition-all duration-300">
      {hobby.icon}
    </div>
    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white">
      {hobby.name}
    </span>
  </div>
);

const Hobbies: React.FC = () => {
  return (
    <div className="bg-[#F8FAFC] dark:bg-[#151B28] rounded-lg p-4 shadow-md">
      <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent mb-4 px-2">
        Hobbies
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-1">
        {hobbies.map((hobby, index) => (
          <HobbyCard key={hobby.name} hobby={hobby} index={index} />
        ))}
      </div>
    </div>
  );
};

export default Hobbies;