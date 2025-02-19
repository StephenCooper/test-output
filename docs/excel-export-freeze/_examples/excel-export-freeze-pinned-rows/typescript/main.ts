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
  PinnedRowModule,
  TextFilterModule,
  ValidationModule,
  createGrid,
} from "ag-grid-community";
import {
  ColumnMenuModule,
  ContextMenuModule,
  ExcelExportModule,
} from "ag-grid-enterprise";
import { IOlympicData } from "./interfaces";

ModuleRegistry.registerModules([
  PinnedRowModule,
  ClientSideRowModelModule,
  CsvExportModule,
  ExcelExportModule,
  ColumnMenuModule,
  ContextMenuModule,
  TextFilterModule,
  NumberFilterModule,
  ValidationModule /* Development Only */,
]);

const columnDefs: (ColDef | ColGroupDef)[] = [
  {
    headerName: "Athlete Details",
    children: [
      {
        field: "athlete",
        width: 180,
        filter: "agTextColumnFilter",
      },
      {
        field: "age",
        width: 90,
        filter: "agNumberColumnFilter",
      },
      { headerName: "Country", field: "country", width: 140 },
    ],
  },
  {
    headerName: "Sports Results",
    children: [
      { field: "sport", width: 140 },
      {
        columnGroupShow: "closed",
        field: "total",
        width: 100,
        filter: "agNumberColumnFilter",
      },
      {
        columnGroupShow: "open",
        field: "gold",
        width: 100,
        filter: "agNumberColumnFilter",
      },
      {
        columnGroupShow: "open",
        field: "silver",
        width: 100,
        filter: "agNumberColumnFilter",
      },
      {
        columnGroupShow: "open",
        field: "bronze",
        width: 100,
        filter: "agNumberColumnFilter",
      },
    ],
  },
];

let gridApi: GridApi<IOlympicData>;

const gridOptions: GridOptions<IOlympicData> = {
  // debug: true,
  columnDefs: columnDefs,
  pinnedTopRowData: [
    {
      athlete: "TOP (athlete)",
      country: "TOP (country)",
      sport: "TOP (sport)",
    },
  ],
  pinnedBottomRowData: [
    {
      athlete: "BOTTOM (athlete)",
      country: "BOTTOM (country)",
      sport: "BOTTOM (sport)",
    },
  ],
  defaultExcelExportParams: {
    freezeRows: "headersAndPinnedRows",
  },
};

function onBtExport() {
  gridApi!.exportDataAsExcel();
}

const gridDiv = document.querySelector<HTMLElement>("#myGrid")!;
gridApi = createGrid(gridDiv, gridOptions);

fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
  .then((response) => response.json())
  .then((data: IOlympicData[]) => gridApi!.setGridOption("rowData", data));

if (typeof window !== "undefined") {
  // Attach external event handlers to window so they can be called from index.html
  (<any>window).onBtExport = onBtExport;
}
