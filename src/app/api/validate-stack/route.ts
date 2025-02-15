import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { Node, Edge } from 'reactflow';

interface TechNode {
  name: string;
  type: string;
}

interface ValidationResult {
  isValid: boolean;
  message: string;
  details?: string;
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request): Promise<NextResponse> {
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(
      { 
        isValid: false,
        message: 'Validation service is not configured',
        details: 'OpenAI API key is missing'
      } as ValidationResult,
      { status: 500 }
    );
  }

  try {
    const { nodes, edges } = await request.json();

    if (!nodes?.length) {
      return NextResponse.json(
        {
          isValid: false,
          message: 'No technologies to validate',
        } as ValidationResult,
        { status: 400 }
      );
    }

    const technologies: TechNode[] = nodes.map((node: Node) => ({
      name: (node.data as any).name,
      type: (node.data as any).type,
    }));

    const connections = edges.map((edge: Edge) => {
      const sourceNode = nodes.find((node: Node) => node.id === edge.source);
      const targetNode = nodes.find((node: Node) => node.id === edge.target);
      return {
        source: sourceNode?.data?.name,
        target: targetNode?.data?.name,
      };
    });

    const systemPrompt = `You are an expert software architect specializing in technology stack validation. 
Your task is to analyze technology stacks and provide clear, concise feedback about their validity.
Always respond with a JSON object in this exact format:
{
  "isValid": boolean,
  "message": "A brief, clear summary of whether the stack is valid and why",
  "details": "A detailed explanation of the analysis, including specific recommendations if there are issues"
}`;

    const userPrompt = `Analyze this technology stack:

Technologies:
${technologies.map((tech: TechNode) => `- ${tech.name} (${tech.type})`).join('\n')}

Connections:
${connections.map((conn: { source: string | undefined; target: string | undefined }) => 
  `- ${conn.source} → ${conn.target}`
).join('\n')}

Consider:
1. Technology compatibility
2. Architecture patterns
3. Common practices
4. Potential issues
5. Performance implications
6. Scalability concerns

Provide a thorough analysis in the required JSON format.`;

    const completion = await openai.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      model: "gpt-3.5-turbo",
      temperature: 0.7,
      max_tokens: 1000,
      response_format: { type: "json_object" }
    });

    const response = completion.choices[0]?.message?.content;
    if (!response) {
      throw new Error('No response from OpenAI');
    }

    try {
      const result = JSON.parse(response) as ValidationResult;
      if (typeof result.isValid !== 'boolean' || typeof result.message !== 'string') {
        throw new Error('Invalid response format');
      }
      return NextResponse.json(result);
    } catch (error) {
      console.error('Error parsing OpenAI response:', error);
      console.error('Raw response:', response);
      return NextResponse.json({
        isValid: false,
        message: 'Error analyzing tech stack',
        details: `Failed to parse validation results. Raw response: ${response}`,
      } as ValidationResult);
    }
  } catch (error) {
    console.error('Validation error:', error);
    return NextResponse.json(
      {
        isValid: false,
        message: 'Failed to validate tech stack',
        details: error instanceof Error ? error.message : 'Unknown error occurred',
      } as ValidationResult,
      { status: 500 }
    );
  }
}
