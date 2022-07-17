<script lang="ts">
   import type { GridElementType } from "./tools";
   import { get_node_id, Node, SearchResult } from "../graphSearch/graph";
   import { createEventDispatcher } from "svelte";

   import GridElement from "./GridElement.svelte";

   // Props
   export let grid_state: GridElementType[][];
   export let search_results: SearchResult | undefined;
   let prev_search_results;

   const rows = grid_state.length;
   const cols = grid_state[0].length;
   const enable_edit = true;
   const dispatch = createEventDispatcher();

   const path_timeout_time = 100;
   const visited_timneout_time = 20;

   let path_set = new Set([] as number[]);
   let visited_set = new Set([] as number[]);
   let timeout: undefined | NodeJS.Timeout;

   const update_path = (i: number) => {
      if(i >= search_results.path.length) return;
      path_set = path_set.add(search_results.path[i].id);
      timeout = setTimeout(() => update_path(i + 1), path_timeout_time);
   }

   const update_visited = (i: number) => {
      if(i >= search_results.nodes_vistied.length) {
         timeout = setTimeout(() => update_path(0), path_timeout_time);
         return;
      }
      visited_set = visited_set.add(search_results.nodes_vistied[i].id);
      timeout = setTimeout(() => update_visited(i + 1), visited_timneout_time);
   }

   $: (() => {
      if(!search_results) { 
         // Search results was cleared. Need to stop any animations
         if(timeout) clearTimeout(timeout);
         if(path_set.size > 0) path_set = new Set([] as number[]);
         if(visited_set.size > 0) visited_set = new Set([] as number[]);
         prev_search_results = undefined;
         return;
      }

      if(search_results === prev_search_results) return;

      prev_search_results = search_results;
      timeout = setTimeout(() => update_visited(0), 0);
   })();

   const get_search_value = (element: GridElementType, path_set, visited_set) => {
      const node_id = get_node_id(element.row, element.col, rows, cols)
      if(path_set.has(node_id))
         return "path";
      if(visited_set.has(node_id))
         return "visited";
      return undefined;
   }
</script>

<div
   class="grid-container"
   on:mouseup={() => dispatch("action", {type: "mouse_up"})}
   on:mousedown={() => dispatch("action", {type: "mouse_down"})}
   on:mouseleave={() => dispatch("action", {type: "mouse_up"})}
>
   {#each grid_state as row}
      <div class="grid-row">
         {#each row as element}
            <GridElement
               on:enter={() => dispatch("action", {type: "enter", props: element})}
               on:leave={() => dispatch("action", {type: "leave", props: element})}
               selected={element.selected}
               enable_edit={enable_edit}
               value={element.value}
               row={element.row}
               col={element.col}
               search_value={get_search_value(element, path_set, visited_set)}
            />
         {/each}
      </div>
   {/each}
</div>

<style>
   div {
      display: flex;
   }

   .grid-container {
      flex-direction: column;
      width: fit-content;
      margin-bottom: 0.5em;
   }

   .grid-row {
      width: fit-content;
   }
</style>
