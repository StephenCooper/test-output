import {
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  Column,
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

let gridApi: GridApi<IOlympicData>;

const gridOptions: GridOptions<IOlympicData> = {
  columnDefs: [
    { field: "athlete" },
    { field: "age" },
    { field: "country" },
    { field: "year" },
    { field: "date" },
    { field: "sport" },
    { field: "gold" },
    { field: "silver" },
    { field: "bronze" },
    { field: "total" },
  ],
  defaultColDef: {
    width: 150,
  },
  suppressDragLeaveHidesColumns: true,
};

function onMedalsFirst() {
  gridApi!.moveColumns(["gold", "silver", "bronze", "total"], 0);
}

function onMedalsLast() {
  gridApi!.moveColumns(["gold", "silver", "bronze", "total"], 6);
}

function onCountryFirst() {
  gridApi!.moveColumns(["country"], 0);
}

function onSwapFirstTwo() {
  gridApi!.moveColumnByIndex(0, 1);
}

function onPrintColumns() {
  const cols = gridApi!.getAllGridColumns();
  const colToNameFunc = (col: Column, index: number) =>
    index + " = " + col.getId();
  const colNames = cols.map(colToNameFunc).join(", ");
  console.log("columns are: " + colNames);
}

const gridDiv = document.querySelector<HTMLElement>("#myGrid")!;
gridApi = createGrid(gridDiv, gridOptions);

fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
  .then((response) => response.json())
  .then((data: IOlympicData[]) => gridApi!.setGridOption("rowData", data));

if (typeof window !== "undefined") {
  // Attach external event handlers to window so they can be called from index.html
  (<any>window).onMedalsFirst = onMedalsFirst;
  (<any>window).onMedalsLast = onMedalsLast;
  (<any>window).onCountryFirst = onCountryFirst;
  (<any>window).onSwapFirstTwo = onSwapFirstTwo;
  (<any>window).onPrintColumns = onPrintColumns;
}
