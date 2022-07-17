<script lang="ts">
   import type { GridElementType } from "./tools";
   import { get_node_id, Node } from "../graphSearch/graph";
   import { createEventDispatcher } from "svelte";

   import GridElement from "./GridElement.svelte";

   // Props
   export let grid_state: GridElementType[][];
   export let path: Node[] | undefined;

   const rows = grid_state.length;
   const cols = grid_state[0].length;
   const enable_edit = true;
   const dispatch = createEventDispatcher();

   $: path_set = ((path: Node[] | undefined) => {
      if(path) return new Set(path.map(n => n.id));
      return new Set([] as number[]);
   })(path);

   const get_search_value = (element: GridElementType, path_set) => {
      if(path_set.has(get_node_id(element.row, element.col, rows, cols)))
         return "path";
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
               search_value={get_search_value(element, path_set)}
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