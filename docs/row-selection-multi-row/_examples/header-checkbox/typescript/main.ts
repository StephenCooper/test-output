import {
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  GridApi,
  GridOptions,
  ModuleRegistry,
  PaginationModule,
  QuickFilterModule,
  RowSelectionModule,
  RowSelectionOptions,
  ValidationModule,
  createGrid,
} from "ag-grid-community";
import { IOlympicData } from "./interfaces";

ModuleRegistry.registerModules([
  PaginationModule,
  RowSelectionModule,
  QuickFilterModule,
  ClientSideRowModelModule,
  ValidationModule /* Development Only */,
]);

let gridApi: GridApi<IOlympicData>;

const gridOptions: GridOptions<IOlympicData> = {
  columnDefs: [
    { headerName: "Athlete", field: "athlete", minWidth: 180 },
    { field: "age" },
    { field: "country", minWidth: 150 },
    { field: "year" },
    { field: "date", minWidth: 150 },
    { field: "sport", minWidth: 150 },
    { field: "gold" },
    { field: "silver" },
    { field: "bronze" },
    { field: "total" },
  ],
  defaultColDef: {
    flex: 1,
    minWidth: 100,
  },
  pagination: true,
  paginationAutoPageSize: true,
  rowSelection: {
    mode: "multiRow",
    selectAll: "all",
  },
};

function onQuickFilterChanged() {
  gridApi!.setGridOption(
    "quickFilterText",
    document.querySelector<HTMLInputElement>("#quickFilter")?.value,
  );
}

function updateSelectAllMode() {
  const selectAll =
    document.querySelector<HTMLSelectElement>("#select-all-mode")?.value ??
    "all";

  gridApi.setGridOption("rowSelection", {
    mode: "multiRow",
    selectAll: selectAll as "all" | "filtered" | "currentPage",
  });
}

const gridDiv = document.querySelector<HTMLElement>("#myGrid")!;
gridApi = createGrid(gridDiv, gridOptions);

fetch("https://www.ag-grid.com/example-assets/small-olympic-winners.json")
  .then((response) => response.json())
  .then((data: IOlympicData[]) => gridApi.setGridOption("rowData", data));

if (typeof window !== "undefined") {
  // Attach external event handlers to window so they can be called from index.html
  (<any>window).onQuickFilterChanged = onQuickFilterChanged;
  (<any>window).updateSelectAllMode = updateSelectAllMode;
}
