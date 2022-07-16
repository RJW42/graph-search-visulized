<script lang="ts">
   import GridElement from "./GridElement.svelte";
import ToolSelector from "./ToolSelector.svelte";

	export let rows: number;
	export let cols: number;

   let active_element: GridElement | undefined;

   type GridElement = {
      selected: boolean;
      row: number;
      col: number;
   };

   const init_grid_state = (rows: number, cols: number): GridElement[][] => {
      const output: GridElement[][] = [];

      for(let r = 0; r < rows; r++){
         const row: GridElement[] = [];
         for(let c = 0; c < cols; c++){
            row[c] = {
               selected: false,
               row: r,
               col: c
            };
         }
         output.push(row)
      }

      return output;
   }

   const grid_state: GridElement[][] = init_grid_state(rows, cols);

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
      tile_values={["start", "end", "wall", "air"]}
      active_value="end"
      actions={["reset", "clear", "search"]}
      enable_actions={true}
      on:set_active={(event) => console.log(event.detail.value)}
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