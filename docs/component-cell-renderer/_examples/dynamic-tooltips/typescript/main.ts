import {
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  GridApi,
  GridOptions,
  ModuleRegistry,
  TextEditorModule,
  TextFilterModule,
  TooltipModule,
  ValidationModule,
  createGrid,
} from "ag-grid-community";
import { AthleteCellRenderer } from "./athleteCellRenderer";
import { IOlympicData } from "./interfaces";

ModuleRegistry.registerModules([
  TextEditorModule,
  TextFilterModule,
  ClientSideRowModelModule,
  TooltipModule,
  ValidationModule /* Development Only */,
]);

const columnDefs: ColDef[] = [
  { field: "athlete", width: 120, cellRenderer: AthleteCellRenderer },
  { field: "country", width: 150 },
];

let gridApi: GridApi<IOlympicData>;

const gridOptions: GridOptions<IOlympicData> = {
  columnDefs: columnDefs,
  defaultColDef: {
    editable: true,
    minWidth: 100,
    filter: true,
  },
};

// setup the grid after the page has finished loading
const gridDiv = document.querySelector<HTMLElement>("#myGrid")!;
gridApi = createGrid(gridDiv, gridOptions);

fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
  .then((response) => response.json())
  .then((data) => {
    gridApi!.setGridOption("rowData", data);
  });
