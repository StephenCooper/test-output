import {
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  GridApi,
  GridOptions,
  ModuleRegistry,
  NumberFilterModule,
  SideBarDef,
  TextFilterModule,
  ValidationModule,
  createGrid,
} from "ag-grid-community";
import {
  ColumnMenuModule,
  ColumnsToolPanelModule,
  ContextMenuModule,
  PivotModule,
  SetFilterModule,
} from "ag-grid-enterprise";
import { IOlympicData } from "./interfaces";

ModuleRegistry.registerModules([
  NumberFilterModule,
  ClientSideRowModelModule,
  ColumnsToolPanelModule,
  ColumnMenuModule,
  ContextMenuModule,
  PivotModule,
  SetFilterModule,
  TextFilterModule,
  ValidationModule /* Development Only */,
]);

const columnDefs: (ColDef | ColGroupDef)[] = [
  {
    headerName: "Athlete",
    children: [
      {
        field: "athlete",
        filter: "agTextColumnFilter",
        enableRowGroup: true,
        enablePivot: true,
        minWidth: 150,
      },
      { field: "age", enableRowGroup: true, enablePivot: true },
      {
        field: "country",
        enableRowGroup: true,
        enablePivot: true,
        minWidth: 125,
      },
    ],
  },
  {
    headerName: "Competition",
    children: [
      { field: "year", enableRowGroup: true, enablePivot: true },
      { field: "date", enableRowGroup: true, enablePivot: true, minWidth: 180 },
    ],
  },
  { field: "sport", enableRowGroup: true, enablePivot: true, minWidth: 125 },
  {
    headerName: "Medals",
    children: [
      { field: "gold", enableValue: true },
      { field: "silver", enableValue: true },
      { field: "bronze", enableValue: true },
      { field: "total", enableValue: true },
    ],
  },
];

let gridApi: GridApi<IOlympicData>;

const gridOptions: GridOptions<IOlympicData> = {
  columnDefs: columnDefs,
  defaultColDef: {
    flex: 1,
    minWidth: 100,
    filter: true,
  },
  autoGroupColumnDef: {
    minWidth: 200,
  },
  sideBar: "columns",
};

// setup the grid after the page has finished loading
const gridDiv = document.querySelector<HTMLElement>("#myGrid")!;
gridApi = createGrid(gridDiv, gridOptions);

fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
  .then((response) => response.json())
  .then((data: IOlympicData[]) => gridApi!.setGridOption("rowData", data));
