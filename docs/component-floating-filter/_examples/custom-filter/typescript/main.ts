import {
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  CustomFilterModule,
  GridApi,
  GridOptions,
  ModuleRegistry,
  ValidationModule,
  createGrid,
} from "ag-grid-community";
import { NumberFilterComponent } from "./numberFilterComponent";
import { IOlympicData } from "./interfaces";

ModuleRegistry.registerModules([
  CustomFilterModule,
  ClientSideRowModelModule,
  ValidationModule /* Development Only */,
]);

const columnDefs: ColDef[] = [
  { field: "athlete", width: 150, filter: false },
  {
    field: "gold",
    width: 100,
    filter: NumberFilterComponent,
    suppressHeaderMenuButton: true,
  },
  {
    field: "silver",
    width: 100,
    filter: NumberFilterComponent,
    suppressHeaderMenuButton: true,
  },
  {
    field: "bronze",
    width: 100,
    filter: NumberFilterComponent,
    suppressHeaderMenuButton: true,
  },
  {
    field: "total",
    width: 100,
    filter: NumberFilterComponent,
    suppressHeaderMenuButton: true,
  },
];

let gridApi: GridApi<IOlympicData>;

const gridOptions: GridOptions<IOlympicData> = {
  defaultColDef: {
    flex: 1,
    minWidth: 100,
    filter: true,
    floatingFilter: true,
  },
  columnDefs: columnDefs,
};

// setup the grid after the page has finished loading
const gridDiv = document.querySelector<HTMLElement>("#myGrid")!;
gridApi = createGrid(gridDiv, gridOptions);

fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
  .then((response) => response.json())
  .then((data) => {
    gridApi!.setGridOption("rowData", data);
  });
