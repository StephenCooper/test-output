import {
  CellSelectionOptions,
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  GridApi,
  GridOptions,
  ModuleRegistry,
  TextEditorModule,
  ValidationModule,
  ValueFormatterParams,
  ValueParserParams,
  createGrid,
} from "ag-grid-community";
import {
  CellSelectionModule,
  ClipboardModule,
  ColumnMenuModule,
  ContextMenuModule,
  ExcelExportModule,
} from "ag-grid-enterprise";

ModuleRegistry.registerModules([
  TextEditorModule,
  ClientSideRowModelModule,
  ClipboardModule,
  ExcelExportModule,
  ColumnMenuModule,
  ContextMenuModule,
  CellSelectionModule,
  ValidationModule /* Development Only */,
]);

let gridApi: GridApi;

const gridOptions: GridOptions = {
  columnDefs: [
    {
      headerName: "£A",
      field: "a",
      valueFormatter: currencyFormatter,
      valueParser: currencyParser,
    },
    {
      headerName: "£B",
      field: "b",
      valueFormatter: currencyFormatter,
      valueParser: currencyParser,
    },
  ],
  defaultColDef: {
    cellDataType: false,
    editable: true,
  },
  rowData: createRowData(),
  cellSelection: {
    handle: {
      mode: "fill",
    },
  },
};

function currencyFormatter(params: ValueFormatterParams) {
  return params.value == null ? "" : "£" + params.value;
}

function currencyParser(params: ValueParserParams) {
  let value = params.newValue;
  if (value == null || value === "") {
    return null;
  }
  value = String(value);

  if (value.startsWith("£")) {
    value = value.slice(1);
  }
  return parseFloat(value);
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
