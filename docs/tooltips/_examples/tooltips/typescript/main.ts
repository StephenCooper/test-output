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

const columnDefs: (ColDef | ColGroupDef)[] = [
  {
    headerName: "Athlete",
    field: "athlete",
    // here the Athlete column will tooltip the Country value
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
    headerName: "Hover For Tooltip",
    headerTooltip: "Column Groups can have Tooltips also",
    children: [
      {
        field: "sport",
        tooltipValueGetter: () => "Tooltip text about Sport should go here",
        headerTooltip: "Tooltip for Sport Column Header",
      },
    ],
  },
];

let gridApi: GridApi<IOlympicData>;

const gridOptions: GridOptions<IOlympicData> = {
  defaultColDef: {
    flex: 1,
    minWidth: 100,
  },
  columnDefs: columnDefs,
  tooltipShowDelay: 500,
};

// setup the grid after the page has finished loading
const gridDiv = document.querySelector<HTMLElement>("#myGrid")!;
gridApi = createGrid(gridDiv, gridOptions);

fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
  .then((response) => response.json())
  .then((data) => {
    gridApi!.setGridOption("rowData", data);
  });
