import {
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  GridApi,
  GridOptions,
  ModuleRegistry,
  PinnedRowModule,
  RowClassParams,
  RowStyle,
  ValidationModule,
  createGrid,
} from "ag-grid-community";
import { CustomPinnedRowRenderer } from "./customPinnedRowRenderer";
import { IOlympicData } from "./interfaces";

ModuleRegistry.registerModules([
  PinnedRowModule,
  ClientSideRowModelModule,
  ValidationModule /* Development Only */,
]);

const columnDefs: ColDef[] = [
  { field: "athlete" },
  { field: "country" },
  { field: "sport" },
];

let gridApi: GridApi<IOlympicData>;

const gridOptions: GridOptions<IOlympicData> = {
  defaultColDef: {
    flex: 1,
  },
  columnDefs: columnDefs,
  rowData: null,
  // no rows to pin to start with
  pinnedTopRowData: [
    {
      athlete: "TOP (athlete)",
      country: "TOP (country)",
      sport: "TOP (sport)",
    },
  ],
  pinnedBottomRowData: [
    {
      athlete: "BOTTOM (athlete)",
      country: "BOTTOM (country)",
      sport: "BOTTOM (sport)",
    },
  ],
};

const gridDiv = document.querySelector<HTMLElement>("#myGrid")!;
gridApi = createGrid(gridDiv, gridOptions);

fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
  .then((response) => response.json())
  .then((data: IOlympicData[]) => gridApi!.setGridOption("rowData", data));
