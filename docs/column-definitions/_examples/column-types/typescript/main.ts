import {
  CellStyleModule,
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  ColTypeDef,
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

interface SalesRecord {
  productName: string;
  boughtPrice: number;
  soldPrice: number;
}

function currencyFormatter(params: ValueFormatterParams) {
  const value = Math.floor(params.value);
  if (isNaN(value)) {
    return "";
  }
  return "£" + value.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
}

const gridOptions: GridOptions<SalesRecord> = {
  // define column types
  columnTypes: {
    currency: {
      width: 150,
      valueFormatter: currencyFormatter,
    },
    shaded: {
      cellClass: "shaded-class",
    },
  },
  // define grid columns
  columnDefs: [
    { field: "productName" },
    // uses properties from currency type
    { field: "boughtPrice", type: "currency" },
    // uses properties from currency AND shaded types
    { field: "soldPrice", type: ["currency", "shaded"] },
  ],

  rowData: [
    { productName: "Lamp", boughtPrice: 100, soldPrice: 200 },
    { productName: "Chair", boughtPrice: 150, soldPrice: 300 },
    { productName: "Desk", boughtPrice: 200, soldPrice: 400 },
  ],
};

// setup the grid after the page has finished loading
const gridDiv = document.querySelector<HTMLElement>("#myGrid")!;
const gridApi = createGrid(gridDiv, gridOptions);
