import {
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  GridApi,
  GridOptions,
  ModuleRegistry,
  RowApiModule,
  TooltipModule,
  ValidationModule,
  createGrid,
} from "ag-grid-community";
import { CustomTooltip } from "./customTooltip";
import { IOlympicData } from "./interfaces";

ModuleRegistry.registerModules([
  TooltipModule,
  ClientSideRowModelModule,
  RowApiModule,
  ValidationModule /* Development Only */,
]);

const columnDefs: ColDef[] = [
  {
    field: "athlete",
    minWidth: 150,
    tooltipField: "athlete",
    tooltipComponentParams: { type: "success" },
  },
  { field: "age", minWidth: 130, tooltipField: "age" },
  { field: "year" },
  { field: "sport" },
];

let gridApi: GridApi<IOlympicData>;

const gridOptions: GridOptions<IOlympicData> = {
  defaultColDef: {
    flex: 1,
    minWidth: 100,
    tooltipComponent: CustomTooltip,
  },

  tooltipInteraction: true,
  tooltipShowDelay: 500,
  // set rowData to null or undefined to show loading panel by default
  rowData: null,
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
