import {
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  ColumnApiModule,
  GridApi,
  GridOptions,
  ModuleRegistry,
  ValidationModule,
  createGrid,
} from "ag-grid-community";
import { IOlympicData } from "./interfaces";

ModuleRegistry.registerModules([
  ColumnApiModule,
  ClientSideRowModelModule,
  ValidationModule /* Development Only */,
]);

function getColumnDefs(): ColDef[] {
  return [
    { field: "athlete", width: 150, sort: "asc" },
    { field: "age" },
    { field: "country", pinned: "left" },
    { field: "sport" },
    { field: "year" },
    { field: "date" },
    { field: "gold" },
    { field: "silver" },
    { field: "bronze" },
    { field: "total" },
  ];
}

let gridApi: GridApi<IOlympicData>;

const gridOptions: GridOptions<IOlympicData> = {
  defaultColDef: {
    width: 100, // resets col widths if manually resized
    pinned: null, // important - clears pinned if not specified in col def
    sort: null, // important - clears sort if not specified in col def
  },
  columnDefs: getColumnDefs(),
};

function onBtWithState() {
  gridApi!.setGridOption("columnDefs", getColumnDefs());
}

function onBtRemove() {
  gridApi!.setGridOption("columnDefs", []);
}

// setup the grid after the page has finished loading
const gridDiv = document.querySelector<HTMLElement>("#myGrid")!;
gridApi = createGrid(gridDiv, gridOptions);

fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
  .then((response) => response.json())
  .then((data: IOlympicData[]) => gridApi!.setGridOption("rowData", data));

if (typeof window !== "undefined") {
  // Attach external event handlers to window so they can be called from index.html
  (<any>window).onBtWithState = onBtWithState;
  (<any>window).onBtRemove = onBtRemove;
}
