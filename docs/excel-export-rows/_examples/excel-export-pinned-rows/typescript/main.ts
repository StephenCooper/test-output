import {
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  CsvExportModule,
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
  TextFilterModule,
  NumberFilterModule,
  PinnedRowModule,
  ClientSideRowModelModule,
  CsvExportModule,
  ExcelExportModule,
  ColumnMenuModule,
  ContextMenuModule,
  ValidationModule /* Development Only */,
]);

const columnDefs: ColGroupDef[] = [
  {
    headerName: "Top Level Column Group",
    children: [
      {
        headerName: "Group A",
        children: [
          { field: "athlete", minWidth: 200 },
          { field: "country", minWidth: 200 },
          { headerName: "Group", valueGetter: "data.country.charAt(0)" },
        ],
      },
      {
        headerName: "Group B",
        children: [
          { field: "date", minWidth: 150 },
          { field: "sport", minWidth: 150 },
          { field: "gold" },
          { field: "silver" },
          { field: "bronze" },
          { field: "total" },
        ],
      },
    ],
  },
];

let gridApi: GridApi<IOlympicData>;

const gridOptions: GridOptions<IOlympicData> = {
  defaultColDef: {
    filter: true,
    minWidth: 100,
    flex: 1,
  },

  columnDefs: columnDefs,
  popupParent: document.body,

  pinnedTopRowData: [
    {
      athlete: "Floating <Top> Athlete",
      country: "Floating <Top> Country",
      date: "01/08/2020",
      sport: "Track & Field",
      gold: 22,
      silver: 3,
      bronze: 44,
      total: 69,
    } as any,
  ],

  pinnedBottomRowData: [
    {
      athlete: "Floating <Bottom> Athlete",
      country: "Floating <Bottom> Country",
      date: "01/08/2030",
      sport: "Track & Field",
      gold: 222,
      silver: 5,
      bronze: 244,
      total: 471,
    } as any,
  ],
};

function getBoolean(id: string) {
  return !!(document.querySelector("#" + id) as HTMLInputElement).checked;
}

function getParams() {
  return {
    skipPinnedTop: getBoolean("skipPinnedTop"),
    skipPinnedBottom: getBoolean("skipPinnedBottom"),
  };
}

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
