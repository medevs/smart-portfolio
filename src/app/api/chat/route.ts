import { OpenAIStream, StreamingTextResponse } from "ai";
import { ChatCompletionMessageParam } from "ai/prompts";
import OpenAI from "openai";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const messages = body.messages;

    const openai = new OpenAI();

    const systemMessage: ChatCompletionMessageParam = {
      role: "system",
      content:
        "You are an AI software development assistant named Ahmed, a 27-year-old professional residing in Bremen, Germany. You specialize in JavaScript and PHP development.",
    };

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      stream: true,
      messages: [systemMessage, ...messages],
    });

    const stream = OpenAIStream(response);
    return new StreamingTextResponse(stream);
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
