import {
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  GridApi,
  GridOptions,
  ITooltipParams,
  ModuleRegistry,
  TooltipModule,
  ValidationModule,
  createGrid,
} from "ag-grid-community";
import { IOlympicData } from "./interfaces";

ModuleRegistry.registerModules([
  TooltipModule,
  ClientSideRowModelModule,
  ValidationModule /* Development Only */,
]);

const columnDefs: ColDef[] = [
  {
    headerName: "Athlete",
    field: "athlete",
    tooltipComponentParams: { color: "#55AA77" },
    tooltipField: "country",
    headerTooltip: "Tooltip for Athlete Column Header",
  },
  {
    field: "age",
    tooltipValueGetter: (p: ITooltipParams) =>
      "Create any fixed message, e.g. This is the Athlete’s Age ",
    headerTooltip: "Tooltip for Age Column Header",
  },
  {
    field: "year",
    tooltipValueGetter: (p: ITooltipParams) =>
      "This is a dynamic tooltip using the value of " + p.value,
    headerTooltip: "Tooltip for Year Column Header",
  },
  {
    field: "sport",
    tooltipValueGetter: () => "Tooltip text about Sport should go here",
    headerTooltip: "Tooltip for Sport Column Header",
  },
];

let gridApi: GridApi<IOlympicData>;

const gridOptions: GridOptions<IOlympicData> = {
  defaultColDef: {
    flex: 1,
    minWidth: 100,
  },
  tooltipShowDelay: 500,
  tooltipMouseTrack: true,
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
