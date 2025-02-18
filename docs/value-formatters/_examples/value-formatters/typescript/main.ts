import {
  CellStyleModule,
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  GridApi,
  GridOptions,
  ModuleRegistry,
  ValidationModule,
  ValueFormatterParams,
  createGrid,
} from "ag-grid-community";

ModuleRegistry.registerModules([
  CellStyleModule,
  ClientSideRowModelModule,
  ValidationModule /* Development Only */,
]);

let gridApi: GridApi;

const gridOptions: GridOptions = {
  columnDefs: [
    { headerName: "A", field: "a" },
    { headerName: "B", field: "b" },
    { headerName: "£A", field: "a", valueFormatter: currencyFormatter },
    { headerName: "£B", field: "b", valueFormatter: currencyFormatter },
    { headerName: "(A)", field: "a", valueFormatter: bracketsFormatter },
    { headerName: "(B)", field: "b", valueFormatter: bracketsFormatter },
  ],
  defaultColDef: {
    flex: 1,
    cellClass: "number-cell",
  },
  rowData: createRowData(),
};

function bracketsFormatter(params: ValueFormatterParams) {
  return "(" + params.value + ")";
}

function currencyFormatter(params: ValueFormatterParams) {
  return "£" + formatNumber(params.value);
}

function formatNumber(number: number) {
  return Math.floor(number).toLocaleString();
}

function createRowData() {
  const rowData = [];

  for (let i = 0; i < 100; i++) {
    rowData.push({
      a: Math.floor(((i + 2) * 173456) % 10000),
      b: Math.floor(((i + 7) * 373456) % 10000),
    });
  }

  return rowData;
}

const gridDiv = document.querySelector<HTMLElement>("#myGrid")!;
gridApi = createGrid(gridDiv, gridOptions);
