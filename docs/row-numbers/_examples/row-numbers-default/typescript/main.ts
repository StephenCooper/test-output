import {
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  GridApi,
  GridOptions,
  ModuleRegistry,
  RowNumbersOptions,
  ValidationModule,
  createGrid,
} from "ag-grid-community";
import { RowNumbersModule } from "ag-grid-enterprise";
import { IOlympicData } from "./interfaces";

ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  RowNumbersModule,
  ValidationModule /* Development Only */,
]);

const columnDefs: ColDef[] = [
  { field: "athlete" },
  { field: "country" },
  { field: "sport" },
  { field: "year" },
  { field: "gold" },
  { field: "silver" },
  { field: "bronze" },
];

let gridApi: GridApi<IOlympicData>;

const gridOptions: GridOptions<IOlympicData> = {
  defaultColDef: {
    flex: 1,
    minWidth: 100,
  },
  rowNumbers: true,
  columnDefs: columnDefs,
  rowData: null,
};

// setup the grid after the page has finished loading
const gridDiv = document.querySelector<HTMLElement>("#myGrid")!;
gridApi = createGrid(gridDiv, gridOptions);

fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
  .then((response) => response.json())
  .then((data) => {
    gridApi!.setGridOption("rowData", data);
  });
