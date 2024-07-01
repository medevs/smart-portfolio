import React from 'react';
import { Github, Code, Star, GitBranch, Users, Activity, Coffee, Zap } from 'lucide-react';

const GitHubStats: React.FC = () => {
  const stats = [
    { icon: <GitBranch className="w-6 h-6" />, label: 'Repositories', value: '50+' },
    { icon: <Star className="w-6 h-6" />, label: 'Stars Earned', value: '200+' },
    { icon: <Code className="w-6 h-6" />, label: 'Contributions', value: '1,500+' },
    { icon: <Users className="w-6 h-6" />, label: 'Followers', value: '100+' },
    { icon: <Activity className="w-6 h-6" />, label: 'Pull Requests', value: '300+' },
    { icon: <Coffee className="w-6 h-6" />, label: 'Cups of Coffee', value: '∞' },
  ];

  const languages = [
    { name: 'JavaScript', percent: 40 },
    { name: 'TypeScript', percent: 30 },
    { name: 'Python', percent: 15 },
    { name: 'HTML/CSS', percent: 10 },
    { name: 'Other', percent: 5 },
  ];

  return (
    <div className="md:col-span-1 lg:col-span-2 bg-gradient-to-br from-blue-600 to-purple-700 p-8 rounded-3xl shadow-2xl text-white overflow-hidden relative">
      <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-yellow-300 rounded-full opacity-20 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-pink-500 rounded-full opacity-20 blur-3xl"></div>

      <div className="flex items-center gap-3 mb-8">
        <Github className="w-10 h-10" />
        <h2 className="text-3xl font-bold">GitHub Insights</h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white bg-opacity-10 p-4 rounded-xl backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:bg-opacity-20">
            <div className="flex items-center gap-3 mb-2">
              {stat.icon}
              <span className="font-semibold">{stat.label}</span>
            </div>
            <p className="text-2xl font-bold">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Zap className="w-5 h-5" />
          Top Languages
        </h3>
        <div className="space-y-3">
          {languages.map((lang, index) => (
            <div key={index} className="flex items-center">
              <div className="w-24 text-sm">{lang.name}</div>
              <div className="flex-grow bg-white bg-opacity-20 rounded-full h-2.5 ml-2">
                <div
                  className="bg-gradient-to-r from-yellow-300 to-red-500 h-2.5 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${lang.percent}%` }}
                ></div>
              </div>
              <div className="w-12 text-right text-sm">{lang.percent}%</div>
            </div>
          ))}
        </div>
      </div>

      <div className="text-center">
        <a
          href="https://github.com/medevs"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center space-x-2 bg-white text-purple-700 font-bold py-3 px-6 rounded-full transition-all duration-300 hover:bg-opacity-90 hover:scale-105"
        >
          <Github className="w-5 h-5" />
          <span>View Full GitHub Profile</span>
        </a>
      </div>
    </div>
  );
}

export default GitHubStats;