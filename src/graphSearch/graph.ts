import {GridElementType} from "../grid/tools";


type Graph = {
   nodes: Node[];
   edges: number[][];
   start_node: number;
   goal_node: number;
}

type Node = {
   id: number;
   row: number;
   col: number;
   edges: number[];
}


const get_node_id = (row: number, col: number, rows: number, cols: number): number => {
   if(rows > cols) return row * cols + col;
   return col * rows + row;
}


const get_row_col_from_id = (id: number, rows: number, cols: number): {row: number, col: number} => {
   if(rows > cols) return {
      row: Math.floor(id / cols),
      col: id % cols
   };
   return {
      row: id % rows,
      col: Math.floor(id / rows)
   };
}


const create_graph = (grid: GridElementType[][], rows: number, cols: number): Graph => {
   // Init variables
   const partial_nodes = Array(rows * cols).map((id) => {
      const rc = get_row_col_from_id(id, rows, cols);
      return {
         id: id,
         row: rc.row,
         col: rc.col
      };
   });
   
   const edges = Array(rows * cols).map((id) => {
      const node = partial_nodes[id];
      const offsetes = [[0, 1], [0, -1], [1, 0], [-1, 0]];
      
      return offsetes.reduce((edges, [x_offset, y_offset]) => {
         // Convert offsets to positions and remove invalid ones
         const x = node.row + x_offset;
         const y = node.col + y_offset;

         // If position valid get node
         if(x >= 0 && y >= 0 && x < rows && y < cols)
            edges.push(get_node_id(x, y, rows, cols));

         return edges;
      }, [] as number[]);
   });


   // Add the edges to partial nodes
   const nodes = partial_nodes.map((node) => {
      return {
         ...node,
         edges: edges[node.id]
      } as Node;
   });

   // Get start and end then finish
   const start_node = nodes.find(node => {
      return grid[node.row][node.col].value === "start"
   });

   const goal_node = nodes.find(node => {
      return grid[node.row][node.col].value === "end"
   });

   if(!start_node || !goal_node)
      throw Error; // Todo: change this maybe 

   return {
      nodes: nodes,
      edges: edges,
      start_node: start_node.id,
      goal_node: goal_node.id
   };
}


export type {Graph, Node};
export {get_node_id, get_row_col_from_id, create_graph};

