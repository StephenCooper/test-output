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
import { RowGroupingModule, RowGroupingPanelModule } from "ag-grid-enterprise";
import { IOlympicData } from "./interfaces";

ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  RowGroupingModule,
  RowGroupingPanelModule,
  ValidationModule /* Development Only */,
]);

let gridApi: GridApi<IOlympicData>;

const gridOptions: GridOptions<IOlympicData> = {
  columnDefs: [
    { field: "country", enableRowGroup: true },
    { field: "year", enableRowGroup: true },
    { field: "athlete", minWidth: 180 },
    { field: "total" },
  ],
  defaultColDef: {
    flex: 1,
    minWidth: 150,
  },
  autoGroupColumnDef: {
    minWidth: 200,
  },
  suppressDragLeaveHidesColumns: true,
  rowGroupPanelShow: "always",
};

function onPropertyChange() {
  const prop = (
    document.querySelector("#visibility-behaviour") as HTMLSelectElement
  ).value;
  if (prop === "true" || prop === "false") {
    gridApi!.setGridOption(
      "suppressGroupChangesColumnVisibility",
      prop === "true",
    );
  } else {
    gridApi!.setGridOption(
      "suppressGroupChangesColumnVisibility",
      prop as "suppressHideOnGroup" | "suppressShowOnUngroup",
    );
  }
}

function resetCols() {
  gridApi!.setGridOption("columnDefs", [
    { field: "country", enableRowGroup: true, hide: false },
    { field: "year", enableRowGroup: true, hide: false },
    { field: "athlete", minWidth: 180, hide: false },
    { field: "total", hide: false },
  ]);
}

// setup the grid after the page has finished loading
const gridDiv = document.querySelector<HTMLElement>("#myGrid")!;
gridApi = createGrid(gridDiv, gridOptions);

fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
  .then((response) => response.json())
  .then((data: IOlympicData[]) => gridApi!.setGridOption("rowData", data));

if (typeof window !== "undefined") {
  // Attach external event handlers to window so they can be called from index.html
  (<any>window).onPropertyChange = onPropertyChange;
  (<any>window).resetCols = resetCols;
}
