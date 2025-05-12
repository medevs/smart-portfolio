import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { Document } from "langchain/document";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { getEmbeddingsCollection, getVectorStore } from "../src/lib/supabase";
import fs from "fs";

/**
 * Creates a simple formatted text representation of resume data
 */
function formatResumeSection(sectionName: string, data: any): string {
  // Format section headers consistently
  const formatSectionName = (name: string): string => {
    return name
      .replace(/([A-Z])/g, ' $1') // Add space before capital letters
      .replace(/^./, str => str.toUpperCase()); // Capitalize first letter
  };

  // Format the section name
  const formattedSectionName = formatSectionName(sectionName);
  let content = `# ${formattedSectionName}\n`;

  // Handle different section types
  if (sectionName === "personalInfo") {
    const info = data;
    content += `Name: ${info.name}\n`;
    content += `Title: ${info.title}\n`;
    content += `Email: ${info.email}\n`;
    content += `Location: ${info.location}\n`;
    content += `Summary: ${info.summary}\n`;
    content += `GitHub: ${info.github}\n`;
    content += `LinkedIn: ${info.linkedin}\n`;
    content += `Website: ${info.website}\n`;
  } 
  else if (sectionName === "experience") {
    data.forEach((exp: any, i: number) => {
      content += `## Job ${i+1}\n`;
      content += `Company: ${exp.company}\n`;
      content += `Position: ${exp.position}\n`;
      content += `Period: ${exp.startDate} to ${exp.endDate}\n`;
      content += `Description: ${exp.description}\n`;
      if (exp.location) content += `Location: ${exp.location}\n`;
      if (exp.companyUrl) content += `Company URL: ${exp.companyUrl}\n`;
      content += "\n";
    });
  }
  else if (sectionName === "education") {
    data.forEach((edu: any, i: number) => {
      content += `## Education ${i+1}\n`;
      content += `Institution: ${edu.institution}\n`;
      content += `Degree: ${edu.degree}\n`;
      content += `Period: ${edu.startDate} to ${edu.endDate}\n`;
      content += `Description: ${edu.description}\n`;
      if (edu.institutionUrl) content += `Institution URL: ${edu.institutionUrl}\n`;
      content += "\n";
    });
  }
  else if (sectionName === "skills") {
    content += `Skills: ${data.join(", ")}\n`;
  }
  else if (sectionName === "projects") {
    data.forEach((proj: any, i: number) => {
      content += `## Project ${i+1}\n`;
      content += `Name: ${proj.name}\n`;
      content += `Description: ${proj.description}\n`;
      content += `Technologies: ${proj.technologies.join(", ")}\n`;
      content += `Link: ${proj.link}\n`;
      content += "\n";
    });
  }
  else if (sectionName === "languages") {
    content += "Languages: ";
    data.forEach((lang: any, i: number) => {
      content += `${lang.language} (${lang.proficiency})`;
      if (i < data.length - 1) content += ", ";
    });
    content += "\n";
  }
  else if (sectionName === "interests" || sectionName === "softSkills") {
    content += `${formattedSectionName}: ${data.join(", ")}\n`;
  }
  else if (sectionName === "certifications") {
    data.forEach((cert: any, i: number) => {
      content += `## Certification ${i+1}\n`;
      content += `Name: ${cert.name}\n`;
      content += `Date: ${cert.date}\n`;
      content += `Description: ${cert.description}\n`;
      content += "\n";
    });
  }
  else {
    // Generic handling for any other sections
    content += JSON.stringify(data, null, 2);
  }

  return content;
}

/**
 * Simple function to load resume data and create documents
 */
async function generateEmbeddings() {
  try {
    console.log("Starting embeddings generation...");
    
    // Get the vector store
    const vectorStore = await getVectorStore();
    
    // Clear existing documents
    console.log("Clearing existing documents...");
    const { error } = await (await getEmbeddingsCollection()).delete().neq('id', 0);
    if (error) {
      console.error('Error clearing documents:', error);
      return;
    }

    // Load resume data
    console.log("Loading resume data...");
    const resumeDataPath = "src/data/resumeData.json";
    const rawData = fs.readFileSync(resumeDataPath, "utf-8");
    const resumeData = JSON.parse(rawData);
    
    // Create documents for each section
    const documents: Document[] = [];
    const sections = [
      "personalInfo", "experience", "education", "skills", 
      "projects", "languages", "interests", "certifications", "softSkills"
    ];
    
    for (const section of sections) {
      if (!resumeData[section]) continue;
      
      // Format the section content
      const content = formatResumeSection(section, resumeData[section]);
      
      // Create a document with the formatted content
      documents.push(new Document({
        pageContent: content,
        metadata: { 
          section: section,
          source: "resume" 
        }
      }));
    }
    
    console.log(`Created ${documents.length} section documents`);

    // Split documents into smaller chunks
    console.log("Splitting documents...");
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });
    
    const splitDocs = await splitter.splitDocuments(documents);
    console.log(`Split into ${splitDocs.length} chunks`);

    // Add documents to vector store
    console.log("Adding documents to vector store...");
    await vectorStore.addDocuments(splitDocs);

    console.log("Resume embeddings generated successfully!");
  } catch (error) {
    console.error("Error generating embeddings:", error);
    throw error;
  }
}

generateEmbeddings().catch(console.error);