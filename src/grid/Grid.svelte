<script lang="ts">
   import GridElement from "./GridElement.svelte";
   import ToolSelector from "./ToolSelector.svelte";
   import {init_grid_state } from "./tools";

   import type {GridElementType} from "./tools";

   // Props
	export let rows: number;
	export let cols: number;

   // State 
   let active_element: GridElementType | undefined;
   let active_value: string | undefined;
   let values: string[] = ["start", "end", "wall", "air"];
   let grid_state: GridElementType[][] = init_grid_state(rows, cols);

   const mouse_up = () => {
      if(!active_element)
         return;
      
      active_element.selected = true;

      grid_state[active_element.row][active_element.col] = active_element;
   }


   const mouse_down = () => {

   }
</script>

<div class="root-container">
   <div 
      class="grid-container"
      on:mouseup="{mouse_up}"
      on:mousedown="{mouse_down}"
   >
      {#each grid_state as row, r}
         <div class="grid-row">
            {#each row as element, c} 
               <GridElement
                  on:enter={() => {active_element = element}}
                  on:leave={() => {active_element = undefined}}
                  selected={element.selected}
                  enable_edit={true}
                  row={element.row}
                  col={element.col}
               />
            {/each}
         </div>
      {/each}
   </div>

   <ToolSelector
      tile_values={values}
      active_value={active_value}
      actions={["reset", "clear", "search"]}
      enable_actions={true}
      on:set_active={(event) => active_value = event.detail.value}
   />
</div>

<style>
	div {
		display: flex;
	}

	.root-container {
		flex-direction: column;
      width: fit-content;
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