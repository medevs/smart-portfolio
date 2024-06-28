// import { useState } from 'react';
import { ChevronRight, ExternalLink, Github, GithubIcon, Linkedin, LucideGithub, Mail, Phone, Twitter } from 'lucide-react';
import heroImage from "@/assets/Ahmed.jpg";
import Image from 'next/image';
import { skills, recentPosts, featuredProjects } from '../assets/data';
import AIChatButton from '@/components/AIChatButton';
import RealTimeInfoWidget from '@/components/RealTimeInfoWidget';

export default function HomePage() {
  // const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen p-4 md:p-8">
      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        {/* About Me */}
        <div className="bg-neutral-400 p-4 rounded-lg shadow-md col-span-2">
          <div className="flex items-start space-x-4">
            {/* Profile Image */}
            <Image
              src={heroImage}
              alt="Ahmed's profile picture"
              className="rounded-full shadow-md h-24 w-24 object-cover object-center"
            />

            {/* Bio and Links */}
            <div className="flex-1">
              <h1 className="text-xl font-bold">Ahmed Oublihi</h1>
              <p className="text-gray-600">@medevs</p>

              <p className="text-lg mb-8">
                Hey there, I&apos;m Ahmed, a Software Developer based in Bremen, Germany. I dive deep into JavaScript and love crafting sleek, efficient web apps. With an eye for detail and a hunger for learning, I&apos;m all about delivering high-quality solutions that meet both user needs and business objectives..
              </p>
              <p className="text-lg mb-8">
                AI? Oh, that&apos;s my jam. I geek out on building software that taps into AI magic.
              </p>

              <div className="mt-4 flex space-x-4">
                <a href="https://twitter.com/johndoe" className="text-blue-400 hover:text-blue-500">
                  <Twitter className="w-5 h-5" />
                </a>
                <a href="https://github.com/johndoe" className="text-gray-700 hover:text-gray-900">
                  <GithubIcon className="w-5 h-5" />
                </a>
                <a href="https://linkedin.com/in/johndoe" className="text-blue-700 hover:text-blue-800">
                  <Linkedin className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* RealTimeInfoWidget */}
        <RealTimeInfoWidget />

        {/* Technologies */}
        <div className="bg-neutral-400 p-4 rounded-lg shadow-md">
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

        {/* Featured Project */}
        <div className="bg-neutral-400 m-auto rounded-lg shadow-md col-span-2">
          <div className="p-4 ">
            <h2 className="text-xl font-bold text">Featured Projects</h2>
          </div>
          <div className="grid gap-4 p-4 sm:grid-cols-2">
            {featuredProjects.map((project, index) => (
              <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-lg overflow-hidden shadow-md transition duration-300 ease-in-out transform hover:scale-105">
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl text-indigo-500 dark:text-indigo-400">{project.icon}</span>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{project.name}</h3>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">{project.description}</p>
                  <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mb-3">
                    <span className="bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded mr-2">{project.language}</span>
                    <span>{project.slug}</span>
                  </div>
                </div>
                <div className="flex border-t border-gray-200 dark:border-gray-600">
                  <a href={project.link} className="flex-1 px-4 py-3 text-center text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:bg-gray-100 dark:hover:bg-gray-600 transition duration-150 ease-in-out">
                    <ExternalLink className="w-4 h-4 inline mr-1" />
                    Live Project
                  </a>
                  <div className="border-l border-gray-200 dark:border-gray-600"></div>
                  <a href={project.sourceCode} className="flex-1 px-4 py-3 text-center text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:bg-gray-100 dark:hover:bg-gray-600 transition duration-150 ease-in-out">
                    <LucideGithub className="w-4 h-4 inline mr-1" />
                    Source Code
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Other Projects */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
          <div className="p-4 bg-gradient-to-r from-blue-500 to-purple-600">
            <h2 className="text-lg font-semibold text-white">Latest Posts</h2>
          </div>
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {recentPosts.map((post, index) => (
              <li key={index} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition duration-150 ease-in-out">
                <a href="#" className="block">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{post.title}</p>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-xs text-gray-500 dark:text-gray-400">{post.date}</p>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </div>
                </a>
              </li>
            ))}
          </ul>
          <div className="p-4 bg-gray-50 dark:bg-gray-700">
            <a href="#" className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline">
              View all posts
            </a>
          </div>
        </div>

        {/* Social Links */}
        <div className="bg-neutral-400 p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Connect</h2>
          
        </div>

        <div className="bg-neutral-400 p-4 rounded-lg shadow-md">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-gray-900 dark:text-gray-50 text-2xl">📊</span>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-50">GitHub Stats</h2>
          </div>
          <div className="flex justify-center">
            <img height={590} width={590} src="https://github-readme-stats.vercel.app/api/top-langs?username=medevs&show_icons=true&locale=en&layout=compact&theme=radical" alt="Top Languages" />
          </div>
        </div>

      </div>
    </div>
  );
}