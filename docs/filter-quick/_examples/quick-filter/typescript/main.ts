import {
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  GridApi,
  GridOptions,
  ModuleRegistry,
  QuickFilterModule,
  ValidationModule,
  createGrid,
} from "ag-grid-community";

ModuleRegistry.registerModules([
  QuickFilterModule,
  ClientSideRowModelModule,
  ValidationModule /* Development Only */,
]);

let gridApi: GridApi;

const gridOptions: GridOptions = {
  columnDefs: [
    { field: "athlete" },
    { field: "country" },
    { field: "sport" },
    { field: "age", minWidth: 100 },
    { field: "gold", minWidth: 100 },
    { field: "silver", minWidth: 100 },
    { field: "bronze", minWidth: 100 },
  ],
  defaultColDef: {
    flex: 1,
  },
};

function onFilterTextBoxChanged() {
  gridApi!.setGridOption(
    "quickFilterText",
    (document.getElementById("filter-text-box") as HTMLInputElement).value,
  );
}

// setup the grid after the page has finished loading
const gridDiv = document.querySelector<HTMLElement>("#myGrid")!;
gridApi = createGrid(gridDiv, gridOptions);

fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
  .then((response) => response.json())
  .then((data: IOlympicData[]) => gridApi!.setGridOption("rowData", data));

if (typeof window !== "undefined") {
  // Attach external event handlers to window so they can be called from index.html
  (<any>window).onFilterTextBoxChanged = onFilterTextBoxChanged;
}
