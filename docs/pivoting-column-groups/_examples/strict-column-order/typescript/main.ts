import {
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  GetRowIdFunc,
  GridApi,
  GridOptions,
  ModuleRegistry,
  ValidationModule,
  createGrid,
} from "ag-grid-community";
import { PivotModule } from "ag-grid-enterprise";
import { getData } from "./data";

ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  PivotModule,
  ValidationModule /* Development Only */,
]);

let gridApi: GridApi;

let count = 0;

const gridOptions: GridOptions = {
  columnDefs: [
    { field: "pivotValue", pivot: true },
    { field: "agg", aggFunc: "sum", rowGroup: true },
  ],
  defaultColDef: {
    width: 130,
  },
  autoGroupColumnDef: {
    minWidth: 100,
  },
  pivotMode: true,
  getRowId: (p) => String(p.data.pivotValue),

  onGridReady: () => {
    setInterval(() => {
      count += 1;
      const rowData = getData();
      gridApi.setGridOption(
        "rowData",
        rowData.slice(0, (count % rowData.length) + 1),
      );
    }, 1000);
  },
};

function toggleOption() {
  const isChecked = document.querySelector<HTMLInputElement>(
    "#enableStrictPivotColumnOrder",
  )!.checked;
  gridApi.setGridOption("enableStrictPivotColumnOrder", isChecked);
}

// setup the grid after the page has finished loading
const gridDiv = document.querySelector<HTMLElement>("#myGrid")!;
gridApi = createGrid(gridDiv, gridOptions);

if (typeof window !== "undefined") {
  // Attach external event handlers to window so they can be called from index.html
  (<any>window).toggleOption = toggleOption;
}
