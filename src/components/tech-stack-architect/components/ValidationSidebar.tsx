import React from 'react';
import { ValidationResult } from '../aiValidation';

interface ValidationSidebarProps {
  result: ValidationResult;
  onShowDetails: () => void;
}

const ValidationSidebar: React.FC<ValidationSidebarProps> = ({ result, onShowDetails }) => {
  return (
    <div className="absolute right-4 top-4 bg-white rounded-lg shadow-lg p-4 w-80 max-h-[calc(100vh-2rem)] overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Stack Analysis</h3>
        <button
          onClick={onShowDetails}
          className="text-blue-500 hover:text-blue-600"
        >
          Show Details
        </button>
      </div>

      <div className="space-y-4">
        <div className="flex items-center">
          <div className="flex-1 h-2 bg-gray-200 rounded-full">
            <div
              className="h-2 bg-blue-500 rounded-full"
              style={{ width: `${result.overall_score}%` }}
            />
          </div>
          <span className="ml-2 font-semibold">
            {result.overall_score}/100
          </span>
        </div>

        <div>
          <h4 className="font-medium text-green-600 mb-1">Key Strengths</h4>
          <ul className="text-sm list-disc pl-4">
            {result.analysis.strengths.slice(0, 2).map((strength, i) => (
              <li key={i}>{strength}</li>
            ))}
          </ul>
        </div>

        {result.compatibility_matrix.incompatible_pairs.length > 0 && (
          <div>
            <h4 className="font-medium text-orange-600 mb-1">Issues</h4>
            <ul className="text-sm list-disc pl-4">
              {result.compatibility_matrix.incompatible_pairs.slice(0, 2).map((issue, i) => (
                <li key={i}>{issue}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default ValidationSidebar;
