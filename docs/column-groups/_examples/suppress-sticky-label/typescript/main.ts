import {
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  GridApi,
  GridOptions,
  ModuleRegistry,
  ValidationModule,
  createGrid,
} from "ag-grid-community";
import { IOlympicData } from "./interfaces";

ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  ValidationModule /* Development Only */,
]);

const columnDefs: (ColDef | ColGroupDef)[] = [
  {
    headerName: "Athlete Details",
    suppressStickyLabel: true,
    children: [
      { field: "athlete", pinned: true, colId: "athlete" },
      { field: "country", colId: "country" },
      { field: "age", colId: "age" },
    ],
  },
  {
    headerName: "Sports Results",
    suppressStickyLabel: true,
    openByDefault: true,
    children: [
      { field: "sport", colId: "sport" },
      { field: "gold", colId: "gold", columnGroupShow: "open" },
      { field: "silver", colId: "silver", columnGroupShow: "open" },
      { field: "bronze", colId: "bronze", columnGroupShow: "open" },
      { field: "total", colId: "total", columnGroupShow: "closed" },
    ],
  },
];

let gridApi: GridApi<IOlympicData>;

const gridOptions: GridOptions<IOlympicData> = {
  defaultColDef: {
    width: 200,
  },
  columnDefs: columnDefs,
};

const gridDiv = document.querySelector<HTMLElement>("#myGrid")!;
gridApi = createGrid(gridDiv, gridOptions);

fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
  .then((response) => response.json())
  .then((data: IOlympicData[]) => gridApi!.setGridOption("rowData", data));
