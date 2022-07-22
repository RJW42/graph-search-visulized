<script lang="ts">
   import { createEventDispatcher } from "svelte";

   export let tile_values: string[];
   export let active_value: string | undefined;
   export let actions: string[];
   export let enable_actions: boolean;
   export let search_algorithms: string[];
   export let current_algorithm: string;

   console.log(search_algorithms);
   console.log(current_algorithm);

   let algorithm_dropdown = false;


   const dispatch = createEventDispatcher();
</script>

<div class="container">
   <div class="values">
      <h2>Values</h2>
      {#each tile_values as value}
         <div 
            class={"value clickable " + (value === active_value ? "active " : "")}
            on:click={() => {
               if (value === active_value)
                  return;
               dispatch("set_active", {
                  value: value
               });
            }}
         >
            {value}
         </div>
      {/each}
   </div>

   <div class="actions">
      <h2>Actions</h2>
      {#each actions as action}
         <div 
            class={"action clickable " + (enable_actions ? "enable " : "disable ")}
            on:click={() => {
               dispatch("perform_action", {
                  action: action
               });
            }}
         >
            {action}
         </div>
      {/each}
      <div 
         class={"action dropdown-container " + (algorithm_dropdown ? "visible" : "hidden")}
      >
         <div 
            class="clickable title "
            on:click={() => algorithm_dropdown = !algorithm_dropdown}
         >
         Algorithm
         </div>   
         <div class={"dropdown " + (algorithm_dropdown ? "visible" : "hidden")}>
            <div class="dropdown-element clickable"> 1 </div>
            <div class="dropdown-element clickable"> 2 </div>
            <div class="dropdown-element clickable"> 3 </div>
         </div>
      </div>
   </div>
</div>

<style>
   div {
      display: flex;   
   }

   .container {
      width: 100%;
      height: 10em;
      background-color:aliceblue;
   }

   .container div {
      flex-direction: column;
      width: 50%;
      padding: 0.1em;
   }

   .container div h2 {
      margin-top: 0;
      margin-bottom: 0;
   }

   .value:hover, .action.enable:hover {
      cursor: pointer;
   }

   .clickable:hover {
      cursor: pointer;
      color: lightgrey;
      font-style: italic;
   }

   .value.active:hover {
      cursor: default;
      font-style: normal;
   }

   .action.disable {
      color: lightgray;
   }

   .value.active {
      color: green;
   }

   .dropdown.hidden {
      display: none;
   }

   .dropdown-container {
      margin-left: -0.2em;
   }

   .dropdown.visible {
      box-shadow: inset;
      z-index: 0;
   }
</style>