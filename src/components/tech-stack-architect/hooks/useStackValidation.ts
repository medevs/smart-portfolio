import { useCallback, useState } from 'react';
import { Node, Edge } from 'reactflow';
import { validateTechStack, ValidationResult } from '../aiValidation';

export const useStackValidation = (nodes: Node[], edges: Edge[]) => {
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [showValidationModal, setShowValidationModal] = useState(false);
  const [isValidating, setIsValidating] = useState(false);

  const handleValidateStack = useCallback(async () => {
    setIsValidating(true);
    try {
      const result = await validateTechStack(nodes, edges);
      setValidationResult(result);
      setShowValidationModal(true);
    } catch (error) {
      console.error('Validation error:', error);
      setValidationResult({
        isValid: false,
        message: 'Failed to validate tech stack.',
        details: error instanceof Error ? error.message : 'Unknown error occurred',
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
          performance_impact: 'Not evaluated',
          scalability_assessment: 'Not evaluated',
          security_considerations: 'Not evaluated',
          cost_efficiency: 'Not evaluated',
          learning_curve: 'Not evaluated',
          community_support: 'Not evaluated'
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
      });
      setShowValidationModal(true);
    } finally {
      setIsValidating(false);
    }
  }, [nodes, edges]);

  return {
    validationResult,
    showValidationModal,
    setShowValidationModal,
    handleValidateStack,
    isValidating,
  };
};
