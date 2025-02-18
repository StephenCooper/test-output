import {
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  ColumnApiModule,
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
import { ColumnsToolPanelModule, RowGroupingModule } from "ag-grid-enterprise";
import { IOlympicData } from "./interfaces";

ModuleRegistry.registerModules([
  ColumnApiModule,
  ColumnAutoSizeModule,
  ClientSideRowModelModule,
  ColumnsToolPanelModule,
  RowGroupingModule,
  ValidationModule /* Development Only */,
]);

const columnDefs: ColDef[] = [
  { field: "athlete" },
  { field: "age" },
  { field: "country" },
  { field: "sport" },
];

let gridApi: GridApi<IOlympicData>;

const gridOptions: GridOptions<IOlympicData> = {
  columnDefs: columnDefs,
  autoSizeStrategy: {
    type: "fitGridWidth",
  },
};

function onBtSortAthlete() {
  gridApi!.applyColumnState({
    state: [{ colId: "athlete", sort: "asc" }],
  });
}

function onBtClearAllSorting() {
  gridApi!.applyColumnState({
    defaultState: { sort: null },
  });
}

const gridDiv = document.querySelector<HTMLElement>("#myGrid")!;
gridApi = createGrid(gridDiv, gridOptions);

fetch("https://www.ag-grid.com/example-assets/small-olympic-winners.json")
  .then((response) => response.json())
  .then((data: IOlympicData[]) => gridApi!.setGridOption("rowData", data));

if (typeof window !== "undefined") {
  // Attach external event handlers to window so they can be called from index.html
  (<any>window).onBtSortAthlete = onBtSortAthlete;
  (<any>window).onBtClearAllSorting = onBtClearAllSorting;
}
