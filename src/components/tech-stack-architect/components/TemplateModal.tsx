"use client"

import React from 'react';
import { X } from 'lucide-react';
import { stackTemplates, StackTemplate } from '../stackTemplates';

interface TemplateModalProps {
  isOpen: boolean;
  onSelect: (template: StackTemplate) => void;
  onClose: () => void;
}

const TemplateModal: React.FC<TemplateModalProps> = ({
  isOpen,
  onSelect,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100]">
      <div className="bg-gray-800 p-6 rounded-lg max-w-lg w-full max-h-[90vh] overflow-y-auto relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <X size={24} />
        </button>

        <h2 className="text-2xl font-bold mb-6 text-white">Load Template</h2>
        
        <div className="space-y-4">
          {stackTemplates.map((template) => (
            <button
              key={template.name}
              onClick={() => {
                onSelect(template);
                onClose();
              }}
              className="w-full text-left p-4 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors group"
            >
              <h3 className="text-lg font-semibold text-white mb-2">{template.name}</h3>
              <p className="text-sm text-gray-300 group-hover:text-gray-200">{template.description}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TemplateModal;
