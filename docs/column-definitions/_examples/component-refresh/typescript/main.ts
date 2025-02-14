import {
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  GridApi,
  GridOptions,
  ModuleRegistry,
  ValidationModule,
  createGrid,
} from "ag-grid-community";
import { MedalCellRenderer } from "./medalCellRenderer";
import { UpdateCellRenderer } from "./updateCellRenderer";
import { IOlympicData } from "./interfaces";

ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  ValidationModule /* Development Only */,
]);

let gridApi: GridApi<IOlympicData>;

const gridOptions: GridOptions<IOlympicData> = {
  columnDefs: [
    { field: "athlete" },
    { field: "year" },
    { field: "gold", cellRenderer: MedalCellRenderer },
    { field: "silver", cellRenderer: MedalCellRenderer },
    { field: "bronze", cellRenderer: MedalCellRenderer },
    { cellRenderer: UpdateCellRenderer },
  ],
  defaultColDef: {
    flex: 1,
    minWidth: 100,
  },
};

// setup the grid after the page has finished loading
const gridDiv = document.querySelector<HTMLElement>("#myGrid")!;
gridApi = createGrid(gridDiv, gridOptions);

fetch("https://www.ag-grid.com/example-assets/small-olympic-winners.json")
  .then((response) => response.json())
  .then((data: IOlympicData[]) => {
    gridApi!.setGridOption("rowData", data);
  });
