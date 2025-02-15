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
        analysis: {
          strengths: []
        },
        compatibility_issues: ['Validation failed']
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
