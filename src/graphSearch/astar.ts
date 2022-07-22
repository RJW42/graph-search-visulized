import type {Graph, SearchResult, Node} from "./graph";

const search = (graph: Graph, _heuristic: (n1: number, n2: number, graph: Graph) => number): SearchResult => {
   // Init tracking metrics
   const path = [] as Node[];
   const nodes_visited = [] as Node[];
   const nodes_checked = [] as Node[];

   // Init heruistic
   const heuristic = (n1: number, n2: number) => _heuristic(n1, n2, graph);

   const create_path = (parents: number[]) => {
      path.push(graph.nodes[graph.goal_node]);
      let current = graph.goal_node;
      while (current !== graph.start_node){
         current = parents[current];
         path.push(graph.nodes[current]);
      }
   }

   // Init search lists 
   const open_list = [] as number[];
   const parents = graph.nodes.map(n => -1);
   const node_heuristics = graph.nodes.map(node => {
      return {
         f: Infinity,
         g: 0,
         h: 0
      };
   });

   node_heuristics[graph.start_node].f = 0;
   open_list.push(graph.start_node);

   while(open_list.length !== 0) {
      // Get closest node
      const q = open_list.map(node_id => {
         return {
            id: node_id,
            value: node_heuristics[node_id].f
         }
      }).reduce((best, curr) => {
         return best.value <= curr.value ? best : curr;
      }).id;

      open_list.splice(
         open_list.findIndex((value) => value === q), 1
      ); 
      
      if (q === graph.goal_node){
         create_path(parents);
         break;
      }

      // Track nodes visited
      nodes_visited.push(graph.nodes[q]);
      const edges_checked = [] as Node[];

      for(const edge of graph.edges[q]) {
         edges_checked.push(graph.nodes[edge]);

         // Calc node heuristics
         const g = node_heuristics[q].g + 1;
         const h = heuristic(edge, graph.goal_node);
         const f = g + h;

         if(f >= node_heuristics[edge].f){
            continue;
         }

         node_heuristics[edge] = {
            f: f,
            g: g,
            h: h
         };

         parents[edge] = q;
   
         const in_open_list = open_list.find(n => n === edge) !== undefined;
         
         if(!in_open_list) {
            open_list.push(edge);
         }
      }

      nodes_checked.push(edges_checked);
   };

   return {
      path: path,
      nodes_checked: nodes_checked,
      nodes_vistied: nodes_visited
   }
}

const manhatan_heuristic = (n1: number, n2: number, graph: Graph): number => {
   return (
      Math.abs(graph.nodes[n1].row - graph.nodes[n2].row) + 
      Math.abs(graph.nodes[n1].col - graph.nodes[n2].col)
   );
}

const eclidian_heuristic = (n1: number, n2: number, graph: Graph): number => {
   return Math.sqrt(
      Math.pow(graph.nodes[n1].row - graph.nodes[n2].row, 2) + 
      Math.pow(graph.nodes[n1].col - graph.nodes[n2].col, 2)
   );
}

const search_manhatan = (graph: Graph) => search(graph, manhatan_heuristic);
const search_eclidian = (graph: Graph) => search(graph, eclidian_heuristic);

export {search_manhatan, search_eclidian};