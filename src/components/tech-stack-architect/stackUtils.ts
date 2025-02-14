import { Node, Edge } from 'reactflow';
import { toPng } from 'html-to-image';

export interface TechStack {
  id: string;
  name: string;
  description?: string;
  nodes: Node[];
  edges: Edge[];
  createdAt: string;
  updatedAt: string;
}

export const saveStack = (stack: TechStack) => {
  try {
    const stacks = loadStacks();
    const existingStackIndex = stacks.findIndex(s => s.id === stack.id);
    
    if (existingStackIndex >= 0) {
      stacks[existingStackIndex] = stack;
    } else {
      stacks.push(stack);
    }
    
    localStorage.setItem('tech-stacks', JSON.stringify(stacks));
    return true;
  } catch (error) {
    console.error('Error saving stack:', error);
    return false;
  }
};

export const loadStacks = (): TechStack[] => {
  try {
    const stacks = localStorage.getItem('tech-stacks');
    return stacks ? JSON.parse(stacks) : [];
  } catch (error) {
    console.error('Error loading stacks:', error);
    return [];
  }
};

export const deleteStack = (stackId: string) => {
  try {
    const stacks = loadStacks();
    const filteredStacks = stacks.filter(s => s.id !== stackId);
    localStorage.setItem('tech-stacks', JSON.stringify(filteredStacks));
    return true;
  } catch (error) {
    console.error('Error deleting stack:', error);
    return false;
  }
};

export const exportStackAsJson = (stack: TechStack) => {
  const dataStr = JSON.stringify(stack, null, 2);
  const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
  
  const link = document.createElement('a');
  link.setAttribute('href', dataUri);
  link.setAttribute('download', `${stack.name.toLowerCase().replace(/\s+/g, '-')}.json`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportStackAsImage = async (reactFlowWrapper: HTMLDivElement) => {
  try {
    const dataUrl = await toPng(reactFlowWrapper, {
      backgroundColor: '#ffffff',
      quality: 1,
      pixelRatio: 2
    });
    
    const link = document.createElement('a');
    link.setAttribute('href', dataUrl);
    link.setAttribute('download', 'tech-stack.png');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error('Error exporting image:', error);
  }
};
