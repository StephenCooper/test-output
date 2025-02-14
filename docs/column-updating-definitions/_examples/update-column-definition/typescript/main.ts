import {
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  GridApi,
  GridOptions,
  ModuleRegistry,
  NumberFilterModule,
  TextFilterModule,
  ValidationModule,
  createGrid,
} from "ag-grid-community";
import { IOlympicData } from "./interfaces";

ModuleRegistry.registerModules([
  TextFilterModule,
  NumberFilterModule,
  ClientSideRowModelModule,
  ValidationModule /* Development Only */,
]);

const COL_DEFS: ColDef<IOlympicData>[] = [
  { field: "athlete" },
  { field: "age" },
  { field: "country" },
  { field: "sport" },
  { field: "year" },
  { field: "date" },
  { field: "gold" },
  { field: "silver" },
  { field: "bronze" },
  { field: "total" },
];

let gridApi: GridApi<IOlympicData>;

const gridOptions: GridOptions<IOlympicData> = {
  defaultColDef: {
    initialWidth: 100,
    filter: true,
  },
  columnDefs: COL_DEFS,
};

function setHeaderNames() {
  COL_DEFS.forEach((colDef, index) => {
    colDef.headerName = "C" + index;
  });
  gridApi!.setGridOption("columnDefs", COL_DEFS);
}

function removeHeaderNames() {
  COL_DEFS.forEach((colDef) => {
    colDef.headerName = undefined;
  });
  gridApi!.setGridOption("columnDefs", COL_DEFS);
}

function setValueFormatters() {
  COL_DEFS.forEach((colDef) => {
    colDef.valueFormatter = function (params) {
      return "[ " + params.value + " ]";
    };
  });
  gridApi!.setGridOption("columnDefs", COL_DEFS);
}

function removeValueFormatters() {
  COL_DEFS.forEach((colDef) => {
    colDef.valueFormatter = undefined;
  });
  gridApi!.setGridOption("columnDefs", COL_DEFS);
}

// setup the grid after the page has finished loading
const gridDiv = document.querySelector<HTMLElement>("#myGrid")!;
gridApi = createGrid(gridDiv, gridOptions);

fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
  .then((response) => response.json())
  .then((data) => {
    gridApi!.setGridOption("rowData", data);
  });

if (typeof window !== "undefined") {
  // Attach external event handlers to window so they can be called from index.html
  (<any>window).setHeaderNames = setHeaderNames;
  (<any>window).removeHeaderNames = removeHeaderNames;
  (<any>window).setValueFormatters = setValueFormatters;
  (<any>window).removeValueFormatters = removeValueFormatters;
}
