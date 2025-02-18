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
  ContextMenuModule,
  FiltersToolPanelModule,
  SetFilterModule,
} from "ag-grid-enterprise";
import { IOlympicData } from "./interfaces";

ModuleRegistry.registerModules([
  NumberFilterModule,
  ClientSideRowModelModule,
  FiltersToolPanelModule,
  ColumnMenuModule,
  ContextMenuModule,
  SetFilterModule,
  TextFilterModule,
  ValidationModule /* Development Only */,
]);

let gridApi: GridApi<IOlympicData>;

const gridOptions: GridOptions<IOlympicData> = {
  columnDefs: [
    { field: "athlete", minWidth: 200, filter: "agTextColumnFilter" },
    { field: "age" },
    { field: "country", minWidth: 200 },
    { field: "year" },
    { field: "date", minWidth: 180 },
    { field: "gold", filter: false },
    { field: "silver", filter: false },
    { field: "bronze", filter: false },
    { field: "total", filter: false },
  ],
  defaultColDef: {
    flex: 1,
    minWidth: 100,
    filter: true,
  },
  sideBar: "filters",
};

const gridDiv = document.querySelector<HTMLElement>("#myGrid")!;
gridApi = createGrid(gridDiv, gridOptions);

fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
  .then((response) => response.json())
  .then((data: IOlympicData[]) => gridApi!.setGridOption("rowData", data));
