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

function getColumnDefsA(): ColDef[] {
  return [
    { field: "athlete", headerName: "A Athlete" },
    { field: "age", headerName: "A Age" },
    { field: "country", headerName: "A Country" },
    { field: "sport", headerName: "A Sport" },
    { field: "year", headerName: "A Year" },
    { field: "date", headerName: "A Date" },
    { field: "gold", headerName: "A Gold" },
    { field: "silver", headerName: "A Silver" },
    { field: "bronze", headerName: "A Bronze" },
    { field: "total", headerName: "A Total" },
  ];
}

function getColumnDefsB(): ColDef[] {
  return [
    { field: "gold", headerName: "B Gold" },
    { field: "silver", headerName: "B Silver" },
    { field: "bronze", headerName: "B Bronze" },
    { field: "total", headerName: "B Total" },
    { field: "athlete", headerName: "B Athlete" },
    { field: "age", headerName: "B Age" },
    { field: "country", headerName: "B Country" },
    { field: "sport", headerName: "B Sport" },
    { field: "year", headerName: "B Year" },
    { field: "date", headerName: "B Date" },
  ];
}

let gridApi: GridApi<IOlympicData>;

const gridOptions: GridOptions<IOlympicData> = {
  defaultColDef: {
    initialWidth: 100,
    filter: true,
  },
  maintainColumnOrder: true,
  columnDefs: getColumnDefsA(),
};

function setColsA() {
  gridApi!.setGridOption("columnDefs", getColumnDefsA());
}

function setColsB() {
  gridApi!.setGridOption("columnDefs", getColumnDefsB());
}

function clearColDefs() {
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
  (<any>window).setColsA = setColsA;
  (<any>window).setColsB = setColsB;
  (<any>window).clearColDefs = clearColDefs;
}
