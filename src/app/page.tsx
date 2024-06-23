"use client";

import { Card, CardBody } from "@nextui-org/card";
import { Education } from "../components/Education";
import me from "@/assets/Ahmed.jpg";
import Image from "next/image";

const educationList = [
  {
    career: "Full Stack Developmet Immersive",
    years: "2022",
    description: "",
  },
  {
    career: "Computer Engineering",
    years: "2018-2021",
    description: "",
  },
]

const skills = [
  { icon: "🟨", name: "JavaScript" },
  { icon: "🟦", name: "TypeScript" },
  { icon: "⚛️", name: "React" },
  { icon: "⚡️", name: "Next.js" },
  { icon: "🎨", name: "Tailwind CSS" },
  { icon: "🌐", name: "Webix JS" },
  { icon: "📊", name: "Ext JS" },
  { icon: "🟢", name: "Node.js" },
  { icon: "🐘", name: "PHP" },
  { icon: "🍃", name: "MongoDB" },
  { icon: "🗃️", name: "MySQL" },
  { icon: "🔄", name: "Prisma" },
  { icon: "🔧", name: "Git" },
  { icon: "🐙", name: "GitHub" },
  { icon: "🔀", name: "SVN" },
  { icon: "🐳", name: "Docker" },
  { icon: "💻", name: "VS Code" },
  { icon: "🪐", name: "Astro" },
  { icon: "🤖", name: "OpenAI" },
  { icon: "🔗", name: "Langchain" },
];

export default function About() {

  return (
    <div className="grid grid-rows-8 grid-cols-4 lg:grid-cols-3 gap-5 py-12 md:py-24 lg:py-32">
      <Card className="col-span-full lg:row-start-2 lg:row-span-2 lg:col-start-2 lg:col-span-1">
        <CardBody className="flex-col items-center justify-center gap-2">
          <Image
            src={me}
            alt="A photo of me"
            height={250}
            width={250}
            className="border-2 object-cover shadow-md dark:border-foreground rounded-full"
          />
          <h1 className="text-4xl font-bold mt-4">Ahmed Oublihi</h1>
        </CardBody>
      </Card>

      <Card className="col-span-full lg:row-start-1 lg:row-span-1 lg:col-span-2  ">
        <CardBody className="gap-2">
          <div className="text-3xl font-bold">Who am I?</div>
          <div className="text-lg text-gray-400">
            <p>
              Hi! my name is Ahmed, a passionate Software Developer based in Bremen, Germany, with a strong focus on web technologies. I love delving into JavaScript ecosystems and building scalable and efficient web applications. With a keen eye for detail and a drive for continuous learning, I strive to deliver high-quality solutions that meet both user needs and business objectives.
            </p>
            <p>
              Im particularly interested in artificial intelligence and enjoy building software that leverages AI technologies.
            </p>
          </div>
        </CardBody>
      </Card>

      <Card className="col-span-full row-start-2 row-end-3 lg:row-start-2 lg:col-start-1 lg:col-span-1">
        <CardBody className="justify-center items-center">
          <h2 className="text-2xl lg:text-3xl font-bold  text-center">
            Software developer
          </h2>
        </CardBody>
      </Card>

      <Card className="hidden lg:flex col-span-2 lg:row-start-3 lg:row-span-1 lg:col-start-3 lg:col-span-1">
        <CardBody className="justify-center items-center lg:row-start-2 lg:cols-start-4">
          <div className="text-3xl font-bold text-center">
            &#34;{'I really like creating software solutions'}&#34;
          </div>
        </CardBody>
      </Card>

      <Card className="col-span-full lg:row-start-3 lg:row-span-2 lg:col-start-1 lg:col-span-1 technologyIconList">
        <CardBody className="gap-4">
          <h2 className="text-3xl font-bold">
            Technologies I have worked with
          </h2>
          <ul className="flex flex-wrap gap-4 justify-center">
            {skills.map((skill, index) => (
              <li key={index} className="flex items-center gap-2 p-2 rounded-lg bg-gray-100 dark:bg-gray-700">
                <span className="text-lg text-gray-500 dark:text-gray-400">{skill.icon}</span>
                <span className="text-md font-medium text-gray-700 dark:text-gray-300">{skill.name}</span>
              </li>
            ))}
          </ul>
        </CardBody>
      </Card>

      <Card className="col-span-full lg:row-start-4 lg:row-span-1 lg:col-start-2 lg:col-span-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="hidden lg:block icon icon-tabler icon-tabler-timeline absolute top-0 -right-7"
          width="200"
          height="200"
          viewBox="0 0 24 24"
          strokeWidth="2"
          stroke="#232323"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path
            stroke="none"
            d="M0 0h24v24H0z"
            fill="none"
          ></path>
          <path d="M4 16l6 -7l5 5l5 -6"></path>
          <path d="M15 14m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"></path>
          <path d="M10 9m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"></path>
          <path d="M4 16m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"></path>
          <path d="M20 8m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"></path>
        </svg>
        <CardBody className="gap-2 flex-wrap">
          <h2 className="text-3xl font-bold ">Education</h2>

          <div className="flex flex-col lg:flex-col gap-2">
            {educationList.map((education) => (
              <Education
                key={`education-item-${education.career}`}
                career={education.career}
                years={education.years}
                description={education.description}
              />
            ))}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
