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
  NumberFilterModule,
  ClientSideRowModelModule,
  CsvExportModule,
  ExcelExportModule,
  ColumnMenuModule,
  ContextMenuModule,
  ValidationModule /* Development Only */,
]);

let gridApi: GridApi<IOlympicData>;

const gridOptions: GridOptions<IOlympicData> = {
  columnDefs: [
    {
      headerName: "Athlete",
      children: [
        { field: "athlete", filter: true },
        { field: "age" },
        { field: "country", filter: true },
      ],
    },
    {
      headerName: "Medals",
      children: [{ field: "gold" }, { field: "silver" }, { field: "bronze" }],
    },
    { field: "total" },
  ],
  defaultColDef: {
    filter: false,
    minWidth: 100,
    flex: 1,
  },
  defaultExcelExportParams: {
    exportAsExcelTable: true,
  },
};

function onBtExport() {
  gridApi!.exportDataAsExcel();
}

const gridDiv = document.querySelector<HTMLElement>("#myGrid")!;
gridApi = createGrid(gridDiv, gridOptions);

fetch("https://www.ag-grid.com/example-assets/small-olympic-winners.json")
  .then((response) => response.json())
  .then(function (data) {
    gridApi!.setGridOption("rowData", data);
  });

if (typeof window !== "undefined") {
  // Attach external event handlers to window so they can be called from index.html
  (<any>window).onBtExport = onBtExport;
}
