import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ReactFlowInstance, ReactFlowProvider } from 'reactflow';
import 'reactflow/dist/style.css';

// Data and Utils
import { fetchTechData } from './techDataFetcher';
import { saveStack, loadStacks, deleteStack, TechStack } from './stackUtils';
import { StackTemplate } from './stackTemplates';
import { HistoryManager } from './historyManager';
import { Technology } from './techDataFetcher';
import { generateStackId } from './utils';

// Components
import Sidebar from './components/Sidebar';
import MainFlow from './components/MainFlow';
import ValidationModal from './components/ValidationModal';
import TemplateModal from './components/TemplateModal';

// Custom Hooks
import { useStackState } from './hooks/useStackState';
import { useStackExport } from './hooks/useStackExport';
import { useStackValidation } from './hooks/useStackValidation';

const StackBuilder: React.FC = () => {
  // Refs
  const historyManager = useRef(new HistoryManager());
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);

  // State
  const [loading, setLoading] = useState(true);
  const [technologies, setTechnologies] = useState<Record<string, Technology[]>>({});
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedTech, setSelectedTech] = useState<Technology | null>(null);
  const [showTemplates, setShowTemplates] = useState(false);
  const [savedStacks, setSavedStacks] = useState<TechStack[]>([]);

  // Custom Hooks
  const {
    nodes,
    edges,
    setNodes,
    setEdges,
    currentStack,
    setCurrentStack,
    handleUndo,
    handleRedo,
    onConnect,
    handleNodeChanges,
    handleEdgeChanges,
  } = useStackState(historyManager);

  const {
    exportStackAsImage,
    handleExportJson,
  } = useStackExport(nodes, edges, currentStack);

  const {
    validationResult,
    showValidationModal,
    setShowValidationModal,
    handleValidateStack,
    isValidating,
  } = useStackValidation(nodes, edges);

  // Load initial data
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [techData, stacks] = await Promise.all([
          fetchTechData(),
          loadStacks(),
        ]);
        setTechnologies(techData);
        setSavedStacks(stacks);
        setSelectedCategory(Object.keys(techData)[0]);
        setLoading(false);
      } catch (error) {
        console.error('Error loading initial data:', error);
        setLoading(false);
      }
    };
    loadInitialData();
  }, []);

  // Stack Management
  const handleSaveStack = useCallback(async (name: string) => {
    if (!nodes.length) return;

    const stack: TechStack = currentStack ?? {
      id: generateStackId(),
      name,
      nodes,
      edges,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updatedStack: TechStack = {
      ...stack,
      name,
      nodes,
      edges,
      updatedAt: new Date().toISOString(),
    };

    try {
      await saveStack(updatedStack);
      const stacks = await loadStacks();
      setSavedStacks(stacks);
      setCurrentStack(updatedStack);
    } catch (error) {
      console.error('Error saving stack:', error);
    }
  }, [nodes, edges, currentStack, setCurrentStack]);

  const handleDeleteStack = useCallback(async (id: string) => {
    await deleteStack(id);
    const stacks = await loadStacks();
    setSavedStacks(stacks);
    if (currentStack?.id === id) {
      setCurrentStack(null);
    }
  }, [currentStack, setCurrentStack]);

  const handleLoadStack = useCallback((stack: TechStack) => {
    setNodes(stack.nodes);
    setEdges(stack.edges);
    setCurrentStack(stack);
    historyManager.current.clear();
    historyManager.current.pushState({ nodes: stack.nodes, edges: stack.edges });
  }, [setNodes, setEdges, setCurrentStack]);

  const handleTemplateSelect = useCallback((template: StackTemplate) => {
    const newStack: TechStack = {
      id: generateStackId(),
      name: template.name,
      nodes: template.nodes,
      edges: template.edges,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setNodes(newStack.nodes);
    setEdges(newStack.edges);
    setShowTemplates(false);
    historyManager.current.clear();
    historyManager.current.pushState({ nodes: newStack.nodes, edges: newStack.edges });
  }, [setNodes, setEdges]);

  const handleExportImage = useCallback(() => {
    if (reactFlowWrapper.current) {
      // Get the ReactFlow viewport element
      const flowElement = reactFlowWrapper.current.querySelector('.react-flow__viewport');
      if (flowElement) {
        exportStackAsImage(flowElement as HTMLElement);
      }
    }
  }, [exportStackAsImage]);

  if (loading) {
    return <div className="flex items-center justify-center h-[600px]">Loading technologies...</div>;
  }

  return (
    <div className="h-[calc(80vh-8rem)] flex flex-col bg-gray-900 mx-auto rounded-lg shadow-xl w-full">
      <ReactFlowProvider>
        <div className="flex-1 flex" ref={reactFlowWrapper}>
          <Sidebar
            technologies={technologies}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            savedStacks={savedStacks}
            onLoadStack={handleLoadStack}
            onDeleteStack={handleDeleteStack}
          />

          <MainFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={handleNodeChanges}
            onEdgesChange={handleEdgeChanges}
            onConnect={onConnect}
            canUndo={historyManager.current.canUndo()}
            canRedo={historyManager.current.canRedo()}
            onUndo={handleUndo}
            onRedo={handleRedo}
            onShowTemplates={() => setShowTemplates(true)}
            onInit={setReactFlowInstance}
            selectedTech={selectedTech}
            onTechSelect={setSelectedTech}
            onSaveStack={handleSaveStack}
            onExportJson={handleExportJson}
            onExportImage={handleExportImage}
            onValidateStack={handleValidateStack}
            isValidating={isValidating}
          />
        </div>
      </ReactFlowProvider>
      {showValidationModal && validationResult && (
        <ValidationModal
          result={validationResult}
          onClose={() => setShowValidationModal(false)}
        />
      )}

      {showTemplates && (
        <TemplateModal
          isOpen={showTemplates}
          onSelect={handleTemplateSelect}
          onClose={() => setShowTemplates(false)}
        />
      )}
    </div>
  );
};

export default StackBuilder;
