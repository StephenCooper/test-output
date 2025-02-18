import {
  ColDef,
  ColGroupDef,
  GridApi,
  GridOptions,
  ModuleRegistry,
  Theme,
  createGrid,
  themeQuartz,
} from "ag-grid-community";
import { AllEnterpriseModule } from "ag-grid-enterprise";
import { IOlympicData } from "./interfaces";

ModuleRegistry.registerModules([AllEnterpriseModule]);

// Set a blue background and red shadows for all menus
const myTheme = themeQuartz.withParams({
  menuBackgroundColor: "cornflowerblue",
  menuShadow: { radius: 10, spread: 5, color: "red" },
});

const columnDefs: ColDef[] = [
  { field: "athlete", minWidth: 170 },
  { field: "age", filter: "agNumberColumnFilter" },
  { field: "country" },
  { field: "year", filter: "agNumberColumnFilter" },
  { field: "date", filter: "agDateColumnFilter" },
  { field: "sport" },
  { field: "gold", filter: "agNumberColumnFilter" },
  { field: "silver", filter: "agNumberColumnFilter" },
  { field: "bronze", filter: "agNumberColumnFilter" },
  { field: "total", filter: "agNumberColumnFilter" },
];

let gridApi: GridApi<IOlympicData>;

const gridOptions: GridOptions<IOlympicData> = {
  theme: myTheme,
  columnDefs: columnDefs,
  defaultColDef: {
    filter: true,
  },
};

const gridDiv = document.querySelector<HTMLElement>("#myGrid")!;
gridApi = createGrid(gridDiv, gridOptions);

fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
  .then((response) => response.json())
  .then((data: IOlympicData[]) => gridApi!.setGridOption("rowData", data));
