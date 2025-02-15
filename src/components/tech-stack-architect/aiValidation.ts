import { Node, Edge } from 'reactflow';

export interface ValidationResult {
  isValid: boolean;
  message: string;
  details?: string;
}

export async function validateTechStack(nodes: Node[], edges: Edge[]): Promise<ValidationResult> {
  if (!nodes.length) {
    return {
      isValid: false,
      message: 'Stack is empty. Please add some technologies.',
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
    
    if (!result || typeof result.isValid !== 'boolean') {
      throw new Error('Invalid response format from validation API');
    }

    return result as ValidationResult;
  } catch (error) {
    console.error('Error validating stack:', error);
    return {
      isValid: false,
      message: 'Failed to validate tech stack.',
      details: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}
