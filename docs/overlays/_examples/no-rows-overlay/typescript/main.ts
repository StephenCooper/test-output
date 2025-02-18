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

ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  ValidationModule /* Development Only */,
]);

interface IAthlete {
  athlete: string;
  country: string;
}

let gridApi: GridApi<IAthlete>;

const gridOptions: GridOptions<IAthlete> = {
  rowData: [],
  columnDefs: [{ field: "athlete" }, { field: "country" }],
};

function onBtnClearRowData() {
  gridApi!.setGridOption("rowData", []);
}

function onBtnSetRowData() {
  gridApi!.setGridOption("rowData", [
    { athlete: "Michael Phelps", country: "US" },
  ]);
}

const gridDiv = document.querySelector<HTMLElement>("#myGrid")!;
gridApi = createGrid(gridDiv, gridOptions);

if (typeof window !== "undefined") {
  // Attach external event handlers to window so they can be called from index.html
  (<any>window).onBtnClearRowData = onBtnClearRowData;
  (<any>window).onBtnSetRowData = onBtnSetRowData;
}
