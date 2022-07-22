<script lang="ts">
   import type { GridElementType } from "./tools";
   import type { Node, SearchResult } from "../graphSearch/graph";

   import { init_grid_state } from "./tools";
   import { search } from "../graphSearch/dijkstra";
   import { create_graph } from "../graphSearch/graph";
   import { notifications } from "./notifications";

   import ToolSelector from "./ToolSelector.svelte";
   import GridDisplay from "./GridDisplay.svelte";
   import Toast from "./Toast.svelte";

   // Props
	export let rows: number;
	export let cols: number;

   type Pair = {
      r: number;
      c: number;
   }

   // State 
   let active_value: string | undefined;
   let values: string[] = ["start", "end", "wall", "air"];
   let grid_state: GridElementType[][] = init_grid_state(rows, cols);
   let search_results: SearchResult | undefined;

   let mouse_value = "up";
   let active_element: GridElementType | undefined;
   let start_element: GridElementType | undefined;
   let end_element: GridElementType | undefined;

   let clear_timeout: NodeJS.Timeout | undefined;

   const perform_action = (action: string, element?: any) => {
      if(action === "mouse_up") {
         mouse_value = "up";
         if(!active_element || !active_value)
            return;
         place_element();
      } else if(action === "mouse_down") {
         mouse_value = "down";
      } else if(action === "enter") {
         active_element = element;
         if(mouse_value !== "down" || !active_value)
            return;
         place_element();
      } else if(action === "leave") {
         active_element = undefined;
      } else if(action === "reset") {
         search_results = undefined;
         start_element = undefined;
         end_element = undefined;
         active_value = undefined;

         const reset_timeout = (curr: Pair) => {
            grid_state[curr.r][curr.c].value = "air";
            grid_state[curr.r][curr.c].selected = false;
            grid_state = grid_state;

            if(curr.r >= rows - 1 && curr.c >= cols - 1) { 
               clear_timeout = undefined;
               return;
            }
            
            const next = {
               r: curr.c >= cols - 1 ? curr.r + 1 : curr.r,
               c: curr.c >= cols - 1 ? 0 : curr.c + 1
            }

            grid_state[next.r][next.c].selected = true;
            grid_state = grid_state;

            clear_timeout = setTimeout(() => reset_timeout(next), 20);
         }

         reset_timeout({r: 0, c: 0});
      } else if(action === "search") {
         if(!start_element || !end_element){   
            notifications.danger('Start and End required for search', 1000);
            return;
         }

         active_value = undefined;
         search_results = undefined;
         setTimeout(() => {
            search_results = search(create_graph(grid_state, rows, cols));
         }, 10);
         
         if(!clear_timeout)
            return;
         clearTimeout(clear_timeout);
         clear_timeout = undefined;
         grid_state = init_grid_state(rows, cols);
      } else if(action === "set_value") {
         active_value = element as string;   
         search_results = undefined;
         
         if(!clear_timeout)
            return;
         clearTimeout(clear_timeout);
         clear_timeout = undefined;
         grid_state = init_grid_state(rows, cols);
      }
   };

   const place_element = () => {
      if(active_value === "start") {
         if(start_element) {
            start_element.value = "air";
            grid_state[start_element.row][start_element.col] = start_element;
         }
         start_element = active_element;
      } else if(active_value === "end") {
         if(end_element) {
            end_element.value = "air";
            grid_state[end_element.row][end_element.col] = end_element;
         }
         end_element = active_element;
      } else if(active_element === start_element){
         start_element = undefined;
      } else if(active_element === end_element){
         end_element = undefined;
      }


      active_element.value = active_value;
      grid_state[active_element.row][active_element.col] = active_element;
   }
</script>

<div class="container">
   <GridDisplay 
      grid_state={grid_state}
      search_results={search_results}
      on:action={(event) => perform_action(event.detail.type, event.detail.props)}
   />

   <ToolSelector
      tile_values={values}
      active_value={active_value}
      actions={["reset", "search"]}
      search_algorithms={["dijkstra, astar"]}
      current_algorithm="dijkstra"
      enable_actions={true}
      on:set_active={(event) => perform_action("set_value", event.detail.value)}
      on:perform_action={(event) => perform_action(event.detail.action)}
   />
</div>
<Toast />

<style>
	div {
		display: flex;
	}

	.container {
		flex-direction: column;
      width: fit-content;
	}
</style>