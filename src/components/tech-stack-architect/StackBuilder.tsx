"use client"

import React, { useState, useCallback, useEffect, useRef } from 'react';
import {
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  MarkerType,
  ReactFlowInstance,
  Edge,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { fetchTechData } from './techDataFetcher';
import type { Technology } from './techDataFetcher';
import {
  TechStack,
  saveStack,
  loadStacks,
  deleteStack,
  exportStackAsJson,
  exportStackAsImage,
} from './stackUtils';
import { validateStack, getCompatibilityColor } from './compatibilityUtils';
import { HistoryManager } from './historyManager';
import Sidebar from './components/Sidebar';
import FlowArea from './components/FlowArea';
import Toolbar from './components/Toolbar';
import TechInfo from './TechInfo';
import ValidationPanel from './ValidationPanel';

const generateStackId = () => `stack-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

const StackBuilder = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedCategory, setSelectedCategory] = useState('frontend');
  const [technologies, setTechnologies] = useState<Record<string, Technology[]>>({});
  const [loading, setLoading] = useState(true);
  const [selectedTech, setSelectedTech] = useState<Technology | null>(null);
  const [currentStack, setCurrentStack] = useState<TechStack | null>(null);
  const [savedStacks, setSavedStacks] = useState<TechStack[]>([]);
  const [validation, setValidation] = useState<ReturnType<typeof validateStack> | null>(null);
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);
  
  // Initialize history manager
  const historyManager = useRef(new HistoryManager({ nodes: [], edges: [] }));

  useEffect(() => {
    const loadTechData = async () => {
      const data = await fetchTechData();
      setTechnologies(data);
      setSavedStacks(loadStacks());
      setLoading(false);
    };
    loadTechData();
  }, []);

  const onConnect = useCallback(
    (params: Connection) => {
      const newEdge = {
        ...params,
        type: 'smoothstep',
        animated: true,
        markerEnd: { type: MarkerType.ArrowClosed },
        style: { stroke: '#94a3b8' }
      };
      
      const updatedEdges = addEdge(newEdge, edges);
      setEdges(updatedEdges);
      
      // Update history
      historyManager.current.pushState({ nodes, edges: updatedEdges });
    },
    [edges, nodes, setEdges]
  );

  const handleSaveStack = () => {
    const stackName = prompt('Enter a name for your tech stack:');
    if (!stackName) return;

    const stack: TechStack = {
      id: currentStack?.id || generateStackId(),
      name: stackName,
      nodes,
      edges,
      createdAt: currentStack?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (saveStack(stack)) {
      setCurrentStack(stack);
      setSavedStacks(loadStacks());
    }
  };

  const handleLoadStack = (stack: TechStack) => {
    setNodes(stack.nodes);
    setEdges(stack.edges);
    setCurrentStack(stack);
    historyManager.current = new HistoryManager({ nodes: stack.nodes, edges: stack.edges });
  };

  const handleDeleteStack = (stackId: string) => {
    if (window.confirm('Are you sure you want to delete this stack?')) {
      if (deleteStack(stackId)) {
        setSavedStacks(loadStacks());
        if (currentStack?.id === stackId) {
          setCurrentStack(null);
          setNodes([]);
          setEdges([]);
          historyManager.current = new HistoryManager({ nodes: [], edges: [] });
        }
      }
    }
  };

  const handleExportJson = () => {
    if (!currentStack) return;
    exportStackAsJson(currentStack);
  };

  const handleExportImage = () => {
    if (!reactFlowWrapper.current) return;
    exportStackAsImage(reactFlowWrapper.current);
  };

  const handleUndo = () => {
    const previousState = historyManager.current.undo();
    if (previousState) {
      setNodes(previousState.nodes);
      setEdges(previousState.edges);
    }
  };

  const handleRedo = () => {
    const nextState = historyManager.current.redo();
    if (nextState) {
      setNodes(nextState.nodes);
      setEdges(nextState.edges);
    }
  };

  const handleValidate = () => {
    const result = validateStack(nodes, edges);
    setValidation(result);
  };

  const handleNodeClick = useCallback((event: React.MouseEvent, node: any) => {
    const tech = technologies[node.data.type]?.find(t => t.name === node.data.name);
    if (tech) {
      setSelectedTech(tech);
    }
  }, [technologies]);

  if (loading) {
    return <div className="flex items-center justify-center h-[600px]">Loading technologies...</div>;
  }

  return (
    <div className="flex h-[600px]" ref={reactFlowWrapper}>
      <Sidebar
        technologies={technologies}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        onSaveStack={handleSaveStack}
        onExportJson={handleExportJson}
        onExportImage={handleExportImage}
        savedStacks={savedStacks}
        onLoadStack={handleLoadStack}
        onDeleteStack={handleDeleteStack}
      />
      
      <div className="flex-1 relative">
        <Toolbar
          canUndo={historyManager.current.canUndo()}
          canRedo={historyManager.current.canRedo()}
          onUndo={handleUndo}
          onRedo={handleRedo}
          onValidate={handleValidate}
        />
        
        <FlowArea
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={handleNodeClick}
          onInit={setReactFlowInstance}
        />
      </div>

      {selectedTech && (
        <TechInfo
          tech={selectedTech}
          onClose={() => setSelectedTech(null)}
        />
      )}

      {validation && (
        <ValidationPanel
          validation={validation}
          onClose={() => setValidation(null)}
          onHighlightEdge={(edgeId) => {
            // Implement edge highlighting logic
            console.log('Highlight edge:', edgeId);
          }}
        />
      )}
    </div>
  );
};

export default StackBuilder;
