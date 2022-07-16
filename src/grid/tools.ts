type GridElementType = {
   selected: boolean;
   value: string;
   row: number;
   col: number;
};


const init_grid_state = (rows: number, cols: number): GridElementType[][] => {
   const output: GridElementType[][] = [];

   for(let r = 0; r < rows; r++){
      const row: GridElementType[] = [];
      for(let c = 0; c < cols; c++){
         row[c] = {
            selected: false,
            value: "air",
            row: r,
            col: c
         };
      }
      output.push(row)
   }

   return output;
}


export type {GridElementType};
export { init_grid_state };