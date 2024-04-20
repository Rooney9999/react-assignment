import create from 'zustand';

export const useGraphStore = create((set) => ({
  nodes: [],
  edges: [],
  setNodes: (nodes) => set({ nodes }),
  setEdges: (edges) => set({ edges }),
  setEdges: (edges) => set({ edges }),
}));