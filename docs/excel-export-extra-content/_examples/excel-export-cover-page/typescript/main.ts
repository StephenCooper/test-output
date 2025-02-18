import {
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  CsvExportModule,
  ExcelStyle,
  GridApi,
  GridOptions,
  ModuleRegistry,
  NumberFilterModule,
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
  ClientSideRowModelModule,
  CsvExportModule,
  ExcelExportModule,
  ColumnMenuModule,
  ContextMenuModule,
  SetFilterModule,
  ValidationModule /* Development Only */,
]);

let gridApi: GridApi<IOlympicData>;

const gridOptions: GridOptions<IOlympicData> = {
  defaultColDef: {
    filter: true,
    minWidth: 100,
    flex: 1,
  },

  columnDefs: [
    { field: "athlete", minWidth: 200 },
    { field: "country", minWidth: 200 },
    { field: "sport", minWidth: 150 },
    { field: "gold", hide: true },
    { field: "silver", hide: true },
    { field: "bronze", hide: true },
    { field: "total", hide: true },
  ],

  excelStyles: [
    {
      id: "coverHeading",
      font: {
        size: 26,
        bold: true,
      },
    },
    {
      id: "coverText",
      font: {
        size: 14,
      },
    },
  ],
};

function onBtExport() {
  const performExport = async () => {
    const spreadsheets = [];

    //set a filter condition ensuring no records are returned so only the header content is exported
    await gridApi!.setColumnFilterModel("athlete", {
      values: [],
    });

    gridApi!.onFilterChanged();

    //export custom content for cover page
    spreadsheets.push(
      gridApi!.getSheetDataForExcel({
        prependContent: [
          {
            cells: [
              {
                styleId: "coverHeading",
                mergeAcross: 3,
                data: { value: "AG Grid", type: "String" },
              },
            ],
          },
          {
            cells: [
              {
                styleId: "coverHeading",
                mergeAcross: 3,
                data: { value: "", type: "String" },
              },
            ],
          },
          {
            cells: [
              {
                styleId: "coverText",
                mergeAcross: 3,
                data: {
                  value:
                    "Data shown lists Olympic medal winners for years 2000-2012",
                  type: "String",
                },
              },
            ],
          },
          {
            cells: [
              {
                styleId: "coverText",
                data: {
                  value:
                    "This data includes a row for each participation record - athlete name, country, year, sport, count of gold, silver, bronze medals won during the sports event",
                  type: "String",
                },
              },
            ],
          },
        ],
        processHeaderCallback: () => "",
        sheetName: "cover",
      })!,
    );

    //remove filter condition set above so all the grid data can be exported on a separate sheet
    await gridApi.setColumnFilterModel("athlete", null);
    gridApi!.onFilterChanged();

    spreadsheets.push(gridApi!.getSheetDataForExcel()!);

    gridApi!.exportMultipleSheetsAsExcel({
      data: spreadsheets,
      fileName: "ag-grid.xlsx",
    });
  };
  performExport();
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
