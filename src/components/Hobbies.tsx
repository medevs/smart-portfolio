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

const HobbyCard: React.FC<HobbyCardProps> = ({ hobby, index }) => (
  <div
    className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 flex flex-col items-center justify-center transform hover:scale-105 transition duration-300 ease-in-out"
    style={{ animationDelay: `${index * 100}ms` }}
  >
    <span className="text-4xl mb-2">{hobby.icon}</span>
    <h3 className="text-xl font-semibold text-gray-800 dark:text-white">{hobby.name}</h3>
  </div>
);

const Hobbies: React.FC = () => {
  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6 animate-fade-in-down">Hobbies</h2>
      <div className="grid grid-cols-2 md:grid-cols-2 gap-6">
        {hobbies.map((hobby, index) => (
          <HobbyCard key={hobby.name} hobby={hobby} index={index} />
        ))}
      </div>
    </div>
  );
};

export default Hobbies;