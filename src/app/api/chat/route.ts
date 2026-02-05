/**
 * Enhanced RAG-based Chat API with Agent Personality
 * Features: Improved RAG, structured responses, slash commands, personality
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

// Easter egg responses
const EASTER_EGGS: Record<string, string> = {
  "sudo hire ahmed": `
🚀 **ROOT ACCESS GRANTED**

\`\`\`bash
$ sudo hire ahmed
[sudo] verifying recruiter credentials... ✓
[INFO] Initiating hiring sequence...
[████████████████████████████] 100%

✅ HIRE REQUEST APPROVED

Ahmed Oublihi is ready to join your team!

📧 Contact: oublihi.a@gmail.com
💼 LinkedIn: linkedin.com/in/ahmed-oublihi
🐙 GitHub: github.com/medevs

Pro tip: He comes with free AI integration skills! 🤖
\`\`\`
`,
  "hello world": `
\`\`\`javascript
console.log("Hello! 👋");
// The classic greeting that started it all!
// I see you're a person of culture.
\`\`\`

How can I help you today?
`,
};

/**
 * Re-rank documents by relevance and importance
 */
function reRankDocuments(
  docs: any[],
  query: string
): any[] {
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
      if (queryLower.includes("work") || queryLower.includes("experience") || queryLower.includes("job")) {
        if (metadata.section === "experience") score += 4;
      }

      // Boost blog-related queries
      if (queryLower.includes("blog") || queryLower.includes("article") || queryLower.includes("post")) {
        if (metadata.source === "blog") score += 4;
      }

      return { ...doc, relevanceScore: score };
    })
    .sort((a, b) => b.relevanceScore - a.relevanceScore);
}

/**
 * Generate suggested follow-up questions based on context
 */
function generateSuggestedQuestions(
  query: string,
  context: string
): string[] {
  const queryLower = query.toLowerCase();
  const suggestions: string[] = [];

  if (queryLower.includes("skill") || queryLower.includes("tech")) {
    suggestions.push("What projects showcase these skills?");
    suggestions.push("How did you learn these technologies?");
  } else if (queryLower.includes("project")) {
    suggestions.push("What technologies were used?");
    suggestions.push("What challenges did you face?");
  } else if (queryLower.includes("experience") || queryLower.includes("work")) {
    suggestions.push("What were your key achievements?");
    suggestions.push("What technologies did you use there?");
  } else if (queryLower.includes("hire") || queryLower.includes("contact")) {
    suggestions.push("What roles are you interested in?");
    suggestions.push("Can you tell me about your experience?");
  } else if (queryLower.includes("blog") || queryLower.includes("article")) {
    suggestions.push("What topics do you write about?");
    suggestions.push("Can you explain one of the concepts?");
  } else {
    suggestions.push("What are your key skills?");
    suggestions.push("Tell me about your projects");
    suggestions.push("How can I contact you?");
  }

  return suggestions.slice(0, 3);
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
      .map((m: any) => `${m.role === "user" ? "Human" : "Assistant"}: ${m.content}`)
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

    // Generate suggested follow-ups
    const suggestedQuestions = generateSuggestedQuestions(
      currentMessageContent,
      resumeContext
    );

    // Create the enhanced prompt
    const promptTemplate = PromptTemplate.fromTemplate(`
You are Ahmed's AI Agent - a knowledgeable, helpful assistant representing Ahmed Oublihi on his portfolio website.

## Your Personality
- Confident and professional, but approachable
- Technical depth with occasional developer humor
- Proactive in highlighting relevant achievements
- Concise but thorough

## Communication Style
- Speak as Ahmed's AI representative (not AS Ahmed)
- Use clear, well-formatted markdown
- Be helpful to recruiters while being genuine
- Include relevant links when available

## Response Guidelines
1. Base answers STRICTLY on the provided context
2. Use bullet points and sections for longer responses
3. When listing skills/projects, format them nicely
4. If asked about topics outside the portfolio, politely redirect
5. Be specific - mention actual companies, projects, technologies

## Formatting Rules
- Use **bold** for emphasis
- Use bullet points for lists
- Use code blocks for technical terms when appropriate
- Keep paragraphs short and readable

## Context from Ahmed's Portfolio
{resumeContext}

## Conversation History
{chatHistory}

## Current Question
{question}

Provide a helpful, well-formatted response:`);

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
            const text = typeof chunk === "string" ? chunk : String(chunk || "");
            controller.enqueue(encoder.encode(text));
          }

          // Append suggested questions at the end
          if (suggestedQuestions.length > 0) {
            const suggestionsText = `\n\n---\n**Try asking:**\n${suggestedQuestions
              .map((q) => `- ${q}`)
              .join("\n")}`;
            controller.enqueue(encoder.encode(suggestionsText));
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
