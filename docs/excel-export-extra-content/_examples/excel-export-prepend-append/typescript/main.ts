import {
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  ExcelExportParams,
  ExcelRow,
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
  ExcelExportModule,
  ColumnMenuModule,
  ContextMenuModule,
  ValidationModule /* Development Only */,
]);

let gridApi: GridApi<IOlympicData>;

const gridOptions: GridOptions<IOlympicData> = {
  columnDefs: [
    { field: "athlete", minWidth: 200 },
    { field: "country", minWidth: 200 },
    { field: "sport", minWidth: 150 },
    { field: "gold" },
    { field: "silver" },
    { field: "bronze" },
    { field: "total" },
  ],

  defaultColDef: {
    filter: true,
    minWidth: 100,
    flex: 1,
  },

  popupParent: document.body,
};

const getRows: () => ExcelRow[] = () => [
  { cells: [] },
  {
    cells: [
      {
        data: {
          value: 'Here is a comma, and a some "quotes".',
          type: "String",
        },
      },
    ],
  },
  {
    cells: [
      {
        data: {
          value:
            "They are visible when the downloaded file is opened in Excel because custom content is properly escaped.",
          type: "String",
        },
      },
    ],
  },
  {
    cells: [
      { data: { value: "this cell:", type: "String" }, mergeAcross: 1 },
      {
        data: {
          value: "is empty because the first cell has mergeAcross=1",
          type: "String",
        },
      },
    ],
  },
  { cells: [] },
];

const getBoolean = (inputSelector: string) =>
  !!(document.querySelector(inputSelector) as HTMLInputElement).checked;

const getParams: () => ExcelExportParams = () => ({
  prependContent: getBoolean("#prependContent") ? getRows() : undefined,
  appendContent: getBoolean("#appendContent") ? getRows() : undefined,
});

function onBtExport() {
  gridApi!.exportDataAsExcel(getParams());
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
