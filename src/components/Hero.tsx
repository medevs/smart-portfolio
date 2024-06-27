import Image from "next/image";
import heroImage from "@/assets/Ahmed.jpg";
import { Github, Linkedin, Twitter, Mail } from 'lucide-react';
import AIChatButton from "@/components/AIChatButton";

export default function Hero() {
  return (
    <section className="relative py-12 md:py-24 lg:py-32 transition-colors duration-500 overflow-hidden">
        {/* Background Stars */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="stars">🔆</div>
          <div className="stars">🔆</div>
          <div className="stars">🔆</div>
          <div className="stars">🔆</div>
          <div className="stars">🔆</div>
        </div>

        <div className="container mx-auto px-4 md:px-6 lg:px-8 flex flex-col lg:flex-row items-center justify-between relative z-10">
          <div className="lg:w-1/2 text-center lg:text-left">
            <h1 className="text-5xl font-bold mb-4">
              Welcome to My Portfolio
            </h1>
            <p className="text-lg mb-8">
              Hey there, I&apos;m Ahmed, a Software Developer based in Bremen, Germany. I dive deep into JavaScript and love crafting sleek, efficient web apps. With an eye for detail and a hunger for learning, I&apos;m all about delivering high-quality solutions that meet both user needs and business objectives..
            </p>
            <span className="animate-bounce">
              <AIChatButton />
            </span>
            <p className="text-lg mb-8">
            AI? Oh, that&apos;s my jam. I geek out on building software that taps into AI magic.
            </p>
            <div className="flex mb-8">
              {/* Social Media Icons */}
              <a href="#" className="mr-4 text-3xl hover:text-blue-500 transition-colors duration-300">
                <Github />
              </a>
              <a href="#" className="mr-4 text-3xl hover:text-blue-500 transition-colors duration-300">
                <Linkedin />
              </a>
              <a href="#" className="mr-4 text-3xl hover:text-blue-500 transition-colors duration-300">
                <Twitter />
              </a>
              <a href="mailto:ahmed@example.com" className="mr-4 text-3xl hover:text-blue-500 transition-colors duration-300">
                <Mail />
              </a>
            </div>
          </div>
          <div className="lg:w-1/2 flex justify-center lg:justify-end mt-6 lg:mt-0">
            <Image
              src={heroImage}
              alt="Ahmed's profile picture"
              className="rounded-full shadow-md h-64 w-64 object-cover object-center"
            />
          </div>
        </div>
      </section >
  );
}
