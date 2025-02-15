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
  overall_score: number;
  analysis: {
    strengths: string[];
  };
  compatibility_issues: string[];
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const defaultErrorResult: ValidationResult = {
  isValid: false,
  message: '',
  details: '',
  overall_score: 0,
  analysis: {
    strengths: []
  },
  compatibility_issues: []
};

export async function POST(request: Request): Promise<NextResponse> {
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(
      {
        ...defaultErrorResult,
        message: 'Validation service is not configured',
        details: 'OpenAI API key is missing',
        compatibility_issues: ['Service not configured']
      },
      { status: 500 }
    );
  }

  try {
    const { nodes, edges } = await request.json();

    if (!nodes?.length) {
      return NextResponse.json(
        {
          ...defaultErrorResult,
          message: 'No technologies to validate',
          compatibility_issues: ['No technologies provided']
        },
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
  "details": "A detailed explanation of the analysis, including specific recommendations if there are issues",
  "overall_score": number,
  "analysis": {
    "strengths": string[]
  },
  "compatibility_issues": string[]
}`;

    const responseFormat = `{
  "isValid": boolean,
  "message": "A brief, clear summary of whether the stack is valid and why",
  "details": "A detailed explanation of the analysis, including specific recommendations if there are issues",
  "overall_score": number,
  "analysis": {
    "strengths": ["List of key strengths in the tech stack"]
  },
  "compatibility_issues": ["List of potential compatibility or architectural issues"]
}`;

    const userPrompt = `Analyze this technology stack:
Technologies:
${technologies.map(tech => `- ${tech.name} (${tech.type})`).join('\n')}

Connections:
${connections.length ? connections.map((conn: { source: string | undefined; target: string | undefined }) => 
  `- ${conn.source} → ${conn.target}`
).join('\n') : 'No connections defined'}

Provide a detailed analysis of the technology stack, including:
1. Overall validity of the stack
2. Compatibility between chosen technologies
3. Key strengths and potential issues
4. A score from 0-100 based on the stack's overall quality

Return the analysis in the following JSON format:
${responseFormat}`;

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
      const validationResult = JSON.parse(response) as ValidationResult;
      
      // Ensure all required properties exist with default values if missing
      return NextResponse.json({
        isValid: validationResult.isValid ?? false,
        message: validationResult.message ?? 'No validation message provided',
        details: validationResult.details,
        overall_score: validationResult.overall_score ?? 0,
        analysis: {
          strengths: validationResult.analysis?.strengths ?? []
        },
        compatibility_issues: validationResult.compatibility_issues ?? []
      } as ValidationResult);
    } catch (error) {
      console.error('Error parsing OpenAI response:', error);
      console.error('Raw response:', response);
      return NextResponse.json({
        ...defaultErrorResult,
        message: 'Error analyzing tech stack',
        details: `Failed to parse validation results. Raw response: ${response}`,
        compatibility_issues: ['Failed to parse validation results']
      } as ValidationResult);
    }
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      {
        ...defaultErrorResult,
        message: 'Failed to validate tech stack',
        details: error instanceof Error ? error.message : 'Unknown error occurred',
        compatibility_issues: ['Failed to validate tech stack']
      },
      { status: 500 }
    );
  }
}
