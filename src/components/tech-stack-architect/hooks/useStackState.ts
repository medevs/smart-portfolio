import { useCallback, useState } from 'react';
import { Edge, Node, useNodesState, useEdgesState, Connection } from 'reactflow';
import { TechStack } from '../stackUtils';
import { Technology } from '../techDataFetcher';
import { HistoryManager } from '../historyManager';

export const useStackState = (historyManager: React.MutableRefObject<HistoryManager>) => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [currentStack, setCurrentStack] = useState<TechStack | null>(null);

  const handleUndo = useCallback(() => {
    const prevState = historyManager.current.undo();
    if (prevState) {
      setNodes(prevState.nodes);
      setEdges(prevState.edges);
    }
  }, [setNodes, setEdges, historyManager]);

  const handleRedo = useCallback(() => {
    const nextState = historyManager.current.redo();
    if (nextState) {
      setNodes(nextState.nodes);
      setEdges(nextState.edges);
    }
  }, [setNodes, setEdges, historyManager]);

  const onConnect = useCallback(
    (connection: Connection) => {
      setEdges((eds) => {
        const newEdges = eds.concat(connection as Edge);
        historyManager.current.pushState({ nodes, edges: newEdges });
        return newEdges;
      });
    },
    [setEdges, nodes, historyManager]
  );

  const handleNodeChanges = useCallback(
    (changes: any) => {
      onNodesChange(changes);
      historyManager.current.pushState({ nodes, edges });
    },
    [onNodesChange, nodes, edges, historyManager]
  );

  const handleEdgeChanges = useCallback(
    (changes: any) => {
      onEdgesChange(changes);
      historyManager.current.pushState({ nodes, edges });
    },
    [onEdgesChange, nodes, edges, historyManager]
  );

  return {
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
  };
};
