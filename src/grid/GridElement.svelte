<script lang="ts">
   import { createEventDispatcher } from "svelte";

   export let enable_edit: boolean;
   export let selected: boolean;
   export let value: string;
   export let row: number;
   export let col: number;
   export let search_value: string | undefined;

   const dispatch = createEventDispatcher();

   // Init classes 
   $: classes = "grid-item " + value + " " +
      (enable_edit ? "editable " : "") + 
      (selected ? "selected " : "") + 
      (search_value === "path" ? "path " : "") +
      (search_value === "visited" ? "visited " : "") +
      (search_value === "checked" ? "checked " : "");
</script>

<div 
   class={classes}
   on:mouseenter="{() => dispatch('enter')}"
   on:mouseleave="{() => dispatch('leave')}"
>
   <div></div>
</div>

<style>
	.grid-item {
		width: 2em;
		height: 2em;
		padding: 0.1em;
      transition: all 0.2s ease-in-out;
	}

   .grid-item div{
      width: 100%;
      height: 100%;
   }

   .grid-item.air div {
      background-color: aliceblue;
   }

   .grid-item.start div {
      background-color: green;
   }

   .grid-item.wall div {
      background-color: grey;
   }

   .grid-item.end div {
      background-color: gold;
   }

   .grid-item.air.path div {
      background-color: blue;
   }

   .grid-item.air.visited div {
      background-color: aquamarine;
   }

   .grid-item.air.checked div {
      background-color: blueviolet;
   }

   .grid-item.editable:hover,
   .grid-item.selected {
      padding: 0.0em;
      width: 2.2em;
      height: 2.2em;
      cursor: pointer;
   }
</style>