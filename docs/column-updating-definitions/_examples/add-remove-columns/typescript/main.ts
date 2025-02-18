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
import { IOlympicData } from "./interfaces";

ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  ValidationModule /* Development Only */,
]);

const columnDefsMedalsIncluded: ColDef[] = [
  { field: "athlete" },
  { field: "gold" },
  { field: "silver" },
  { field: "bronze" },
  { field: "total" },
  { field: "age" },
  { field: "country" },
  { field: "sport" },
  { field: "year" },
  { field: "date" },
];

const colDefsMedalsExcluded: ColDef[] = [
  { field: "athlete" },
  { field: "age" },
  { field: "country" },
  { field: "sport" },
  { field: "year" },
  { field: "date" },
];

let gridApi: GridApi<IOlympicData>;

const gridOptions: GridOptions<IOlympicData> = {
  columnDefs: columnDefsMedalsIncluded,
  defaultColDef: {
    initialWidth: 100,
  },
};

function onBtExcludeMedalColumns() {
  gridApi!.setGridOption("columnDefs", colDefsMedalsExcluded);
}

function onBtIncludeMedalColumns() {
  gridApi!.setGridOption("columnDefs", columnDefsMedalsIncluded);
}

const gridDiv = document.querySelector<HTMLElement>("#myGrid")!;
gridApi = createGrid(gridDiv, gridOptions);

fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
  .then((response) => response.json())
  .then((data: IOlympicData[]) => gridApi!.setGridOption("rowData", data));

if (typeof window !== "undefined") {
  // Attach external event handlers to window so they can be called from index.html
  (<any>window).onBtExcludeMedalColumns = onBtExcludeMedalColumns;
  (<any>window).onBtIncludeMedalColumns = onBtIncludeMedalColumns;
}
