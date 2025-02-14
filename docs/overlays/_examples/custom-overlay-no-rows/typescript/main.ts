import {
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  GridApi,
  GridOptions,
  ModuleRegistry,
  TextEditorModule,
  TextFilterModule,
  ValidationModule,
  createGrid,
} from "ag-grid-community";
import { CustomNoRowsOverlay } from "./customNoRowsOverlay";

ModuleRegistry.registerModules([
  TextEditorModule,
  TextFilterModule,
  ClientSideRowModelModule,
  ValidationModule /* Development Only */,
]);

interface IAthlete {
  athlete: string;
  country: string;
}

const columnDefs: ColDef[] = [
  { field: "athlete", width: 150 },
  { field: "country", width: 120 },
];

let gridApi: GridApi<IAthlete>;

const gridOptions: GridOptions<IAthlete> = {
  defaultColDef: {
    editable: true,
    flex: 1,
    minWidth: 100,
    filter: true,
  },

  columnDefs: columnDefs,
  rowData: [],

  noRowsOverlayComponent: CustomNoRowsOverlay,
  noRowsOverlayComponentParams: {
    noRowsMessageFunc: () =>
      "No rows found at: " + new Date().toLocaleTimeString(),
  },
};

function onBtnClearRowData() {
  gridApi!.setGridOption("rowData", []);
}

function onBtnSetRowData() {
  gridApi!.setGridOption("rowData", [
    { athlete: "Michael Phelps", country: "US" },
  ]);
}

// setup the grid after the page has finished loading
const gridDiv = document.querySelector<HTMLElement>("#myGrid")!;
gridApi = createGrid(gridDiv, gridOptions);

if (typeof window !== "undefined") {
  // Attach external event handlers to window so they can be called from index.html
  (<any>window).onBtnClearRowData = onBtnClearRowData;
  (<any>window).onBtnSetRowData = onBtnSetRowData;
}
