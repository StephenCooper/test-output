import {
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  CustomFilterModule,
  GridApi,
  GridOptions,
  ModuleRegistry,
  NumberFilterModule,
  TextFilterModule,
  ValidationModule,
  createGrid,
} from "ag-grid-community";
import { NumberFilterComponent } from "./numberFilterComponent";
import { NumberFloatingFilterComponent } from "./numberFloatingFilterComponent";
import { IOlympicData } from "./interfaces";

ModuleRegistry.registerModules([
  NumberFilterModule,
  ClientSideRowModelModule,
  TextFilterModule,
  CustomFilterModule,
  ValidationModule /* Development Only */,
]);

const columnDefs: ColDef[] = [
  { field: "athlete", filter: "agTextColumnFilter" },
  {
    field: "gold",
    floatingFilterComponent: NumberFloatingFilterComponent,
    filter: NumberFilterComponent,
    suppressFloatingFilterButton: true,
  },
  {
    field: "silver",
    floatingFilterComponent: NumberFloatingFilterComponent,
    filter: NumberFilterComponent,
    suppressFloatingFilterButton: true,
  },
  {
    field: "bronze",
    floatingFilterComponent: NumberFloatingFilterComponent,
    filter: NumberFilterComponent,
    suppressFloatingFilterButton: true,
  },
  {
    field: "total",
    floatingFilterComponent: NumberFloatingFilterComponent,
    filter: NumberFilterComponent,
    suppressFloatingFilterButton: true,
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
  rowData: null,
};

const gridDiv = document.querySelector<HTMLElement>("#myGrid")!;
gridApi = createGrid(gridDiv, gridOptions);

fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
  .then((response) => response.json())
  .then((data) => {
    gridApi!.setGridOption("rowData", data);
  });
