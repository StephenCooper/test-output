import {
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  GridApi,
  GridOptions,
  GroupSelectionMode,
  ModuleRegistry,
  QuickFilterModule,
  RowSelectionModule,
  RowSelectionOptions,
  ValidationModule,
  createGrid,
} from "ag-grid-community";
import {
  ColumnMenuModule,
  ColumnsToolPanelModule,
  ContextMenuModule,
  RowGroupingModule,
} from "ag-grid-enterprise";
import { IOlympicData } from "./interfaces";

ModuleRegistry.registerModules([
  QuickFilterModule,
  ClientSideRowModelModule,
  ColumnsToolPanelModule,
  ColumnMenuModule,
  ContextMenuModule,
  RowGroupingModule,
  RowSelectionModule,
  ValidationModule /* Development Only */,
]);

let gridApi: GridApi<IOlympicData>;

const gridOptions: GridOptions<IOlympicData> = {
  columnDefs: [
    { field: "country", rowGroup: true, hide: true },
    { field: "sport", rowGroup: true, hide: true },
    { field: "gold", aggFunc: "sum" },
    { field: "silver", aggFunc: "sum" },
    { field: "bronze", aggFunc: "sum" },
  ],
  defaultColDef: {
    flex: 1,
    minWidth: 100,
  },
  autoGroupColumnDef: {
    headerName: "Athlete",
    field: "athlete",
    minWidth: 250,
    cellRenderer: "agGroupCellRenderer",
  },
  rowSelection: {
    mode: "multiRow",
    groupSelects: "self",
  },
  suppressAggFuncInHeader: true,
};

// setup the grid after the page has finished loading
const gridDiv = document.querySelector<HTMLElement>("#myGrid")!;
gridApi = createGrid(gridDiv, gridOptions);

fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
  .then((response) => response.json())
  .then((data: IOlympicData[]) => gridApi!.setGridOption("rowData", data));

function getGroupSelectsValue(): GroupSelectionMode {
  return (
    (document.querySelector<HTMLSelectElement>("#input-group-selection-mode")
      ?.value as any) ?? "self"
  );
}

function onSelectionModeChange() {
  gridApi.setGridOption("rowSelection", {
    mode: "multiRow",
    groupSelects: getGroupSelectsValue(),
  });
}

function onQuickFilterChanged() {
  gridApi.setGridOption(
    "quickFilterText",
    document.querySelector<HTMLInputElement>("#input-quick-filter")?.value,
  );
}

if (typeof window !== "undefined") {
  // Attach external event handlers to window so they can be called from index.html
  (<any>window).onSelectionModeChange = onSelectionModeChange;
  (<any>window).onQuickFilterChanged = onQuickFilterChanged;
}
