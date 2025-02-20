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
import { CustomLoadingOverlay } from "./customLoadingOverlay";

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

const rowData: IAthlete[] = [
  { athlete: "Michael Phelps", country: "United States" },
  { athlete: "Natalie Coughlin", country: "United States" },
  { athlete: "Aleksey Nemov", country: "Russia" },
  { athlete: "Alicia Coutts", country: "Australia" },
];

let gridApi: GridApi<IAthlete>;

const gridOptions: GridOptions<IAthlete> = {
  defaultColDef: {
    editable: true,
    flex: 1,
    minWidth: 100,
    filter: true,
  },

  loading: true,

  columnDefs: columnDefs,
  rowData,

  loadingOverlayComponent: CustomLoadingOverlay,
  loadingOverlayComponentParams: {
    loadingMessage: "One moment please...",
  },
};

function setLoading(value: boolean) {
  gridApi!.setGridOption("loading", value);
}

// setup the grid after the page has finished loading
const gridDiv = document.querySelector<HTMLElement>("#myGrid")!;
gridApi = createGrid(gridDiv, gridOptions);

if (typeof window !== "undefined") {
  // Attach external event handlers to window so they can be called from index.html
  (<any>window).setLoading = setLoading;
}
