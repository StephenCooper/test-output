import "./style.css";
import {
  AllCommunityModule,
  ColDef,
  ColGroupDef,
  GridApi,
  GridOptions,
  ModuleRegistry,
  SideBarDef,
  Theme,
  createGrid,
  themeQuartz,
} from "ag-grid-community";
import { AllEnterpriseModule } from "ag-grid-enterprise";
import { IOlympicData } from "./interfaces";

import "./style.css";

ModuleRegistry.registerModules([AllCommunityModule, AllEnterpriseModule]);

const columnDefs: ColDef[] = [
  { field: "athlete", minWidth: 170 },
  { field: "age" },
  { field: "country" },
  { field: "year" },
  { field: "date" },
];

let gridApi: GridApi<IOlympicData>;

const myTheme = themeQuartz.withParams({
  fontFamily: "serif",
  headerFontFamily: "Brush Script MT",
  cellFontFamily: "monospace",
});

const gridOptions: GridOptions<IOlympicData> = {
  theme: myTheme,
  columnDefs: columnDefs,
  defaultColDef: {
    editable: true,
    filter: true,
    enableRowGroup: true,
    enablePivot: true,
    enableValue: true,
  },
  sideBar: true,
};

// setup the grid after the page has finished loading
const gridDiv = document.querySelector<HTMLElement>("#myGrid")!;
gridApi = createGrid(gridDiv, gridOptions);

fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
  .then((response) => response.json())
  .then((data: IOlympicData[]) => gridApi!.setGridOption("rowData", data));
