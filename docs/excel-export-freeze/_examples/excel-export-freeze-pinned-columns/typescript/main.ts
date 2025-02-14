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
  TextFilterModule,
  ClientSideRowModelModule,
  CsvExportModule,
  ExcelExportModule,
  ColumnMenuModule,
  ContextMenuModule,
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
        pinned: "left",
      },
      {
        field: "age",
        width: 90,
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
  defaultColDef: {
    filter: true,
  },
  // debug: true,
  columnDefs: columnDefs,
  defaultExcelExportParams: {
    freezeColumns: "pinned",
  },
};

function onBtExport() {
  gridApi!.exportDataAsExcel();
}

// setup the grid after the page has finished loading
const gridDiv = document.querySelector<HTMLElement>("#myGrid")!;
gridApi = createGrid(gridDiv, gridOptions);

fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
  .then((response) => response.json())
  .then((data: IOlympicData[]) => gridApi!.setGridOption("rowData", data));

if (typeof window !== "undefined") {
  // Attach external event handlers to window so they can be called from index.html
  (<any>window).onBtExport = onBtExport;
}
