import type { Education, Certification } from "./types";

export const education: Education[] = [
  {
    id: "szut-2021",
    institution: "Schulzentrum SII Utbremen Bremen",
    institutionUrl: "https://www.szut.de/",
    degree: "Vocational Training in Application Development",
    startDate: "Aug 2021",
    endDate: "May 2024",
    description:
      "Dual education: Theory and practice in Full Stack Development. Modern web technologies and agile methods.",
  },
  {
    id: "ulco-2018",
    institution: "Universite du Littoral Cote d'Opale",
    institutionUrl: "https://www.univ-littoral.fr",
    degree: "Bachelor in Networks and Telecommunications",
    startDate: "Oct 2018",
    endDate: "Nov 2019",
    description:
      "Network administration, IT security, web development. CISCO certifications (CCNA1-CCNA4).",
  },
  {
    id: "ofppt-2016",
    institution: "OFPPT Ouarzazate",
    institutionUrl: "https://www.ofppt.ma/",
    degree: "Training in Computer Development Techniques",
    startDate: "Sep 2016",
    endDate: "Jul 2018",
    description:
      "Comprehensive training in IT skills, including programming, web development, database management, and networks.",
  },
];

export const certifications: Certification[] = [
  {
    name: "Microsoft Certified Professional (MCP)",
    issuer: "Microsoft",
    date: "May 2018",
    description: "Focus: HTML, CSS, JavaScript",
  },
];
