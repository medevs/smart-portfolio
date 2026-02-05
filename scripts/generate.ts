import dotenv from "dotenv";
// Load .env.local first, fallback to .env
dotenv.config({ path: ".env.local" });
dotenv.config({ path: ".env" });

import { Document } from "langchain/document";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { getEmbeddingsCollection, getVectorStore } from "../src/lib/supabase";
import fs from "fs";
import path from "path";
import matter from "gray-matter";

/**
 * Creates a formatted text representation of resume data with improved context
 */
function formatResumeSection(sectionName: string, data: any): string {
  const formatSectionName = (name: string): string => {
    return name
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase())
      .trim();
  };

  const formattedSectionName = formatSectionName(sectionName);
  let content = `# ${formattedSectionName}\n\n`;

  if (sectionName === "personalInfo") {
    const info = data;
    content += `## About Ahmed Oublihi\n`;
    content += `Name: ${info.name}\n`;
    content += `Title: ${info.title}\n`;
    content += `Email: ${info.email}\n`;
    content += `Location: ${info.location}\n`;
    content += `GitHub: ${info.github}\n`;
    content += `LinkedIn: ${info.linkedin}\n`;
    content += `Website: ${info.website}\n\n`;
    content += `## Professional Summary\n${info.summary}\n`;
  } else if (sectionName === "experience") {
    content += `## Work Experience\n\n`;
    data.forEach((exp: any, i: number) => {
      content += `### ${exp.position} at ${exp.company}\n`;
      content += `Duration: ${exp.startDate} - ${exp.endDate}\n`;
      if (exp.location) content += `Location: ${exp.location}\n`;
      content += `\nResponsibilities and achievements:\n${exp.description}\n`;
      if (exp.companyUrl) content += `Company website: ${exp.companyUrl}\n`;
      content += "\n";
    });
  } else if (sectionName === "education") {
    content += `## Educational Background\n\n`;
    data.forEach((edu: any, i: number) => {
      content += `### ${edu.degree}\n`;
      content += `Institution: ${edu.institution}\n`;
      content += `Duration: ${edu.startDate} - ${edu.endDate}\n`;
      content += `Description: ${edu.description}\n`;
      if (edu.institutionUrl)
        content += `Institution website: ${edu.institutionUrl}\n`;
      content += "\n";
    });
  } else if (sectionName === "skills") {
    content += `## Technical Skills\n\n`;
    content += `Ahmed is proficient in the following technologies:\n`;
    content += data.map((skill: string) => `- ${skill}`).join("\n");
    content += "\n";
  } else if (sectionName === "projects") {
    content += `## Projects and Products\n\n`;
    data.forEach((proj: any, i: number) => {
      content += `### ${proj.name}\n`;
      content += `Description: ${proj.description}\n`;
      content += `Technologies used: ${proj.technologies.join(", ")}\n`;
      content += `Link: ${proj.link}\n\n`;
    });
  } else if (sectionName === "languages") {
    content += `## Language Proficiency\n\n`;
    data.forEach((lang: any) => {
      content += `- ${lang.language}: ${lang.proficiency}\n`;
    });
  } else if (sectionName === "interests") {
    content += `## Professional Interests\n\n`;
    content += data.map((interest: string) => `- ${interest}`).join("\n");
    content += "\n";
  } else if (sectionName === "softSkills") {
    content += `## Soft Skills\n\n`;
    content += data.map((skill: string) => `- ${skill}`).join("\n");
    content += "\n";
  } else if (sectionName === "certifications") {
    content += `## Certifications\n\n`;
    data.forEach((cert: any) => {
      content += `### ${cert.name}\n`;
      content += `Date: ${cert.date}\n`;
      content += `Description: ${cert.description}\n\n`;
    });
  } else {
    content += JSON.stringify(data, null, 2);
  }

  return content;
}

/**
 * Load and parse blog posts from markdown files
 */
function loadBlogPosts(): Document[] {
  const postsDirectory = path.join(process.cwd(), "posts");
  const documents: Document[] = [];

  if (!fs.existsSync(postsDirectory)) {
    console.log("No posts directory found, skipping blog posts");
    return documents;
  }

  const files = fs.readdirSync(postsDirectory);

  for (const file of files) {
    if (!file.endsWith(".md")) continue;

    const filePath = path.join(postsDirectory, file);
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const { data: frontmatter, content } = matter(fileContent);

    const postId = file.replace(".md", "");

    // Create a document with rich metadata
    const formattedContent = `
# Blog Post: ${frontmatter.title || "Untitled"}

Author: ${frontmatter.author || "Ahmed Oublihi"}
Date: ${frontmatter.date || "Unknown"}
Category: ${frontmatter.category || "General"}
Tags: ${(frontmatter.tags || []).join(", ")}

## Description
${frontmatter.description || ""}

## Content
${content}
`;

    documents.push(
      new Document({
        pageContent: formattedContent,
        metadata: {
          source: "blog",
          type: "blog_post",
          postId: postId,
          title: frontmatter.title || "Untitled",
          author: frontmatter.author || "Ahmed Oublihi",
          date: frontmatter.date || "",
          category: frontmatter.category || "General",
          tags: frontmatter.tags || [],
          importance: "medium",
        },
      })
    );
  }

  return documents;
}

/**
 * Generate embeddings for resume and blog content
 */
async function generateEmbeddings() {
  try {
    console.log("Starting embeddings generation...\n");

    // Get the vector store
    const vectorStore = await getVectorStore();

    // Clear existing documents
    console.log("Clearing existing documents...");
    const { error } = await (await getEmbeddingsCollection()).delete().neq("id", 0);
    if (error) {
      console.error("Error clearing documents:", error);
      return;
    }

    const allDocuments: Document[] = [];

    // Load resume data
    console.log("\n📄 Loading resume data...");
    const resumeDataPath = "src/data/resumeData.json";
    const rawData = fs.readFileSync(resumeDataPath, "utf-8");
    const resumeData = JSON.parse(rawData);

    // Create documents for each resume section
    const sections = [
      "personalInfo",
      "experience",
      "education",
      "skills",
      "projects",
      "languages",
      "interests",
      "certifications",
      "softSkills",
    ];

    for (const section of sections) {
      if (!resumeData[section]) continue;

      const content = formatResumeSection(section, resumeData[section]);

      allDocuments.push(
        new Document({
          pageContent: content,
          metadata: {
            source: "resume",
            type: "resume_section",
            section: section,
            importance:
              section === "personalInfo" || section === "experience"
                ? "high"
                : "medium",
          },
        })
      );
    }

    console.log(`  Created ${allDocuments.length} resume section documents`);

    // Load blog posts
    console.log("\n📝 Loading blog posts...");
    const blogDocuments = loadBlogPosts();
    allDocuments.push(...blogDocuments);
    console.log(`  Loaded ${blogDocuments.length} blog posts`);

    // Create recruiter-focused summary document
    const recruiterSummary = `
# Quick Summary for Recruiters

## Ahmed Oublihi - Full Stack Developer & AI Engineer

### Current Status
- Available for: Full-time positions, contract work
- Location: Bremen, Germany
- Remote: Open to remote work

### Key Highlights
- 3+ years professional experience in Full Stack Development
- Currently working at ePhilos AG (Aug 2021 - Present)
- Specializes in React, Next.js, TypeScript, PHP, and AI/ML technologies
- Experience with LangChain, OpenAI, and RAG systems

### Contact
- Email: oublihi.a@gmail.com
- GitHub: https://github.com/medevs
- LinkedIn: https://www.linkedin.com/in/ahmed-oublihi/
- Website: https://medevsmaker.vercel.app

### Why Hire Ahmed?
1. Proven track record in enterprise software development
2. Strong AI/ML integration skills
3. Experience building production RAG systems
4. Excellent communication in German (C1), English (B2)
5. Continuous learner with passion for emerging technologies
`;

    allDocuments.push(
      new Document({
        pageContent: recruiterSummary,
        metadata: {
          source: "resume",
          type: "recruiter_summary",
          section: "summary",
          importance: "high",
        },
      })
    );

    console.log(`\n📊 Total documents before splitting: ${allDocuments.length}`);

    // Split documents with context-aware chunking
    console.log("\n✂️  Splitting documents...");
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 800,
      chunkOverlap: 150,
      separators: ["\n## ", "\n### ", "\n\n", "\n", " "],
    });

    const splitDocs = await splitter.splitDocuments(allDocuments);
    console.log(`  Split into ${splitDocs.length} chunks`);

    // Add documents to vector store
    console.log("\n🔄 Adding documents to vector store...");
    await vectorStore.addDocuments(splitDocs);

    console.log("\n✅ Embeddings generated successfully!");
    console.log(`   - Resume sections: ${sections.length}`);
    console.log(`   - Blog posts: ${blogDocuments.length}`);
    console.log(`   - Total chunks: ${splitDocs.length}`);
  } catch (error) {
    console.error("Error generating embeddings:", error);
    throw error;
  }
}

generateEmbeddings().catch(console.error);
