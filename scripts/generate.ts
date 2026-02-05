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

// Import config data
import { personalInfo } from "../src/config/personal";
import { experiences } from "../src/config/experience";
import { education, certifications } from "../src/config/education";
import { skillCategories, skillsList } from "../src/config/skills";
import { projects } from "../src/config/projects";
import { socialLinks } from "../src/config/social";
import { aboutConfig } from "../src/config/about";

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

Author: ${frontmatter.author || personalInfo.fullName}
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
          author: frontmatter.author || personalInfo.fullName,
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

    // === PERSONAL INFO DOCUMENT ===
    console.log("\n📄 Creating personal info document...");
    const githubLink = socialLinks.find((l) => l.name === "GitHub");
    const linkedinLink = socialLinks.find((l) => l.name === "LinkedIn");

    const personalInfoContent = `
# About ${personalInfo.fullName}

## Personal Information
Name: ${personalInfo.fullName}
Title: ${personalInfo.title}
Email: ${personalInfo.email}
Location: ${personalInfo.location.display}
GitHub: ${githubLink?.url || "N/A"}
LinkedIn: ${linkedinLink?.url || "N/A"}
Website: ${personalInfo.website}

## Professional Summary
${personalInfo.summary}

## Languages
${aboutConfig.languages.map((l) => `- ${l.language}: ${l.proficiency}`).join("\n")}

## Soft Skills
${aboutConfig.softSkills.map((s) => `- ${s}`).join("\n")}

## Professional Interests
${aboutConfig.interests.map((i) => `- ${i}`).join("\n")}
`;

    allDocuments.push(
      new Document({
        pageContent: personalInfoContent,
        metadata: {
          source: "resume",
          type: "personal_info",
          section: "personalInfo",
          importance: "high",
        },
      })
    );

    // === WORK EXPERIENCE DOCUMENTS ===
    console.log("📄 Creating work experience documents...");
    for (const exp of experiences) {
      const expContent = `
# Work Experience: ${exp.role} at ${exp.company}

## Position Details
Role: ${exp.role}
Company: ${exp.company}
Period: ${exp.period} (${exp.startDate} - ${exp.endDate})
Location: ${exp.location}
Type: ${exp.type}

## Description
${exp.description}

## Key Achievements
${exp.achievements.map((a) => `- ${a}`).join("\n")}

## Technologies Used
${exp.tech.join(", ")}
`;

      allDocuments.push(
        new Document({
          pageContent: expContent,
          metadata: {
            source: "resume",
            type: "work_experience",
            section: "experience",
            company: exp.company,
            role: exp.role,
            importance: "high",
          },
        })
      );
    }

    // === SKILLS DOCUMENTS ===
    console.log("📄 Creating skills documents...");
    for (const category of skillCategories) {
      const skillsContent = `
# Skills: ${category.name}

## ${category.name} Technologies
${personalInfo.firstName} is proficient in the following ${category.name.toLowerCase()} technologies:

${category.skills.map((s) => `- ${s.name}: ${s.level}% proficiency`).join("\n")}
`;

      allDocuments.push(
        new Document({
          pageContent: skillsContent,
          metadata: {
            source: "resume",
            type: `skills_${category.name.toLowerCase()}`,
            section: "skills",
            category: category.name,
            importance: "medium",
          },
        })
      );
    }

    // Overall skills summary
    const allSkillsContent = `
# Technical Skills Summary

## All Technologies
${personalInfo.firstName} is proficient in the following technologies:
${skillsList.map((skill) => `- ${skill}`).join("\n")}

## Skill Categories
${skillCategories.map((c) => `- ${c.name}: ${c.skills.map((s) => s.name).join(", ")}`).join("\n")}
`;

    allDocuments.push(
      new Document({
        pageContent: allSkillsContent,
        metadata: {
          source: "resume",
          type: "skills_summary",
          section: "skills",
          importance: "high",
        },
      })
    );

    // === PROJECT DOCUMENTS ===
    console.log("📄 Creating project documents...");
    for (const project of projects) {
      const projectContent = `
# Project: ${project.name}

## Project Details
Name: ${project.name}
Status: ${project.status}
URL: ${project.url || "N/A"}

## Description
${project.description}

## Technologies Used
${project.tech.join(", ")}
`;

      allDocuments.push(
        new Document({
          pageContent: projectContent,
          metadata: {
            source: "resume",
            type: "project",
            section: "projects",
            projectName: project.name,
            importance: "medium",
          },
        })
      );
    }

    // === EDUCATION DOCUMENTS ===
    console.log("📄 Creating education documents...");
    for (const edu of education) {
      const eduContent = `
# Education: ${edu.degree}

## Education Details
Degree: ${edu.degree}
Institution: ${edu.institution}
Period: ${edu.startDate} - ${edu.endDate}
${edu.institutionUrl ? `Institution Website: ${edu.institutionUrl}` : ""}

## Description
${edu.description}
`;

      allDocuments.push(
        new Document({
          pageContent: eduContent,
          metadata: {
            source: "resume",
            type: "education",
            section: "education",
            institution: edu.institution,
            importance: "medium",
          },
        })
      );
    }

    // === CERTIFICATIONS DOCUMENT ===
    if (certifications.length > 0) {
      console.log("📄 Creating certifications document...");
      const certContent = `
# Certifications

${certifications
  .map(
    (cert) => `
## ${cert.name}
Issuer: ${cert.issuer || "N/A"}
Date: ${cert.date}
Description: ${cert.description}
`
  )
  .join("\n")}
`;

      allDocuments.push(
        new Document({
          pageContent: certContent,
          metadata: {
            source: "resume",
            type: "certifications",
            section: "certifications",
            importance: "medium",
          },
        })
      );
    }

    // === RECRUITER SUMMARY DOCUMENT ===
    console.log("📄 Creating recruiter summary document...");
    const recruiterSummary = `
# Quick Summary for Recruiters

## ${personalInfo.fullName} - ${personalInfo.title}

### Current Status
- Availability: ${personalInfo.availability.message}
- Location: ${personalInfo.location.display}
- Remote: Open to remote work

### Key Highlights
- ${experiences.length > 0 ? `Currently: ${experiences[0].role} at ${experiences[0].company}` : "Experienced developer"}
- Specializes in React, Next.js, TypeScript, PHP, and AI/ML technologies
- Experience with LangChain, OpenAI, and RAG systems

### Contact
- Email: ${personalInfo.email}
- GitHub: ${githubLink?.url || "N/A"}
- LinkedIn: ${linkedinLink?.url || "N/A"}
- Website: ${personalInfo.website}

### Why Hire ${personalInfo.firstName}?
1. Proven track record in enterprise software development
2. Strong AI/ML integration skills
3. Experience building production RAG systems
4. Excellent communication in ${aboutConfig.languages.slice(0, 2).map((l) => `${l.language} (${l.proficiency})`).join(", ")}
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

    // === CONTACT/HIRING DOCUMENT ===
    console.log("📄 Creating contact/hiring document...");
    const contactContent = `
# How to Contact and Hire ${personalInfo.firstName}

## Contact Information
- Email: ${personalInfo.email}
- GitHub: ${githubLink?.url || "N/A"}
- LinkedIn: ${linkedinLink?.url || "N/A"}
- Website: ${personalInfo.website}
- Location: ${personalInfo.location.display}

## Availability
${personalInfo.availability.message}

## Preferred Contact Method
Email is the best way to reach ${personalInfo.firstName}: ${personalInfo.email}

## Download Resume
${personalInfo.firstName}'s CV/Resume can be downloaded from: ${personalInfo.resumeUrl}
`;

    allDocuments.push(
      new Document({
        pageContent: contactContent,
        metadata: {
          source: "resume",
          type: "contact_hiring",
          section: "contact",
          importance: "high",
        },
      })
    );

    console.log(`  Created ${allDocuments.length} resume documents`);

    // Load blog posts
    console.log("\n📝 Loading blog posts...");
    const blogDocuments = loadBlogPosts();
    allDocuments.push(...blogDocuments);
    console.log(`  Loaded ${blogDocuments.length} blog posts`);

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
    console.log(`   - Personal info: 1`);
    console.log(`   - Work experience: ${experiences.length}`);
    console.log(`   - Skill categories: ${skillCategories.length + 1}`);
    console.log(`   - Projects: ${projects.length}`);
    console.log(`   - Education: ${education.length}`);
    console.log(`   - Certifications: ${certifications.length > 0 ? 1 : 0}`);
    console.log(`   - Blog posts: ${blogDocuments.length}`);
    console.log(`   - Summary docs: 2`);
    console.log(`   - Total chunks: ${splitDocs.length}`);
  } catch (error) {
    console.error("Error generating embeddings:", error);
    throw error;
  }
}

generateEmbeddings().catch(console.error);
