<script lang="ts">
   import GridElement from "./GridElement.svelte";
   import ToolSelector from "./ToolSelector.svelte";
   import {init_grid_state } from "./tools";

   import type {GridElementType} from "./tools";

   // Props
	export let rows: number;
	export let cols: number;

   // State 
   let active_value: string | undefined;
   let values: string[] = ["start", "end", "wall", "air"];
   let grid_state: GridElementType[][] = init_grid_state(rows, cols);

   let mouse_value = "up";
   let active_element: GridElementType | undefined;

   const perform_action = (action: string, element?: GridElementType) => {
      if(action === "mouse_up") {
         mouse_value = "up";
         if(!active_element || !active_value)
            return;
         active_element.value = active_value;
         grid_state[active_element.row][active_element.col] = active_element;
      } else if(action === "mouse_down") {
         mouse_value = "down";
         mouse_value = "down";
      } else if(action === "enter") {
         active_element = element;
         if(mouse_value !== "down" || !active_value)
            return;
         active_element.value = active_value;
         grid_state[active_element.row][active_element.col] = active_element;
      } else if(action === "leave") {
         active_element = undefined;
      }
   };
</script>

<div class="root-container">
   <div 
      class="grid-container"
      on:mouseup="{() => perform_action("mouse_up")}"
      on:mousedown="{() => perform_action("mouse_down")}"
   >
      {#each grid_state as row, r}
         <div class="grid-row">
            {#each row as element, c} 
               <GridElement
                  on:enter={() => perform_action("enter", element)}
                  on:leave={() => perform_action("leave", element)}
                  selected={element.selected}
                  enable_edit={true}
                  value={element.value}
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