import {
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  GridApi,
  GridOptions,
  ModuleRegistry,
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
  RowSelectionModule,
  ClientSideRowModelModule,
  ColumnsToolPanelModule,
  ColumnMenuModule,
  ContextMenuModule,
  RowGroupingModule,
  ValidationModule /* Development Only */,
]);

let gridApi: GridApi<IOlympicData>;

const gridOptions: GridOptions<IOlympicData> = {
  columnDefs: [
    { field: "athlete" },
    { field: "sport" },
    { field: "year", maxWidth: 120 },
  ],
  defaultColDef: {
    flex: 1,
    minWidth: 100,
  },
  rowSelection: {
    mode: "singleRow",
    hideDisabledCheckboxes: true,
    isRowSelectable: (rowNode) =>
      rowNode.data ? rowNode.data.year < 2007 : false,
  },
};

function toggleHideCheckbox() {
  gridApi.setGridOption("rowSelection", {
    mode: "singleRow",
    isRowSelectable: (rowNode) =>
      rowNode.data ? rowNode.data.year < 2007 : false,
    hideDisabledCheckboxes: getCheckboxValue("#toggle-hide-checkbox"),
  });
}

const gridDiv = document.querySelector<HTMLElement>("#myGrid")!;
gridApi = createGrid(gridDiv, gridOptions);

fetch("https://www.ag-grid.com/example-assets/small-olympic-winners.json")
  .then((response) => response.json())
  .then((data: IOlympicData[]) => gridApi!.setGridOption("rowData", data));

function getCheckboxValue(id: string): boolean {
  return document.querySelector<HTMLInputElement>(id)?.checked ?? false;
}

if (typeof window !== "undefined") {
  // Attach external event handlers to window so they can be called from index.html
  (<any>window).toggleHideCheckbox = toggleHideCheckbox;
}
