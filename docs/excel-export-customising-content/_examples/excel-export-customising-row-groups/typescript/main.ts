import {
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  CsvExportModule,
  ExcelExportParams,
  GridApi,
  GridOptions,
  ModuleRegistry,
  NumberFilterModule,
  ProcessCellForExportParams,
  ProcessRowGroupForExportParams,
  UseGroupTotalRow,
  ValidationModule,
  createGrid,
} from "ag-grid-community";
import {
  ColumnMenuModule,
  ContextMenuModule,
  ExcelExportModule,
  RowGroupingModule,
  SetFilterModule,
} from "ag-grid-enterprise";
import { IOlympicData } from "./interfaces";

ModuleRegistry.registerModules([
  NumberFilterModule,
  ClientSideRowModelModule,
  CsvExportModule,
  ExcelExportModule,
  ColumnMenuModule,
  ContextMenuModule,
  RowGroupingModule,
  SetFilterModule,
  ValidationModule /* Development Only */,
]);

const getParams: () => ExcelExportParams = () => ({
  processCellCallback(params: ProcessCellForExportParams): string {
    const value = params.value;
    return value === undefined ? "" : `_${value}_`;
  },
  processRowGroupCallback(params: ProcessRowGroupForExportParams): string {
    const { node } = params;

    if (!node.footer) {
      return `row group: ${node.key}`;
    }
    const isRootLevel = node.level === -1;

    if (isRootLevel) {
      return "Grand Total";
    }
    return `Sub Total (${node.key})`;
  },
});

let gridApi: GridApi<IOlympicData>;

const gridOptions: GridOptions<IOlympicData> = {
  columnDefs: [
    { field: "athlete", minWidth: 200 },
    { field: "country", minWidth: 200, rowGroup: true, hide: true },
    { field: "sport", minWidth: 150 },
    { field: "gold", aggFunc: "sum" },
  ],

  defaultColDef: {
    filter: true,
    minWidth: 150,
    flex: 1,
  },

  groupTotalRow: "bottom",
  grandTotalRow: "bottom",

  popupParent: document.body,
  defaultExcelExportParams: getParams(),
};

function onBtExport() {
  gridApi!.exportDataAsExcel(getParams());
}

// setup the grid after the page has finished loading
const gridDiv = document.querySelector<HTMLElement>("#myGrid")!;
gridApi = createGrid(gridDiv, gridOptions);

fetch("https://www.ag-grid.com/example-assets/small-olympic-winners.json")
  .then((response) => response.json())
  .then((data) =>
    gridApi!.setGridOption(
      "rowData",
      data.filter((rec: any) => rec.country != null),
    ),
  );

if (typeof window !== "undefined") {
  // Attach external event handlers to window so they can be called from index.html
  (<any>window).onBtExport = onBtExport;
}
