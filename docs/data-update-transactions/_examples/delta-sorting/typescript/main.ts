import {
  ClientSideRowModelApiModule,
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  GetRowIdFunc,
  GetRowIdParams,
  GridApi,
  GridOptions,
  ModuleRegistry,
  ValidationModule,
  createGrid,
} from "ag-grid-community";
import { RowGroupingModule } from "ag-grid-enterprise";

ModuleRegistry.registerModules([
  ClientSideRowModelApiModule,
  ClientSideRowModelModule,
  RowGroupingModule,
  ValidationModule /* Development Only */,
]);

let lastGen = 0;
const generateItem = (id = lastGen++) => {
  return {
    id,
    sort: Math.floor(Math.random() * 3 + 2000),
    sort1: Math.floor(Math.random() * 3 + 2000),
    sort2: Math.floor(Math.random() * 100000 + 2000),
  };
};

const getRowData = (rows = 10) =>
  new Array(rows).fill(undefined).map((_) => generateItem());

let gridApi: GridApi;

const gridOptions: GridOptions = {
  columnDefs: [
    { field: "id" },
    { field: "updatedBy" },
    { field: "sort", sortIndex: 0, sort: "desc" },
    { field: "sort1", sortIndex: 1, sort: "desc" },
    { field: "sort2", sortIndex: 2, sort: "desc" },
  ],
  defaultColDef: {
    flex: 1,
  },
  rowData: getRowData(100000),
  deltaSort: true,
  getRowId: ({ data }: GetRowIdParams) => String(data.id),
};

function addDelta() {
  const transaction = {
    add: getRowData(1).map((row) => ({ ...row, updatedBy: "delta" })),
    update: [{ id: 1, make: "Delta", updatedBy: "delta" }],
  };
  gridApi!.setGridOption("deltaSort", true);
  const startTime = new Date().getTime();
  gridApi!.applyTransaction(transaction);
  document.getElementById("transactionDuration")!.textContent =
    `${new Date().getTime() - startTime} ms`;
}

function addDefault() {
  const transaction = {
    add: getRowData(1).map((row) => ({ ...row, updatedBy: "default" })),
    update: [{ id: 2, make: "Default", updatedBy: "default" }],
  };
  gridApi!.setGridOption("deltaSort", false);
  const startTime = new Date().getTime();
  gridApi!.applyTransaction(transaction);
  document.getElementById("transactionDuration")!.textContent =
    `${new Date().getTime() - startTime} ms`;
}

const eGridDiv = document.querySelector<HTMLElement>("#myGrid")!;
gridApi = createGrid(eGridDiv, gridOptions);

if (typeof window !== "undefined") {
  // Attach external event handlers to window so they can be called from index.html
  (<any>window).addDelta = addDelta;
  (<any>window).addDefault = addDefault;
}
