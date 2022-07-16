<script lang="ts">
   import { createEventDispatcher } from "svelte";

   export let enable_edit: boolean;
   export let selected: boolean;
   export let row: number;
   export let col: number;

   const dispatch = createEventDispatcher();

   // Init classes 
   $: classes = "grid-item " + 
      (enable_edit ? "editable " : "") + 
      (selected ? "selected " : ""); 
</script>

<div 
   class={classes}
   on:mouseenter="{() => dispatch('enter')}"
   on:mouseleave="{() => dispatch('leave')}"
>
   
</div>

<style>
	.grid-item {
		width: 2em;
		height: 2em;
		background-color: aliceblue;
		margin: 0.1em;
	}

   .grid-item.editable:hover,
   .grid-item.selected {
      margin: 0.0em;
      width: 2.2em;
      height: 2.2em;
      cursor: pointer;
   }
</style>