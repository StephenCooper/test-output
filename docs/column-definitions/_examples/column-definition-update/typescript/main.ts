import {
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  ColumnAutoSizeModule,
  GridApi,
  GridOptions,
  ModuleRegistry,
  SizeColumnsToContentStrategy,
  SizeColumnsToFitGridStrategy,
  SizeColumnsToFitProvidedWidthStrategy,
  ValidationModule,
  createGrid,
} from "ag-grid-community";
import { IOlympicData } from "./interfaces";

ModuleRegistry.registerModules([
  ColumnAutoSizeModule,
  ClientSideRowModelModule,
  ValidationModule /* Development Only */,
]);

const columnDefinitions: ColDef[] = [
  { field: "athlete" },
  { field: "age" },
  { field: "country" },
  { field: "sport" },
];

const updatedHeaderColumnDefs: ColDef[] = [
  { field: "athlete", headerName: "C1" },
  { field: "age", headerName: "C2" },
  { field: "country", headerName: "C3" },
  { field: "sport", headerName: "C4" },
];

let gridApi: GridApi<IOlympicData>;

const gridOptions: GridOptions<IOlympicData> = {
  columnDefs: columnDefinitions,
  autoSizeStrategy: {
    type: "fitGridWidth",
  },
};

function onBtUpdateHeaders() {
  gridApi!.setGridOption("columnDefs", updatedHeaderColumnDefs);
}

function onBtRestoreHeaders() {
  gridApi!.setGridOption("columnDefs", columnDefinitions);
}

const gridDiv = document.querySelector<HTMLElement>("#myGrid")!;
gridApi = createGrid(gridDiv, gridOptions);

fetch("https://www.ag-grid.com/example-assets/small-olympic-winners.json")
  .then((response) => response.json())
  .then((data: IOlympicData[]) => gridApi!.setGridOption("rowData", data));

if (typeof window !== "undefined") {
  // Attach external event handlers to window so they can be called from index.html
  (<any>window).onBtUpdateHeaders = onBtUpdateHeaders;
  (<any>window).onBtRestoreHeaders = onBtRestoreHeaders;
}
