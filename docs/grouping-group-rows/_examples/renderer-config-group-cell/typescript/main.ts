import {
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  GridApi,
  GridOptions,
  ModuleRegistry,
  RowGroupingDisplayType,
  RowSelectionModule,
  RowSelectionOptions,
  ValidationModule,
  createGrid,
} from "ag-grid-community";
import { RowGroupingModule } from "ag-grid-enterprise";
import { IOlympicData } from "./interfaces";

ModuleRegistry.registerModules([
  RowSelectionModule,
  ClientSideRowModelModule,
  RowGroupingModule,
  ValidationModule /* Development Only */,
]);

let gridApi: GridApi<IOlympicData>;

const gridOptions: GridOptions<IOlympicData> = {
  columnDefs: [
    { field: "country", rowGroup: true },
    { field: "athlete" },
    { field: "year" },
    { field: "sport" },
  ],
  defaultColDef: {
    flex: 1,
    minWidth: 100,
  },
  groupRowRendererParams: {
    suppressCount: true,
  },
  rowSelection: {
    mode: "singleRow",
    checkboxLocation: "autoGroupColumn",
  },
  groupDisplayType: "groupRows",
};

// setup the grid after the page has finished loading
var gridDiv = document.querySelector<HTMLElement>("#myGrid")!;
gridApi = createGrid(gridDiv, gridOptions);

fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
  .then((response) => response.json())
  .then((data: IOlympicData[]) => gridApi!.setGridOption("rowData", data));
