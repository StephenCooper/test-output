import {
  CellStyleModule,
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  ExcelExportParams,
  ExcelStyle,
  GridApi,
  GridOptions,
  ModuleRegistry,
  ValidationModule,
  createGrid,
} from "ag-grid-community";
import {
  ColumnMenuModule,
  ContextMenuModule,
  ExcelExportModule,
} from "ag-grid-enterprise";

ModuleRegistry.registerModules([
  CellStyleModule,
  ClientSideRowModelModule,
  ExcelExportModule,
  ColumnMenuModule,
  ContextMenuModule,
  ValidationModule /* Development Only */,
]);

let gridApi: GridApi;

const gridOptions: GridOptions = {
  columnDefs: [{ field: "company" }, { field: "url", cellClass: "hyperlinks" }],
  defaultColDef: {
    flex: 1,
    minWidth: 100,
  },
  defaultExcelExportParams: {
    autoConvertFormulas: true,
    processCellCallback: (params) => {
      const field = params.column.getColDef().field;
      return field === "url" ? `=HYPERLINK("${params.value}")` : params.value;
    },
  },
  excelStyles: [
    {
      id: "hyperlinks",
      font: {
        underline: "Single",
        color: "#358ccb",
      },
    },
  ],

  rowData: [
    { company: "Google", url: "https://www.google.com" },
    { company: "Adobe", url: "https://www.adobe.com" },
    { company: "The New York Times", url: "https://www.nytimes.com" },
    { company: "Twitter", url: "https://www.twitter.com" },
    { company: "StackOverflow", url: "https://stackoverflow.com/" },
    { company: "Reddit", url: "https://www.reddit.com" },
    { company: "GitHub", url: "https://www.github.com" },
    { company: "Microsoft", url: "https://www.microsoft.com" },
    { company: "Gizmodo", url: "https://www.gizmodo.com" },
    { company: "LinkedIN", url: "https://www.linkedin.com" },
  ],
};

function onBtExport() {
  gridApi!.exportDataAsExcel();
}

const gridDiv = document.querySelector<HTMLElement>("#myGrid")!;
gridApi = createGrid(gridDiv, gridOptions);

if (typeof window !== "undefined") {
  // Attach external event handlers to window so they can be called from index.html
  (<any>window).onBtExport = onBtExport;
}
