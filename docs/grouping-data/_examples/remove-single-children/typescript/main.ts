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
  RowGroupingModule,
  SetFilterModule,
} from "ag-grid-enterprise";
import { getData } from "./data";

ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  ColumnsToolPanelModule,
  ColumnMenuModule,
  ContextMenuModule,
  RowGroupingModule,
  SetFilterModule,
  ValidationModule /* Development Only */,
]);

let gridApi: GridApi;

const gridOptions: GridOptions = {
  columnDefs: [
    { field: "athlete" },
    { field: "country", rowGroup: true },
    { field: "city", rowGroup: true },
    { field: "year" },
    { field: "gold", aggFunc: "sum" },
    { field: "silver", aggFunc: "sum" },
    { field: "bronze", aggFunc: "sum" },
  ],
  defaultColDef: {
    flex: 1,
    minWidth: 150,
  },
  autoGroupColumnDef: {
    headerName: "Group",
    field: "athlete",
    minWidth: 220,
    cellRenderer: "agGroupCellRenderer",
  },
  rowData: getData(),

  // expand everything by default
  groupDefaultExpanded: -1,

  suppressAggFuncInHeader: true,
};

function onOptionChange() {
  const key = (
    document.querySelector("#input-display-type") as HTMLSelectElement
  ).value;
  if (key === "true" || key === "false") {
    gridApi!.setGridOption("groupHideParentOfSingleChild", key === "true");
  } else {
    gridApi!.setGridOption("groupHideParentOfSingleChild", "leafGroupsOnly");
  }
}

// setup the grid after the page has finished loading
const gridDiv = document.querySelector<HTMLElement>("#myGrid")!;
gridApi = createGrid(gridDiv, gridOptions);

if (typeof window !== "undefined") {
  // Attach external event handlers to window so they can be called from index.html
  (<any>window).onOptionChange = onOptionChange;
}
