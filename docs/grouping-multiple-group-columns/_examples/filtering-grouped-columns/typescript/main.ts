import {
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  GridApi,
  GridOptions,
  ModuleRegistry,
  NumberFilterModule,
  RowGroupingDisplayType,
  TextFilterModule,
  ValidationModule,
  createGrid,
} from "ag-grid-community";
import {
  GroupFilterModule,
  RowGroupingModule,
  SetFilterModule,
} from "ag-grid-enterprise";
import { IOlympicData } from "./interfaces";

ModuleRegistry.registerModules([
  NumberFilterModule,
  ClientSideRowModelModule,
  RowGroupingModule,
  SetFilterModule,
  GroupFilterModule,
  TextFilterModule,
  ValidationModule /* Development Only */,
]);

let gridApi: GridApi<IOlympicData>;

const gridOptions: GridOptions<IOlympicData> = {
  columnDefs: [
    {
      field: "country",
      rowGroup: true,
      hide: true,
      filter: "agTextColumnFilter",
    },
    { field: "year", rowGroup: true, hide: true, filter: true },
    { field: "athlete" },
    { field: "sport" },
    { field: "total" },
  ],
  defaultColDef: {
    flex: 1,
    minWidth: 100,
  },
  autoGroupColumnDef: {
    minWidth: 200,
    filter: "agGroupColumnFilter",
    floatingFilter: true,
  },
  groupDefaultExpanded: 1,
  groupDisplayType: "multipleColumns",
};

// setup the grid after the page has finished loading
var gridDiv = document.querySelector<HTMLElement>("#myGrid")!;
gridApi = createGrid(gridDiv, gridOptions);

fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
  .then((response) => response.json())
  .then((data: IOlympicData[]) => gridApi!.setGridOption("rowData", data));
