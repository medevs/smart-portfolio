import { Node, Edge } from 'reactflow';

export interface ValidationResult {
  isValid: boolean;
  message: string;
  details?: string;
  overall_score: number;
  scores: {
    overall: number;
    performance: number;
    scalability: number;
    maintainability: number;
    security: number;
    cost_efficiency: number;
  };
  analysis: {
    strengths: string[];
    weaknesses: string[];
    performance_impact: string;
    scalability_assessment: string;
    security_considerations: string;
    cost_efficiency: string;
    learning_curve: string;
    community_support: string;
  };
  compatibility_matrix: {
    compatible_pairs: string[];
    incompatible_pairs: string[];
    suggestions: string[];
  };
  recommendations: {
    immediate_actions: string[];
    future_considerations: string[];
    alternative_technologies: string[];
  };
}

export async function validateTechStack(nodes: Node[], edges: Edge[]): Promise<ValidationResult> {
  if (!nodes.length) {
    return {
      isValid: false,
      message: 'Stack is empty. Please add some technologies.',
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
  }

  try {
    const response = await fetch('/api/validate-stack', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ nodes, edges }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    
    if (!result || typeof result.isValid !== 'boolean' || 
        typeof result.overall_score !== 'number' || 
        !Array.isArray(result.analysis?.strengths) ||
        !Array.isArray(result.analysis?.weaknesses) ||
        !Array.isArray(result.compatibility_matrix?.compatible_pairs) ||
        !Array.isArray(result.compatibility_matrix?.incompatible_pairs) ||
        !Array.isArray(result.compatibility_matrix?.suggestions) ||
        !Array.isArray(result.recommendations?.immediate_actions) ||
        !Array.isArray(result.recommendations?.future_considerations) ||
        !Array.isArray(result.recommendations?.alternative_technologies)) {
      throw new Error('Invalid response format from validation API');
    }

    return result as ValidationResult;
  } catch (error) {
    console.error('Error validating stack:', error);
    return {
      isValid: false,
      message: 'Error validating stack. Please try again.',
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
  }
}
