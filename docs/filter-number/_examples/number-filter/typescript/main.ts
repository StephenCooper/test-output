import {
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  GridApi,
  GridOptions,
  INumberFilterParams,
  ModuleRegistry,
  NumberFilterModule,
  TextFilterModule,
  ValidationModule,
  ValueFormatterParams,
  createGrid,
} from "ag-grid-community";
import { getData } from "./data";

ModuleRegistry.registerModules([
  TextFilterModule,
  ClientSideRowModelModule,
  NumberFilterModule,
  ValidationModule /* Development Only */,
]);

const numberValueFormatter = function (params: ValueFormatterParams) {
  return params.value.toFixed(2);
};

const saleFilterParams: INumberFilterParams = {
  allowedCharPattern: "\\d\\-\\,\\$",
  numberParser: (text: string | null) => {
    return text == null
      ? null
      : parseFloat(text.replace(",", ".").replace("$", ""));
  },
  numberFormatter: (value: number | null) => {
    return value == null ? null : value.toString().replace(".", ",");
  },
};

const saleValueFormatter = function (params: ValueFormatterParams) {
  const formatted = params.value.toFixed(2).replace(".", ",");

  if (formatted.indexOf("-") === 0) {
    return "-$" + formatted.slice(1);
  }

  return "$" + formatted;
};

const columnDefs: ColDef[] = [
  {
    field: "sale",
    headerName: "Sale ($)",
    filter: "agNumberColumnFilter",
    floatingFilter: true,
    valueFormatter: numberValueFormatter,
  },
  {
    field: "sale",
    headerName: "Sale",
    filter: "agNumberColumnFilter",
    floatingFilter: true,
    filterParams: saleFilterParams,
    valueFormatter: saleValueFormatter,
  },
];

let gridApi: GridApi;

const gridOptions: GridOptions = {
  columnDefs: columnDefs,
  defaultColDef: {
    flex: 1,
    minWidth: 150,
  },
  rowData: getData(),
};

const gridDiv = document.querySelector<HTMLElement>("#myGrid")!;
gridApi = createGrid(gridDiv, gridOptions);
