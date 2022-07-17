import type {Graph, SearchResult, Node} from "./graph";


const search = (graph: Graph): SearchResult => {
   // Init search variables
   const nodes_vistied = [];
   const distances = graph.nodes.map(_ => Infinity);
   const previous = graph.nodes.map(_ => undefined) as (Node | undefined)[];
   
   let node_queue = graph.nodes.filter(node => node !== undefined);

   // Init start node 
   distances[graph.start_node] = 0;

   // Perform search
   while (node_queue.length !== 0) {
      // Get closest node in the queue
      const closest_node = node_queue.reduce((current_min, node) => {
         return (distances[current_min.id] < distances[node.id]) ? 
            current_min : node
      }, node_queue[0]);

      // Check if reached end
      if(closest_node.id === graph.goal_node)
         break;

      // Track this node
      nodes_vistied.push(closest_node);

      // Remove closest node from queue 
      node_queue = node_queue.filter(node => node.id !== closest_node.id);

      // Get the distance to all the neighbours of the closest node
      closest_node.edges.filter(node_id => 
         // Check if this neighbour is in the edge list 
         node_queue.find(node => node.id === node_id) !== undefined
      ).forEach(node_id => {
         // Calc distance to this node 
         const dist = distances[closest_node.id] + 1; // Todo: change to weight
         if(dist < distances[node_id] && distances[closest_node.id] !== Infinity) {
            distances[node_id] = dist;
            previous[node_id] = closest_node;
         }
      });
   }

   // Generate path 
   const path = (() => {
      // Check if reached end
      if(!previous[graph.goal_node]) {
         return [];
      }
   
      // Generate path 
      const path = [] as Node[];
      let start_of_path = graph.nodes[graph.goal_node] as Node | undefined;
      while(start_of_path) {
         path.push(start_of_path);
         start_of_path = previous[start_of_path.id];
      }

      return path;
   })();

   return {
      path: path,
      nodes_vistied: nodes_vistied
   };
}


export {search};