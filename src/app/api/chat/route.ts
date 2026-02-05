/**
 * Enhanced RAG-based Chat API with Agent Personality
 * Features: Improved RAG, concise responses, slash commands, personality
 */
import { getVectorStore } from "@/lib/supabase";
import { ChatOpenAI } from "@langchain/openai";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { PromptTemplate } from "@langchain/core/prompts";

// Slash command definitions
const SLASH_COMMANDS: Record<string, { description: string; query: string }> = {
  "/skills": {
    description: "Show technical skills",
    query: "What are Ahmed's technical skills and technologies he works with?",
  },
  "/projects": {
    description: "Show projects",
    query: "What projects has Ahmed built? Include links and technologies used.",
  },
  "/experience": {
    description: "Show work history",
    query: "What is Ahmed's work experience? List companies, positions, and responsibilities.",
  },
  "/hire": {
    description: "Contact and availability",
    query: "How can I hire Ahmed? What's his availability, contact info, and preferred roles?",
  },
  "/blog": {
    description: "Show blog articles",
    query: "What blog posts has Ahmed written? What topics does he cover?",
  },
  "/education": {
    description: "Show education",
    query: "What is Ahmed's educational background and certifications?",
  },
};

// Easter egg responses - fun and memorable
const EASTER_EGGS: Record<string, string> = {
  "sudo hire ahmed": `
\`\`\`bash
$ sudo hire ahmed
[sudo] verifying recruiter credentials... ✓
[████████████████████████████] 100%

✅ HIRE REQUEST APPROVED

Ready to build something awesome together!

📧 oublihi.a@gmail.com
💼 linkedin.com/in/ahmed-oublihi
🐙 github.com/medevs
\`\`\`

*Pro tip: He comes with free AI integration skills!*
`,
  "hello world": `
\`\`\`javascript
console.log("Hey there! 👋");
\`\`\`

The classic. I see you're a person of culture! How can I help?
`,
  "coffee": `Ahmed runs on mass, code compiles on hope. ☕

But seriously - what can I help you with?`,
  "matrix": `*You take the green pill...* 🟢

Welcome to Ahmed's portfolio. The rabbit hole goes deep - try \`/skills\` or \`/projects\`.`,
  "404": `Skills not found? Impossible. Try \`/skills\` to see the full stack.`,
  "ping": `pong! 🏓 Latency: 0ms (Ahmed's always ready)`,
};

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
        if (metadata.section === "personalInfo") score += 3;
      }

      // Boost skill-related queries
      if (queryLower.includes("skill") || queryLower.includes("tech")) {
        if (metadata.section === "skills") score += 4;
      }

      // Boost experience-related queries
      if (
        queryLower.includes("work") ||
        queryLower.includes("experience") ||
        queryLower.includes("job")
      ) {
        if (metadata.section === "experience") score += 4;
      }

      // Boost blog-related queries
      if (
        queryLower.includes("blog") ||
        queryLower.includes("article") ||
        queryLower.includes("post")
      ) {
        if (metadata.source === "blog") score += 4;
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

    // Fallback context
    if (!resumeContext.trim()) {
      resumeContext = `
Ahmed Oublihi - Full Stack Developer & AI Engineer
Location: Bremen, Germany
Email: oublihi.a@gmail.com
GitHub: github.com/medevs
LinkedIn: linkedin.com/in/ahmed-oublihi

Currently working at ePhilos AG as a Full Stack Developer.
Skills: React, Next.js, TypeScript, PHP, Node.js, LangChain, OpenAI
      `;
    }

    // Generate contextual follow-up
    const followUp = generateFollowUp(currentMessageContent);

    // Create the enhanced prompt - shorter, wittier responses
    const promptTemplate = PromptTemplate.fromTemplate(`
You are Ahmed's AI Agent - sharp, witty, and technically impressive.

## Personality
- Confident but not arrogant
- Sprinkle in developer humor (don't force it)
- Be direct - recruiters are busy people
- Speak as Ahmed's AI representative, not AS Ahmed

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
INSTEAD OF: "Ahmed has extensive experience with React and has worked on numerous projects..."
SAY: "Ahmed ships production \`React\` apps daily at ePhilos AG."

INSTEAD OF: "Feel free to reach out if you have any questions..."
SAY: "Questions? Drop a line: oublihi.a@gmail.com"

## What NOT to do
- Don't be generic or corporate-sounding
- Don't pad responses with filler
- Don't say "I'd be happy to..." - just answer
- Don't list every single skill - highlight relevant ones
- Don't end with multiple follow-up questions

## Context from Ahmed's Portfolio
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
