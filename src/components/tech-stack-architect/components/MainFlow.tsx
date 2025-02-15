import React, { useCallback, useRef } from 'react';
import { Node, Edge, ReactFlowInstance } from 'reactflow';
import FlowArea from './FlowArea';
import FlowControls from './FlowControls';
import { Technology } from '../techDataFetcher';
import TechInfo from './../TechInfo';

interface MainFlowProps {
  nodes: Node[];
  edges: Edge[];
  onNodesChange: (changes: any) => void;
  onEdgesChange: (changes: any) => void;
  onConnect: (connection: any) => void;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  onShowTemplates: () => void;
  onInit: (instance: ReactFlowInstance) => void;
  selectedTech: Technology | null;
  onTechSelect: (tech: Technology | null) => void;
  onSaveStack: (name: string) => void;
  onExportJson: () => void;
  onExportImage: () => void;
  onValidateStack: () => void;
  isValidating: boolean;
}

const MainFlow: React.FC<MainFlowProps> = ({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onConnect,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  onShowTemplates,
  onInit,
  selectedTech,
  onTechSelect,
  onSaveStack,
  onExportJson,
  onExportImage,
  onValidateStack,
  isValidating,
}) => {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);

  const handleNodeClick = useCallback(
    (event: React.MouseEvent, node: any) => {
      const tech = node.data;
      if (tech) {
        onTechSelect(tech);
      }
    },
    [onTechSelect]
  );

  return (
    <div className="flex-1 relative" ref={reactFlowWrapper}>
      <FlowControls
        canUndo={canUndo}
        canRedo={canRedo}
        onUndo={onUndo}
        onRedo={onRedo}
        onShowTemplates={onShowTemplates}
        onSaveStack={onSaveStack}
        onExportJson={onExportJson}
        onExportImage={onExportImage}
        onValidateStack={onValidateStack}
        isValidating={isValidating}
      />

      <div style={{ width: '100%', height: '100%' }}>
        <FlowArea
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={handleNodeClick}
          onInit={onInit}
          onUndo={onUndo}
          onRedo={onRedo}
        />
      </div>

      {selectedTech && (
        <TechInfo
          tech={selectedTech}
          onClose={() => onTechSelect(null)}
        />
      )}
    </div>
  );
};

export default MainFlow;
