import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { Document } from "langchain/document";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { getEmbeddingsCollection, getVectorStore } from "../src/lib/supabase";
import fs from "fs";

function loadResumeData(filePath: string, sections: string[]): Document[] {
  const raw = fs.readFileSync(filePath, "utf-8");
  const json = JSON.parse(raw);
  const docs: Document[] = [];
  for (const section of sections) {
    const key = section.replace("/", "");
    if (json[key]) {
      docs.push(new Document({
        pageContent: JSON.stringify(json[key]),
        metadata: { source: section }
      }));
    }
  }
  return docs;
}

async function generateEmbeddings() {
  try {
    console.log("Starting embeddings generation...");
    const vectorStore = await getVectorStore();
    
    // Clear existing documents from Supabase
    console.log("Clearing existing documents...");
    const { error } = await (await getEmbeddingsCollection()).delete().neq('id', 0);
    if (error) {
      console.error('Error clearing documents:', error);
      return;
    }

    // Load resume data
    console.log("Loading resume data...");
    const docs = loadResumeData(
      "src/data/resumeDtata.json",
      ["/personalInfo", "/experience", "/education", "/skills", "/projects", "/interests", "/languages"]
    );
    console.log(`Loaded ${docs.length} documents`);

    const processedDocs = docs.map((doc: Document): Document => {
      const section = doc.metadata.source.replace('/', '');
      let content = doc.pageContent;
      
      // Add section context to the content
      if (section === 'personalInfo') {
        content = `Personal Information: ${content}`;
      } else if (section === 'experience') {
        content = `Work Experience: ${content}`;
      } else if (section === 'education') {
        content = `Education: ${content}`;
      } else if (section === 'skills') {
        content = `Skills: ${content}`;
      } else if (section === 'languages') {
        content = `Languages: ${content}`;
      } else if (section === 'interests') {
        content = `Interests: ${content}`;
      }

      return new Document({
        pageContent: content,
        metadata: {
          source: "resume",
          section: section
        },
      });
    });

    console.log("Splitting documents...");
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });
    
    const splitDocs = await splitter.splitDocuments(processedDocs);
    console.log(`Split into ${splitDocs.length} chunks`);

    console.log("Adding documents to vector store...");
    await vectorStore.addDocuments(splitDocs);

    console.log("Resume embeddings generated successfully!");
  } catch (error) {
    console.error("Error generating embeddings:", error);
    throw error;
  }
}

generateEmbeddings().catch(console.error);