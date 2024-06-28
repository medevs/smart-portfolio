// components/AboutMe.tsx
import React from 'react';
import Image from 'next/image';
import heroImage from "@/assets/Ahmed.jpg";
import { Twitter, GithubIcon, Linkedin } from 'lucide-react';

const AboutMe: React.FC = () => {
  return (
    <div className={`bg-neutral-400 p-4 rounded-lg shadow-md md:col-span-3 lg:col-span-4`}>
      <div className="flex items-start space-x-4">
        <Image
          src={heroImage}
          alt="Ahmed's profile picture"
          className="rounded-full shadow-md h-24 w-24 object-cover object-center"
        />
        <div className="flex-1">
          <h1 className="text-xl font-bold">Ahmed Oublihi</h1>
          <p className="text-gray-600">@medevs</p>
          <p className="text-lg mb-4">
            Hey there, I&apos;m Ahmed, a Software Developer based in Bremen, Germany. I dive deep into JavaScript and love crafting sleek, efficient web apps. With an eye for detail and a hunger for learning, I&apos;m all about delivering high-quality solutions that meet both user needs and business objectives.
          </p>
          <p className="text-lg mb-4">
            AI? Oh, that&apos;s my jam. I geek out on building software that taps into AI magic.
          </p>
          <div className="mt-4 flex space-x-4">
            <a href="https://twitter.com/ahmedoublihi" className="text-blue-400 hover:text-blue-500">
              <Twitter className="w-5 h-5" />
            </a>
            <a href="https://github.com/medevs" className="text-gray-700 hover:text-gray-900">
              <GithubIcon className="w-5 h-5" />
            </a>
            <a href="https://linkedin.com/in/ahmed-oublihi" className="text-blue-700 hover:text-blue-800">
              <Linkedin className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AboutMe;