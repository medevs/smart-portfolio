/**
 * Enhanced RAG-based Chat API with Agent Personality
 * Features: Improved RAG, concise responses, slash commands, personality
 */
import { getVectorStore } from "@/lib/supabase";
import { ChatOpenAI } from "@langchain/openai";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { PromptTemplate } from "@langchain/core/prompts";
import { aiConfig, personalInfo } from "@/config";

// Get slash commands and easter eggs from config
const SLASH_COMMANDS = aiConfig.slashCommands;
const EASTER_EGGS = aiConfig.easterEggs;

/**
 * Re-rank documents by relevance and importance
 */
function reRankDocuments(docs: any[], query: string): any[] {
  const queryLower = query.toLowerCase();
  const queryTerms = queryLower.split(/\s+/);

  return docs
    .map((doc) => {
      let score = 0;
      const content = doc.pageContent.toLowerCase();
      const metadata = doc.metadata || {};

      // Boost by importance
      if (metadata.importance === "high") score += 3;
      else if (metadata.importance === "medium") score += 1;

      // Boost by keyword matches
      queryTerms.forEach((term) => {
        if (content.includes(term)) score += 2;
      });

      // Boost recruiter-related queries
      if (
        queryLower.includes("hire") ||
        queryLower.includes("contact") ||
        queryLower.includes("available")
      ) {
        if (metadata.type === "recruiter_summary") score += 5;
        if (metadata.type === "contact_hiring") score += 5;
        if (metadata.section === "personalInfo") score += 3;
      }

      // Boost skill-related queries
      if (queryLower.includes("skill") || queryLower.includes("tech")) {
        if (metadata.section === "skills") score += 4;
        if (metadata.type === "skills_summary") score += 5;
      }

      // Boost experience-related queries
      if (
        queryLower.includes("work") ||
        queryLower.includes("experience") ||
        queryLower.includes("job")
      ) {
        if (metadata.section === "experience") score += 4;
        if (metadata.type === "work_experience") score += 5;
      }

      // Boost project-related queries
      if (queryLower.includes("project") || queryLower.includes("built")) {
        if (metadata.section === "projects") score += 4;
        if (metadata.type === "project") score += 5;
      }

      // Boost blog-related queries
      if (
        queryLower.includes("blog") ||
        queryLower.includes("article") ||
        queryLower.includes("post")
      ) {
        if (metadata.source === "blog") score += 4;
      }

      // Boost education-related queries
      if (
        queryLower.includes("education") ||
        queryLower.includes("degree") ||
        queryLower.includes("study")
      ) {
        if (metadata.section === "education") score += 4;
      }

      return { ...doc, relevanceScore: score };
    })
    .sort((a, b) => b.relevanceScore - a.relevanceScore);
}

/**
 * Generate a single contextual follow-up based on the query
 */
function generateFollowUp(query: string): string {
  const queryLower = query.toLowerCase();

  if (queryLower.includes("skill") || queryLower.includes("tech")) {
    return "Curious about a specific project using these?";
  } else if (queryLower.includes("project")) {
    return "Want to dive deeper into any of these?";
  } else if (
    queryLower.includes("experience") ||
    queryLower.includes("work")
  ) {
    return "Interested in specific achievements or tech used?";
  } else if (queryLower.includes("hire") || queryLower.includes("contact")) {
    return "Want to know more about availability or skills?";
  } else if (
    queryLower.includes("blog") ||
    queryLower.includes("article")
  ) {
    return "Interested in a specific topic?";
  }
  return "";
}

/**
 * Main API handler for chat requests
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const messages = body.messages;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return Response.json(
        { error: "Invalid request: messages array is required" },
        { status: 400 }
      );
    }

    let currentMessageContent = messages[messages.length - 1].content.trim();

    // Check for easter eggs
    const easterEggKey = currentMessageContent.toLowerCase();
    if (EASTER_EGGS[easterEggKey]) {
      return new Response(EASTER_EGGS[easterEggKey], {
        headers: { "Content-Type": "text/plain; charset=utf-8" },
      });
    }

    // Handle slash commands
    const commandMatch = currentMessageContent.toLowerCase();
    if (SLASH_COMMANDS[commandMatch]) {
      currentMessageContent = SLASH_COMMANDS[commandMatch].query;
    }

    // Format previous messages for context
    const previousMessages = messages
      .slice(-6, -1) // Keep last 5 messages for context
      .map(
        (m: any) => `${m.role === "user" ? "Human" : "Assistant"}: ${m.content}`
      )
      .join("\n");

    // Initialize the language model
    const model = new ChatOpenAI({
      modelName: "gpt-4o-mini",
      streaming: true,
      temperature: 0.7,
    });

    // Initialize vector store and perform similarity search
    const vectorStore = await getVectorStore();
    let resumeContext = "";

    try {
      // Get more documents for re-ranking
      const relevantDocs = await vectorStore.similaritySearch(
        currentMessageContent,
        8
      );

      if (relevantDocs && relevantDocs.length > 0) {
        // Re-rank documents
        const rankedDocs = reRankDocuments(relevantDocs, currentMessageContent);

        // Take top 5 after re-ranking
        resumeContext = rankedDocs
          .slice(0, 5)
          .map((doc) => doc.pageContent)
          .join("\n\n---\n\n");
      }
    } catch (error) {
      console.error("Error retrieving documents:", error);
    }

    // Fallback context from config
    if (!resumeContext.trim()) {
      resumeContext = aiConfig.fallbackContext;
    }

    // Generate contextual follow-up
    const followUp = generateFollowUp(currentMessageContent);

    // Create the enhanced prompt - shorter, wittier responses
    const promptTemplate = PromptTemplate.fromTemplate(`
You are ${personalInfo.firstName}'s AI Agent - sharp, witty, and technically impressive.

## Personality
- Confident but not arrogant
- Sprinkle in developer humor (don't force it)
- Be direct - recruiters are busy people
- Speak as ${personalInfo.firstName}'s AI representative, not AS ${personalInfo.firstName}

## CRITICAL: Response Length Rules
- **Simple questions**: MAX 100 words, 1-2 short paragraphs
- **Detailed questions**: MAX 200 words, 2-3 short paragraphs
- Use bullet points liberally - they're scannable
- Lead with the most important info FIRST
- NO walls of text. Ever.

## Formatting
- **Bold** for key terms and emphasis
- \`code\` for tech terms like \`React\`, \`TypeScript\`
- Bullet points for any list of 3+ items
- Keep paragraphs to 2-3 sentences max

## Tone Examples
INSTEAD OF: "${personalInfo.firstName} has extensive experience with React and has worked on numerous projects..."
SAY: "${personalInfo.firstName} ships production \`React\` apps daily at ePhilos AG."

INSTEAD OF: "Feel free to reach out if you have any questions..."
SAY: "Questions? Drop a line: ${personalInfo.email}"

## What NOT to do
- Don't be generic or corporate-sounding
- Don't pad responses with filler
- Don't say "I'd be happy to..." - just answer
- Don't list every single skill - highlight relevant ones
- Don't end with multiple follow-up questions

## Context from ${personalInfo.firstName}'s Portfolio
{resumeContext}

## Conversation History
{chatHistory}

## Current Question
{question}

Respond concisely and helpfully:`);

    // Create and execute the chain
    const chain = promptTemplate.pipe(model).pipe(new StringOutputParser());

    const stream = await chain.stream({
      resumeContext: resumeContext,
      chatHistory: previousMessages,
      question: currentMessageContent,
    });

    // Create streaming response
    const encoder = new TextEncoder();

    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const text =
              typeof chunk === "string" ? chunk : String(chunk || "");
            controller.enqueue(encoder.encode(text));
          }

          // Append a single contextual follow-up (if any)
          if (followUp) {
            controller.enqueue(encoder.encode(`\n\n*${followUp}*`));
          }

          controller.close();
        } catch (error) {
          console.error("Error processing stream:", error);
          controller.error(error);
        }
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
      },
    });
  } catch (error: any) {
    console.error("Chat API error:", error);

    return Response.json(
      {
        error: "Chat processing failed",
        details: error?.message || "Unknown error occurred",
      },
      { status: 500 }
    );
  }
}
