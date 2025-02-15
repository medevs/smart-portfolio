import { Node, Edge } from 'reactflow';

export interface HistoryState {
  nodes: Node[];
  edges: Edge[];
}

export class HistoryManager {
  private past: HistoryState[] = [];
  private future: HistoryState[] = [];
  private current: HistoryState;
  private maxHistory: number;

  constructor(initialState: HistoryState = { nodes: [], edges: [] }, maxHistory: number = 50) {
    this.current = initialState;
    this.maxHistory = maxHistory;
  }

  public pushState(state: HistoryState) {
    this.past.push({ ...this.current });
    this.current = { ...state };
    this.future = [];

    // Limit history size
    if (this.past.length > this.maxHistory) {
      this.past.shift();
    }
  }

  public undo(): HistoryState | null {
    if (this.past.length === 0) return null;

    const previousState = this.past.pop()!;
    this.future.push({ ...this.current });
    this.current = previousState;
    return previousState;
  }

  public redo(): HistoryState | null {
    if (this.future.length === 0) return null;

    const nextState = this.future.pop()!;
    this.past.push({ ...this.current });
    this.current = nextState;
    return nextState;
  }

  public clear() {
    this.past = [];
    this.future = [];
    this.current = { nodes: [], edges: [] };
  }

  public canUndo(): boolean {
    return this.past.length > 0;
  }

  public canRedo(): boolean {
    return this.future.length > 0;
  }

  public getCurrentState(): HistoryState {
    return { ...this.current };
  }
}
