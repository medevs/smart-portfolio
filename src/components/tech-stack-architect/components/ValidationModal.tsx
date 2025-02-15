import React from 'react';
import { XCircle } from 'lucide-react';
import { ValidationResult } from '../aiValidation';

interface ValidationModalProps {
  result: ValidationResult;
  onClose: () => void;
}

const ValidationModal: React.FC<ValidationModalProps> = ({ result, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 text-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <XCircle size={24} />
        </button>

        <h2 className="text-2xl font-bold mb-4">Stack Validation Results</h2>
        
        <div className={`mb-4 p-4 rounded-lg ${
          result.isValid 
            ? 'bg-green-900/50 text-green-200' 
            : 'bg-red-900/50 text-red-200'
        }`}>
          <h3 className="text-xl font-semibold mb-2">
            {result.isValid ? 'Valid Stack' : 'Invalid Stack'}
          </h3>
          <p className="text-lg">{result.message}</p>
        </div>

        {result.details && (
          <div className="mt-4">
            <h3 className="text-xl font-semibold mb-2">Details</h3>
            <div className="bg-gray-700/50 p-4 rounded-lg whitespace-pre-wrap">
              {result.details}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ValidationModal;
