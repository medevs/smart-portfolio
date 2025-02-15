"use client"

import React, { useCallback, useEffect, useState } from 'react';
import ReactFlow, {
  Node,
  Edge,
  Controls,
  Background,
  Connection,
  ReactFlowInstance,
  useKeyPress,
  Panel,
} from 'reactflow';
import 'reactflow/dist/style.css';
import TechNode from '../TechNode';
import ShortcutsHelp from '../components/ShortcutsHelp';
import { getCompatibilityColor } from '../compatibilityUtils';

interface FlowAreaProps {
  nodes: Node[];
  edges: Edge[];
  onNodesChange: (changes: any) => void;
  onEdgesChange: (changes: any) => void;
  onConnect: (connection: Connection) => void;
  onNodeClick: (event: React.MouseEvent, node: Node) => void;
  onInit: (instance: ReactFlowInstance) => void;
  onUndo?: () => void;
  onRedo?: () => void;
}

const nodeTypes = {
  techNode: TechNode,
};

const FlowArea = ({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onConnect,
  onNodeClick,
  onInit,
  onUndo,
  onRedo,
}: FlowAreaProps) => {
  const [showShortcuts, setShowShortcuts] = useState(false);
  const deletePressed = useKeyPress('Delete');
  const backspacePressed = useKeyPress('Backspace');
  const ctrlPressed = useKeyPress('Control');
  const zPressed = useKeyPress('z');
  const yPressed = useKeyPress('y');

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      // Undo: Ctrl + Z
      if (event.ctrlKey && event.key.toLowerCase() === 'z') {
        event.preventDefault();
        onUndo?.();
      }
      // Redo: Ctrl + Y
      if (event.ctrlKey && event.key.toLowerCase() === 'y') {
        event.preventDefault();
        onRedo?.();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [onUndo, onRedo]);

  // Handle node deletion with keyboard
  useEffect(() => {
    if (deletePressed || backspacePressed) {
      const selectedNodes = nodes.filter(node => node.selected);
      if (selectedNodes.length > 0) {
        const nodesToDelete = selectedNodes.map(node => ({
          type: 'remove',
          id: node.id,
        }));
        onNodesChange(nodesToDelete);
      }
    }
  }, [deletePressed, backspacePressed, nodes, onNodesChange]);

  const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow');
      const name = event.dataTransfer.getData('application/techname');
      const icon = event.dataTransfer.getData('application/techicon');
      const tech = event.dataTransfer.getData('application/tech');

      if (!type) return;

      const bounds = event.currentTarget.getBoundingClientRect();
      const position = {
        x: event.clientX - bounds.left - 75,
        y: event.clientY - bounds.top - 25,
      };

      const newNode: Node = {
        id: `${type}-${nodes.length + 1}`,
        type: 'techNode',
        position,
        data: { 
          name, 
          icon, 
          type, 
          tech: tech ? JSON.parse(tech) : null 
        },
      };

      onNodesChange([{ type: 'add', item: newNode }]);
    },
    [nodes.length, onNodesChange]
  );

  const onNodeContextMenu = useCallback(
    (event: React.MouseEvent, node: Node) => {
      event.preventDefault();
      onNodesChange([{ type: 'remove', id: node.id }]);
    },
    [onNodesChange]
  );

  return (
    <div className="flex-1 h-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDragOver={onDragOver}
        onDrop={onDrop}
        onNodeClick={onNodeClick}
        onNodeContextMenu={onNodeContextMenu}
        nodeTypes={nodeTypes}
        onInit={onInit}
        fitView
        deleteKeyCode={['Delete', 'Backspace']}
        className="bg-gray-50 dark:bg-gray-900"
      >
        <Background color="#94a3b8" gap={16} />
        <Controls />
        <Panel position="top-left" className="bg-white dark:bg-gray-800 p-2 rounded shadow-lg">
          <button 
            onClick={() => setShowShortcuts(true)}
            className="text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
          >
            ⌨️ Keyboard Shortcuts
          </button>
        </Panel>
      </ReactFlow>
      <ShortcutsHelp isOpen={showShortcuts} onClose={() => setShowShortcuts(false)} />
    </div>
  );
};

export default FlowArea;
