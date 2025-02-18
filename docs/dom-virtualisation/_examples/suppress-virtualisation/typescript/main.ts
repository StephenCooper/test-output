import {
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  GridApi,
  GridOptions,
  ModuleRegistry,
  ValidationModule,
  ValueFormatterParams,
  createGrid,
} from "ag-grid-community";
import { IOlympicData } from "./interfaces";

ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  ValidationModule /* Development Only */,
]);

let times = 1;

let gridApi: GridApi<IOlympicData>;

const gridOptions: GridOptions<IOlympicData> = {
  columnDefs: [
    { field: "athlete" },
    { field: "sport" },
    { field: "age" },
    { field: "year" },
    { field: "date" },
    { field: "gold" },
    { field: "silver" },
    { field: "bronze" },
    { field: "total" },
  ],
  defaultColDef: {
    valueFormatter: (params: ValueFormatterParams) => {
      console.log("formatter called " + times + " times");
      times++;
      return params.value;
    },
    cellDataType: false,
  },
  suppressColumnVirtualisation: true,
  suppressRowVirtualisation: true,
};

// setup the grid after the page has finished loading
const gridDiv = document.querySelector<HTMLElement>("#myGrid")!;
gridApi = createGrid(gridDiv, gridOptions);

fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
  .then((response) => response.json())
  .then((data: IOlympicData[]) =>
    gridApi!.setGridOption("rowData", data.slice(0, 100)),
  );
