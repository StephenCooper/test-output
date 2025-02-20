import {
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  GridApi,
  GridOptions,
  ICellRendererParams,
  ModuleRegistry,
  RowGroupingDisplayType,
  ValidationModule,
  createGrid,
} from "ag-grid-community";
import { RowGroupingModule } from "ag-grid-enterprise";
import { IOlympicData } from "./interfaces";

ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  RowGroupingModule,
  ValidationModule /* Development Only */,
]);

let gridApi: GridApi<IOlympicData>;

const gridOptions: GridOptions<IOlympicData> = {
  columnDefs: [
    { field: "country", rowGroup: true, hide: true },
    { field: "year", rowGroup: true, hide: true },
    { field: "athlete" },
    { field: "sport" },
    { field: "total" },
  ],
  defaultColDef: {
    flex: 1,
    minWidth: 100,
  },
  groupDisplayType: "groupRows",
};

// setup the grid after the page has finished loading
const gridDiv = document.querySelector<HTMLElement>("#myGrid")!;
gridApi = createGrid(gridDiv, gridOptions);

fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
  .then((response) => response.json())
  .then(function (data) {
    gridApi!.setGridOption("rowData", data);
  });
