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
import { getData } from "./data";

ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  ValidationModule /* Development Only */,
]);

let gridApi: GridApi;

const gridOptions: GridOptions = {
  // define grid columns
  columnDefs: [
    { headerName: "Name (field)", field: "name" },
    // Using dot notation to access nested property
    { headerName: "Country (field & dot notation)", field: "person.country" },
    // Show default header name
    {
      headerName: "Total Medals (valueGetter)",
      valueGetter: (p) =>
        p.data.medals.gold + p.data.medals.silver + p.data.medals.bronze,
    },
  ],
  defaultColDef: {
    flex: 1,
  },
  rowData: getData(),
};

const gridDiv = document.querySelector<HTMLElement>("#myGrid")!;
gridApi = createGrid(gridDiv, gridOptions);
