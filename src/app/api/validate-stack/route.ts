import { OpenAI } from 'openai';
import { NextResponse } from 'next/server';
import { Node, Edge } from 'reactflow';
import { ValidationResult } from '@/components/tech-stack-architect/aiValidation';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const systemPrompt = `You are a technology stack validator. Analyze the provided technology stack and return a detailed analysis in JSON format with the following structure:
{
  "isValid": boolean,
  "message": "A brief summary message",
  "overall_score": number (0-100),
  "scores": {
    "overall": number (0-100),
    "performance": number (0-100),
    "scalability": number (0-100),
    "maintainability": number (0-100),
    "security": number (0-100),
    "cost_efficiency": number (0-100)
  },
  "analysis": {
    "strengths": ["list of strengths"],
    "weaknesses": ["list of weaknesses"],
    "performance_impact": "detailed performance analysis",
    "scalability_assessment": "detailed scalability analysis",
    "security_considerations": "detailed security analysis",
    "cost_efficiency": "detailed cost analysis",
    "learning_curve": "learning curve assessment",
    "community_support": "community support assessment"
  },
  "compatibility_matrix": {
    "compatible_pairs": ["list of well-working technology combinations"],
    "incompatible_pairs": ["list of problematic combinations"],
    "suggestions": ["list of compatibility improvement suggestions"]
  },
  "recommendations": {
    "immediate_actions": ["list of immediate actions to take"],
    "future_considerations": ["list of things to consider for the future"],
    "alternative_technologies": ["list of alternative technologies to consider"]
  }
}

Provide a thorough analysis of how well the technologies work together, their strengths and weaknesses, and specific recommendations for improvement.
Score each aspect from 0-100 based on industry best practices and real-world performance data.
Be specific in your recommendations and provide actionable insights.`;

const defaultResult: ValidationResult = {
  isValid: false,
  message: 'Error validating stack',
  overall_score: 0,
  scores: {
    overall: 0,
    performance: 0,
    scalability: 0,
    maintainability: 0,
    security: 0,
    cost_efficiency: 0
  },
  analysis: {
    strengths: [],
    weaknesses: [],
    performance_impact: '',
    scalability_assessment: '',
    security_considerations: '',
    cost_efficiency: '',
    learning_curve: '',
    community_support: ''
  },
  compatibility_matrix: {
    compatible_pairs: [],
    incompatible_pairs: [],
    suggestions: []
  },
  recommendations: {
    immediate_actions: [],
    future_considerations: [],
    alternative_technologies: []
  }
};

interface NodeData {
  label?: string;
  [key: string]: any;
}

export async function POST(request: Request) {
  try {
    const { nodes, edges }: { nodes: Node<NodeData>[], edges: Edge[] } = await request.json();

    if (!nodes || !Array.isArray(nodes) || nodes.length === 0) {
      return NextResponse.json({
        ...defaultResult,
        message: 'No technologies provided'
      });
    }

    const technologies = nodes
      .map(node => (node.data?.label ?? ''))
      .filter(Boolean)
      .join(', ');

    const relationships = edges
      .map(edge => {
        const sourceNode = nodes.find(n => n.id === edge.source);
        const targetNode = nodes.find(n => n.id === edge.target);
        const sourceLabel = sourceNode?.data?.label;
        const targetLabel = targetNode?.data?.label;
        
        return sourceLabel && targetLabel 
          ? `${sourceLabel} -> ${targetLabel}`
          : null;
      })
      .filter((rel): rel is string => rel !== null)
      .join(', ');

    const userPrompt = `Analyze this technology stack:
Technologies: ${technologies}
${relationships ? `Relationships: ${relationships}` : 'No relationships defined'}

Provide a detailed analysis of the stack's viability, strengths, weaknesses, and recommendations.`;

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

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No response content from OpenAI');
    }

    const result = JSON.parse(content) as ValidationResult;
    return NextResponse.json(result);

  } catch (error) {
    console.error('Error in validate-stack:', error);
    return NextResponse.json(defaultResult, { status: 500 });
  }
}
