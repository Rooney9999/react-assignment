export const nodes = [
  {
    id: "1",
    type: "input",
    data: {
      label: "start node",
    },
    position: { x: 250, y: 0 },
    style: {
      color: "black",
      border: "1px solid #0000FF",
      borderRadius: "8px",
      width: 180,
    },
  },
 

 
];

export const edges = [
  { id: "e1-2", source: "1", target: "2", type: "smoothstep", style: { stroke: 'grey', strokeWidth: 2 }, animated: true },
  { id: "e1-3", source: "1", target: "3", type: "smoothstep", style: { stroke: 'grey', strokeWidth: 2 }, animated: true },
  { id: "e1-4", source: "1", target: "4", type: "smoothstep", style: { stroke: 'grey', strokeWidth: 2 }, animated: true }, // New edge definition
];