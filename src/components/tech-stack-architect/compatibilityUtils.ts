import { Node, Edge } from 'reactflow';
import { Technology } from './techDataFetcher';

interface ValidationMessage {
  type: 'error' | 'warning' | 'info';
  message: string;
  affectedNodes?: string[];
  affectedEdges?: string[];
}

interface ValidationResult {
  isValid: boolean;
  messages: ValidationMessage[];
  score: number; // Overall stack score out of 100
  metrics: {
    complexity: number; // 1-10
    maintainability: number; // 1-10
    scalability: number; // 1-10
    security: number; // 1-10
    performance: number; // 1-10
  };
}

interface TechCompatibility {
  [key: string]: {
    compatibleWith: string[];
    alternatives: string[];
    bestPractices: string[];
    commonIssues: string[];
  };
}

// Define technology compatibility rules
const techCompatibility: TechCompatibility = {
  'React': {
    compatibleWith: ['Next.js', 'Redux', 'TypeScript', 'Node.js', 'Express', 'MongoDB', 'PostgreSQL'],
    alternatives: ['Vue.js', 'Angular', 'Svelte'],
    bestPractices: ['Use TypeScript for type safety', 'Implement state management for large apps'],
    commonIssues: ['Prop drilling in large applications', 'Performance issues with unnecessary re-renders']
  },
  'Node.js': {
    compatibleWith: ['Express', 'MongoDB', 'PostgreSQL', 'React', 'Vue.js', 'Angular'],
    alternatives: ['Deno', 'Python', 'Java'],
    bestPractices: ['Use async/await for asynchronous operations', 'Implement proper error handling'],
    commonIssues: ['Callback hell', 'Memory leaks in long-running processes']
  },
  'MongoDB': {
    compatibleWith: ['Node.js', 'Express', 'Mongoose', 'React', 'Vue.js', 'Angular'],
    alternatives: ['PostgreSQL', 'MySQL', 'Redis'],
    bestPractices: ['Use indexes for frequent queries', 'Implement proper data validation'],
    commonIssues: ['No built-in joins', 'Schema design complexity']
  },
  // Add more technology compatibility rules as needed
};

export const validateStack = (nodes: Node[], edges: Edge[]): ValidationResult => {
  const messages: ValidationMessage[] = [];
  let complexity = 0;
  let maintainability = 0;
  let scalability = 0;
  let security = 0;
  let performance = 0;

  // Check for isolated nodes
  const connectedNodes = new Set<string>();
  edges.forEach(edge => {
    connectedNodes.add(edge.source);
    connectedNodes.add(edge.target);
  });

  nodes.forEach(node => {
    if (!connectedNodes.has(node.id)) {
      messages.push({
        type: 'error',
        message: `${node.data.name} is isolated. Connect it to other technologies.`,
        affectedNodes: [node.id]
      });
    }
  });

  // Check technology compatibility
  edges.forEach(edge => {
    const sourceNode = nodes.find(n => n.id === edge.source);
    const targetNode = nodes.find(n => n.id === edge.target);
    
    if (sourceNode && targetNode) {
      const sourceTech = techCompatibility[sourceNode.data.name];
      if (sourceTech) {
        if (!sourceTech.compatibleWith.includes(targetNode.data.name)) {
          messages.push({
            type: 'warning',
            message: `${sourceNode.data.name} might have compatibility issues with ${targetNode.data.name}. Consider alternatives: ${sourceTech.alternatives.join(', ')}`,
            affectedEdges: [edge.id]
          });
        } else {
          messages.push({
            type: 'info',
            message: `Best practices for ${sourceNode.data.name}: ${sourceTech.bestPractices.join(', ')}`,
            affectedNodes: [sourceNode.id]
          });
        }
      }
    }
  });

  // Calculate stack metrics
  const calculateComplexity = () => {
    // Based on number of nodes and connections
    const nodeComplexity = Math.min(nodes.length / 5, 10);
    const edgeComplexity = Math.min(edges.length / 8, 10);
    return Math.round((nodeComplexity + edgeComplexity) / 2);
  };

  const calculateMaintainability = () => {
    // Based on technology compatibility and isolation
    const compatibilityScore = edges.length > 0 ? 
      edges.filter(edge => {
        const source = nodes.find(n => n.id === edge.source)?.data.name;
        const target = nodes.find(n => n.id === edge.target)?.data.name;
        return techCompatibility[source]?.compatibleWith.includes(target);
      }).length / edges.length * 10 : 0;
    
    return Math.round(compatibilityScore);
  };

  const calculateScalability = () => {
    // Based on technology choices and architecture patterns
    let score = 10;
    const hasDatabase = nodes.some(n => ['MongoDB', 'PostgreSQL', 'MySQL'].includes(n.data.name));
    const hasBackend = nodes.some(n => ['Node.js', 'Python', 'Java'].includes(n.data.name));
    const hasFrontend = nodes.some(n => ['React', 'Vue.js', 'Angular'].includes(n.data.name));
    
    if (!hasDatabase) score -= 3;
    if (!hasBackend) score -= 3;
    if (!hasFrontend) score -= 3;
    
    return Math.max(score, 1);
  };

  const calculateSecurity = () => {
    // Based on known security features of chosen technologies
    let score = 10;
    const hasAuthentication = nodes.some(n => ['Auth0', 'Firebase Auth', 'JWT'].includes(n.data.name));
    const hasHTTPS = nodes.some(n => n.data.name.includes('HTTPS'));
    const hasEncryption = nodes.some(n => ['SSL', 'TLS'].includes(n.data.name));
    
    if (!hasAuthentication) {
      score -= 3;
      messages.push({
        type: 'warning',
        message: 'Consider adding authentication to improve security'
      });
    }
    if (!hasHTTPS) score -= 2;
    if (!hasEncryption) score -= 2;
    
    return Math.max(score, 1);
  };

  const calculatePerformance = () => {
    // Based on technology performance characteristics
    let score = 10;
    const hasCaching = nodes.some(n => ['Redis', 'Memcached'].includes(n.data.name));
    const hasLoadBalancing = nodes.some(n => ['Nginx', 'HAProxy'].includes(n.data.name));
    
    if (!hasCaching) {
      score -= 2;
      messages.push({
        type: 'info',
        message: 'Consider adding caching to improve performance'
      });
    }
    if (!hasLoadBalancing && nodes.length > 5) {
      score -= 2;
      messages.push({
        type: 'info',
        message: 'Consider adding load balancing for better scalability'
      });
    }
    
    return Math.max(score, 1);
  };

  // Calculate metrics
  complexity = calculateComplexity();
  maintainability = calculateMaintainability();
  scalability = calculateScalability();
  security = calculateSecurity();
  performance = calculatePerformance();

  // Calculate overall score
  const score = Math.round(
    (maintainability * 0.25 +
    scalability * 0.25 +
    security * 0.2 +
    performance * 0.2 +
    (10 - complexity) * 0.1) * 10
  );

  // Add architecture pattern recommendations
  if (nodes.length >= 3) {
    const hasFrontend = nodes.some(n => ['React', 'Vue.js', 'Angular'].includes(n.data.name));
    const hasBackend = nodes.some(n => ['Node.js', 'Python', 'Java'].includes(n.data.name));
    const hasDatabase = nodes.some(n => ['MongoDB', 'PostgreSQL', 'MySQL'].includes(n.data.name));

    if (hasFrontend && hasBackend && hasDatabase) {
      messages.push({
        type: 'info',
        message: 'Your stack follows a typical three-tier architecture pattern. Consider adding a caching layer for better performance.'
      });
    }
  }

  return {
    isValid: messages.filter(m => m.type === 'error').length === 0,
    messages,
    score,
    metrics: {
      complexity,
      maintainability,
      scalability,
      security,
      performance
    }
  };
};

export const getCompatibilityColor = (source: string, target: string): string => {
  if (techCompatibility[source]?.compatibleWith.includes(target)) {
    return '#22c55e'; // green
  }
  return '#94a3b8'; // gray
};
