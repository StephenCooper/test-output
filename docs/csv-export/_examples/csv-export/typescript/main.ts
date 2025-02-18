import {
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  CsvExportModule,
  GridApi,
  GridOptions,
  ModuleRegistry,
  NumberEditorModule,
  TextEditorModule,
  ValidationModule,
  createGrid,
} from "ag-grid-community";

ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  CsvExportModule,
  NumberEditorModule,
  TextEditorModule,
  ValidationModule /* Development Only */,
]);

let gridApi: GridApi;

const gridOptions: GridOptions = {
  defaultColDef: {
    editable: true,
    minWidth: 100,
    flex: 1,
  },

  suppressExcelExport: true,
  popupParent: document.body,

  columnDefs: [{ field: "make" }, { field: "model" }, { field: "price" }],

  rowData: [
    { make: "Toyota", model: "Celica", price: 35000 },
    { make: "Ford", model: "Mondeo", price: 32000 },
    { make: "Porsche", model: "Boxster", price: 72000 },
  ],
};

function onBtnExport() {
  gridApi!.exportDataAsCsv();
}

function onBtnUpdate() {
  (document.querySelector("#csvResult") as any).value = gridApi!.getDataAsCsv();
}

// setup the grid after the page has finished loading
const gridDiv = document.querySelector<HTMLElement>("#myGrid")!;
gridApi = createGrid(gridDiv, gridOptions);

if (typeof window !== "undefined") {
  // Attach external event handlers to window so they can be called from index.html
  (<any>window).onBtnExport = onBtnExport;
  (<any>window).onBtnUpdate = onBtnUpdate;
}
