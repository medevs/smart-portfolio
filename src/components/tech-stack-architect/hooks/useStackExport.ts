import { useCallback } from 'react';
import { Node, Edge } from 'reactflow';
import { toPng } from 'html-to-image';
import { TechStack } from '../stackUtils';
import { generateStackId } from '../utils';

export const useStackExport = (nodes: Node[], edges: Edge[], currentStack: TechStack | null) => {
  const exportStackAsJson = useCallback((stack: TechStack) => {
    const jsonString = JSON.stringify(stack, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${stack.name.toLowerCase().replace(/\s+/g, '-')}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, []);

  const exportStackAsImage = useCallback(async (element: HTMLElement | null) => {
    if (!element) return;
    
    try {
      const dataUrl = await toPng(element, {
        backgroundColor: '#1a1a1a',
        width: element.clientWidth,
        height: element.clientHeight,
      });
      
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = 'tech-stack.png';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error exporting image:', error);
    }
  }, []);

  const handleExportJson = useCallback(() => {
    const stackToExport: TechStack = currentStack ?? {
      id: generateStackId(),
      name: 'Untitled Stack',
      nodes,
      edges,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    exportStackAsJson(stackToExport);
  }, [nodes, edges, currentStack, exportStackAsJson]);

  return {
    exportStackAsJson,
    exportStackAsImage,
    handleExportJson,
  };
};
