"use client"

import React from 'react';
import { XCircle, AlertTriangle, Info, X } from 'lucide-react';

interface ValidationPanelProps {
  validation: {
    isValid: boolean;
    messages: {
      type: 'error' | 'warning' | 'info';
      message: string;
      affectedNodes?: string[];
      affectedEdges?: string[];
    }[];
    score: number;
    metrics: {
      complexity: number;
      maintainability: number;
      scalability: number;
      security: number;
      performance: number;
    };
  };
  onClose: () => void;
  onHighlightEdge?: (edgeId: string) => void;
}

const ValidationPanel = ({ validation, onClose, onHighlightEdge }: ValidationPanelProps) => {
  const getIcon = (type: 'error' | 'warning' | 'info') => {
    switch (type) {
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'info':
        return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  const getMetricColor = (value: number) => {
    if (value >= 8) return 'text-green-500';
    if (value >= 6) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <div className="fixed bottom-4 right-4 w-96 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Stack Validation</h3>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Overall Score */}
      <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
        <div className="text-3xl font-bold mb-1">
          <span className={getMetricColor(validation.score / 10)}>{validation.score}</span>
          <span className="text-sm text-gray-500 dark:text-gray-400">/100</span>
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400">Overall Stack Score</div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 gap-2">
        {Object.entries(validation.metrics).map(([metric, value]) => (
          <div key={metric} className="p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="text-sm text-gray-500 dark:text-gray-400 capitalize">
              {metric}
            </div>
            <div className={`text-lg font-semibold ${getMetricColor(value)}`}>
              {value}/10
            </div>
          </div>
        ))}
      </div>

      {/* Messages */}
      <div className="space-y-2 max-h-60 overflow-y-auto">
        {validation.messages.map((message, index) => (
          <div
            key={index}
            className="flex items-start space-x-2 p-2 bg-gray-50 dark:bg-gray-700 rounded-lg"
          >
            {getIcon(message.type)}
            <div className="flex-1">
              <p className="text-sm text-gray-900 dark:text-gray-100">{message.message}</p>
              {message.affectedEdges && onHighlightEdge && (
                <button
                  onClick={() => message.affectedEdges?.forEach(onHighlightEdge)}
                  className="text-xs text-blue-500 hover:text-blue-600 mt-1"
                >
                  Show affected connections
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ValidationPanel;
