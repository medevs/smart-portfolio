import React from 'react';
import { X, CheckCircle, AlertCircle, ChevronRight, Zap, Shield, BarChart2, DollarSign, BookOpen, Users } from 'lucide-react';
import { ValidationResult } from '../aiValidation';

interface ValidationModalProps {
  result: ValidationResult;
  onClose: () => void;
}

const ScoreGauge: React.FC<{ score: number; label: string }> = ({ score, label }) => (
  <div className="flex flex-col items-center">
    <div className="relative w-16 h-16">
      <svg className="w-16 h-16 transform -rotate-90">
        <circle
          className="text-gray-700"
          strokeWidth="8"
          stroke="currentColor"
          fill="transparent"
          r="28"
          cx="32"
          cy="32"
        />
        <circle
          className={`${score >= 70 ? 'text-green-500' : score >= 40 ? 'text-yellow-500' : 'text-red-500'}`}
          strokeWidth="8"
          strokeDasharray={`${score * 1.76} 176`}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r="28"
          cx="32"
          cy="32"
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-sm font-semibold">
        {score}
      </span>
    </div>
    <span className="text-xs mt-1 text-gray-400">{label}</span>
  </div>
);

const ValidationModal: React.FC<ValidationModalProps> = ({ result, onClose }) => {
  const scores = result.scores || {
    overall: result.overall_score || 0,
    performance: 0,
    scalability: 0,
    maintainability: 0,
    security: 0,
    cost_efficiency: 0
  };

  const analysis = result.analysis || {
    strengths: [],
    weaknesses: [],
    opportunities: [],
    risks: [],
    performance_impact: '',
    scalability_assessment: '',
    security_considerations: '',
    cost_efficiency: '',
    learning_curve: '',
    community_support: ''
  };

  const compatibility = result.compatibility_matrix || {
    compatible_pairs: [],
    incompatible_pairs: [],
    suggestions: []
  };

  const recommendations = result.recommendations || {
    immediate_actions: [],
    future_considerations: [],
    alternative_technologies: []
  };

  return (
    <div className="fixed inset-0 bg-black/60 dark:bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto relative shadow-lg border border-gray-200 dark:border-gray-800">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
        >
          <X size={24} />
        </button>

        {/* Header */}
        <div className="flex items-start mb-6">
          {result.isValid !== undefined ? (
            result.isValid ? (
              <CheckCircle className="text-green-600 dark:text-green-500 mr-3 mt-1" size={24} />
            ) : (
              <AlertCircle className="text-yellow-600 dark:text-yellow-500 mr-3 mt-1" size={24} />
            )
          ) : null}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {result.isValid !== undefined ? (result.isValid ? 'Valid Stack' : 'Stack Needs Review') : ''}
            </h2>
            <p className="text-gray-700 dark:text-gray-200 mt-1 font-medium">{result.message || ''}</p>
          </div>
        </div>

        {/* Score Overview */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          <ScoreGauge score={scores.overall} label="Overall" />
          <ScoreGauge score={scores.performance} label="Performance" />
          <ScoreGauge score={scores.scalability} label="Scalability" />
          <ScoreGauge score={scores.maintainability} label="Maintainability" />
          <ScoreGauge score={scores.security} label="Security" />
          <ScoreGauge score={scores.cost_efficiency} label="Cost Efficiency" />
        </div>

        {/* Analysis Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="space-y-6">
            {/* Strengths & Weaknesses */}
            <div className="bg-gray-50 dark:bg-gray-800/90 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold mb-3 flex items-center text-gray-900 dark:text-white">
                <Zap className="mr-2 text-green-500" size={20} />
                Key Analysis
              </h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-green-600 dark:text-green-400 mb-2">Strengths</h4>
                  <ul className="list-disc list-inside space-y-1">
                    {analysis.strengths.map((strength, index) => (
                      <li key={index} className="text-gray-700 dark:text-gray-200">{strength}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-red-600 dark:text-red-400 mb-2">Areas for Improvement</h4>
                  <ul className="list-disc list-inside space-y-1">
                    {analysis.weaknesses.map((weakness, index) => (
                      <li key={index} className="text-gray-700 dark:text-gray-200">{weakness}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Compatibility */}
            <div className="bg-gray-50 dark:bg-gray-800/90 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold mb-3 flex items-center text-gray-900 dark:text-white">
                <Shield className="mr-2 text-blue-500" size={20} />
                Compatibility Analysis
              </h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-blue-600 dark:text-blue-400 mb-2">Compatible Combinations</h4>
                  <ul className="list-disc list-inside space-y-1">
                    {compatibility.compatible_pairs.map((pair, index) => (
                      <li key={index} className="text-gray-700 dark:text-gray-200">{pair}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-yellow-600 dark:text-yellow-400 mb-2">Potential Issues</h4>
                  <ul className="list-disc list-inside space-y-1">
                    {compatibility.incompatible_pairs.map((pair, index) => (
                      <li key={index} className="text-gray-700 dark:text-gray-200">{pair}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {/* Technical Assessment */}
            <div className="bg-gray-50 dark:bg-gray-800/90 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold mb-3 flex items-center text-gray-900 dark:text-white">
                <BarChart2 className="mr-2 text-purple-500" size={20} />
                Technical Assessment
              </h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-medium text-purple-600 dark:text-purple-400">Performance Impact</h4>
                  <p className="text-gray-700 dark:text-gray-200">{analysis.performance_impact}</p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium text-purple-600 dark:text-purple-400">Scalability</h4>
                  <p className="text-gray-700 dark:text-gray-200">{analysis.scalability_assessment}</p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium text-purple-600 dark:text-purple-400">Security</h4>
                  <p className="text-gray-700 dark:text-gray-200">{analysis.security_considerations}</p>
                </div>
              </div>
            </div>

            {/* Business Impact */}
            <div className="bg-gray-50 dark:bg-gray-800/90 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold mb-3 flex items-center text-gray-900 dark:text-white">
                <DollarSign className="mr-2 text-yellow-500" size={20} />
                Business Impact
              </h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-medium text-yellow-600 dark:text-yellow-400">Cost Efficiency</h4>
                  <p className="text-gray-700 dark:text-gray-200">{analysis.cost_efficiency}</p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium text-yellow-600 dark:text-yellow-400">Learning Curve</h4>
                  <p className="text-gray-700 dark:text-gray-200">{analysis.learning_curve}</p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium text-yellow-600 dark:text-yellow-400">Community Support</h4>
                  <p className="text-gray-700 dark:text-gray-200">{analysis.community_support}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recommendations */}
        <div className="bg-gray-50 dark:bg-gray-800/90 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold mb-3 flex items-center text-gray-900 dark:text-white">
            <BookOpen className="mr-2 text-indigo-500" size={20} />
            Recommendations
          </h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <h4 className="font-medium text-indigo-600 dark:text-indigo-400 mb-2">Immediate Actions</h4>
              <ul className="list-disc list-inside space-y-1">
                {recommendations.immediate_actions.map((action, index) => (
                  <li key={index} className="text-gray-700 dark:text-gray-200">{action}</li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-indigo-600 dark:text-indigo-400 mb-2">Future Considerations</h4>
              <ul className="list-disc list-inside space-y-1">
                {recommendations.future_considerations.map((consideration, index) => (
                  <li key={index} className="text-gray-700 dark:text-gray-200">{consideration}</li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-indigo-600 dark:text-indigo-400 mb-2">Alternative Technologies</h4>
              <ul className="list-disc list-inside space-y-1">
                {recommendations.alternative_technologies.map((tech, index) => (
                  <li key={index} className="text-gray-700 dark:text-gray-200">{tech}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ValidationModal;
