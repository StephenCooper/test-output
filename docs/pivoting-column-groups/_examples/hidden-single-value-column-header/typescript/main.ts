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
import {
  ColumnMenuModule,
  ColumnsToolPanelModule,
  ContextMenuModule,
  FiltersToolPanelModule,
  PivotModule,
} from "ag-grid-enterprise";
import { IOlympicData } from "./interfaces";

ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  ColumnsToolPanelModule,
  FiltersToolPanelModule,
  ColumnMenuModule,
  ContextMenuModule,
  PivotModule,
  ValidationModule /* Development Only */,
]);

let gridApi: GridApi<IOlympicData>;

function togglePivotHeader() {
  const checkbox = document.querySelector<HTMLInputElement>(
    "#removePivotHeaderRowWhenSingleValueColumn",
  )!;
  gridApi.setGridOption(
    "removePivotHeaderRowWhenSingleValueColumn",
    checkbox.checked,
  );
}

const gridOptions: GridOptions<IOlympicData> = {
  columnDefs: [
    { field: "country", rowGroup: true },
    { field: "sport", pivot: true },
    { field: "gold", aggFunc: "sum" },
  ],
  defaultColDef: {
    flex: 1,
    minWidth: 130,
  },
  autoGroupColumnDef: {
    minWidth: 200,
  },
  pivotMode: true,
  removePivotHeaderRowWhenSingleValueColumn: true,
};

// setup the grid after the page has finished loading
const gridDiv = document.querySelector<HTMLElement>("#myGrid")!;
gridApi = createGrid(gridDiv, gridOptions);

fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
  .then((response) => response.json())
  .then((data: IOlympicData[]) => gridApi!.setGridOption("rowData", data));

if (typeof window !== "undefined") {
  // Attach external event handlers to window so they can be called from index.html
  (<any>window).togglePivotHeader = togglePivotHeader;
}
