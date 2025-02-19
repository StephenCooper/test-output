import {
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  CsvExportModule,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ModuleRegistry,
  NumberFilterModule,
  RowSelectionModule,
  RowSelectionOptions,
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
  RowSelectionModule,
  ClientSideRowModelModule,
  CsvExportModule,
  ExcelExportModule,
  ColumnMenuModule,
  ContextMenuModule,
  ValidationModule /* Development Only */,
]);

const columnDefs: ColDef[] = [
  { field: "athlete", minWidth: 200 },
  { field: "country", minWidth: 200 },
  { headerName: "Group", valueGetter: "data.country.charAt(0)" },
  { field: "sport", minWidth: 150 },
  { field: "gold", hide: true },
  { field: "silver", hide: true },
  { field: "bronze", hide: true },
  { field: "total", hide: true },
];

let gridApi: GridApi<IOlympicData>;

const gridOptions: GridOptions<IOlympicData> = {
  defaultColDef: {
    filter: true,
    minWidth: 100,
    flex: 1,
  },
  columnDefs: columnDefs,
  rowSelection: {
    mode: "multiRow",
    headerCheckbox: false,
  },
  onGridReady: (params: GridReadyEvent) => {
    (document.getElementById("selectedOnly") as HTMLInputElement).checked =
      true;
  },
};

function onBtExport() {
  gridApi!.exportDataAsExcel({
    onlySelected: (document.querySelector("#selectedOnly") as HTMLInputElement)
      .checked,
  });
}

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
