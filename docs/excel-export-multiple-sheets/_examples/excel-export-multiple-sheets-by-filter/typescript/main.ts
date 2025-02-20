import {
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  GridApi,
  GridOptions,
  ModuleRegistry,
  NumberFilterModule,
  RowApiModule,
  ValidationModule,
  createGrid,
} from "ag-grid-community";
import {
  ColumnMenuModule,
  ContextMenuModule,
  ExcelExportModule,
  SetFilterModule,
} from "ag-grid-enterprise";
import { IOlympicData } from "./interfaces";

ModuleRegistry.registerModules([
  NumberFilterModule,
  RowApiModule,
  ClientSideRowModelModule,
  ExcelExportModule,
  ColumnMenuModule,
  ContextMenuModule,
  SetFilterModule,
  ValidationModule /* Development Only */,
]);

const columnDefs: ColDef[] = [
  { field: "athlete", minWidth: 200 },
  { field: "age" },
  { field: "country", minWidth: 200 },
  { field: "year" },
  { field: "date", minWidth: 150 },
  { field: "sport", minWidth: 150 },
  { field: "gold" },
  { field: "silver" },
];

let gridApi: GridApi<IOlympicData>;

const gridOptions: GridOptions<IOlympicData> = {
  defaultColDef: {
    filter: true,
    minWidth: 100,
    flex: 1,
  },

  columnDefs: columnDefs,
};

function onBtExport() {
  const sports: Record<string, boolean> = {};

  gridApi!.forEachNode(function (node) {
    if (!sports[node.data!.sport]) {
      sports[node.data!.sport] = true;
    }
  });

  let spreadsheets: string[] = [];

  const performExport = async () => {
    for (const sport in sports) {
      await gridApi!.setColumnFilterModel("sport", { values: [sport] });
      gridApi!.onFilterChanged();

      if (gridApi!.getColumnFilterModel("sport") == null) {
        throw new Error("Example error: Filter not applied");
      }

      const sheet = gridApi!.getSheetDataForExcel({
        sheetName: sport,
      });
      if (sheet) {
        spreadsheets.push(sheet);
      }
    }

    await gridApi!.setColumnFilterModel("sport", null);
    gridApi!.onFilterChanged();

    gridApi!.exportMultipleSheetsAsExcel({
      data: spreadsheets,
      fileName: "ag-grid.xlsx",
    });

    spreadsheets = [];
  };

  performExport();
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
