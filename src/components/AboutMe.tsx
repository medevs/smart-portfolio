import React from 'react';
import Image from 'next/image';
import heroImage from "@/assets/Ahmed.jpeg";
import { Twitter, GithubIcon, Linkedin } from 'lucide-react';

const AboutMe: React.FC = () => {
  return (
    <div className="bg-white dark:bg-[#151B28] rounded-lg p-4 h-full transition-colors">
      <div className="flex flex-col h-full">
        <div className="flex flex-col md:flex-row gap-6 mt-8">
          <div className="flex-shrink-0">
            <Image
              src={heroImage}
              alt="Ahmed's profile picture"
              className="rounded-full w-24 h-24 object-cover ring-2 ring-blue-500/20"
              priority
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-col h-full">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                  Ahmed Oublihi
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">@medevs</p>
              </div>
              
              <div className="flex-1 bg-gray-50 dark:bg-[#1E2330] rounded-lg p-4 mb-8 mt-4">
                <div className="space-y-3">
                  <p className="text-md text-gray-600 dark:text-gray-300 leading-relaxed">
                    Hey there, I&apos;m Ahmed, a Software Developer based in Bremen, Germany. 
                    I dive deep into JavaScript and love crafting sleek, efficient web apps. 
                    With an eye for detail and a hunger for learning, I&apos;m all about delivering 
                    high-quality solutions that meet both user needs and business objectives.
                  </p>
                  <p className="text-md text-gray-600 dark:text-gray-300 leading-relaxed">
                    AI? Oh, that&apos;s my jam. I geek out on building software that taps into AI magic.
                  </p>
                </div>
              </div>

              <div className="mt-auto">
                <div className="flex items-center space-x-4">
                  <a 
                    href="https://twitter.com/ahmedoublihi" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-500 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400 transition-colors"
                    aria-label="Twitter Profile"
                  >
                    <Twitter className="w-5 h-5" />
                  </a>
                  <a 
                    href="https://github.com/medevs" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
                    aria-label="GitHub Profile"
                  >
                    <GithubIcon className="w-5 h-5" />
                  </a>
                  <a 
                    href="https://linkedin.com/in/ahmed-oublihi" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors"
                    aria-label="LinkedIn Profile"
                  >
                    <Linkedin className="w-5 h-5" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AboutMe;