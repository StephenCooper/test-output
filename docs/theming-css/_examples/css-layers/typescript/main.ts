import {
  ColDef,
  ColGroupDef,
  GridApi,
  GridOptions,
  ModuleRegistry,
  SideBarDef,
  createGrid,
} from "ag-grid-community";
import { AllEnterpriseModule } from "ag-grid-enterprise";
import { IOlympicData } from "./interfaces";

ModuleRegistry.registerModules([AllEnterpriseModule]);

const columnDefs: ColDef[] = [
  { field: "athlete", minWidth: 170 },
  { field: "age" },
  { field: "country" },
  { field: "year" },
  { field: "date" },
  { field: "sport" },
  { field: "gold" },
  { field: "silver" },
  { field: "bronze" },
  { field: "total" },
];

let gridApi: GridApi<IOlympicData>;

const gridOptions: GridOptions<IOlympicData> = {
  columnDefs: columnDefs,
  defaultColDef: {
    editable: true,
    filter: true,
  },
  sideBar: "columns",
  animateRows: false,
  themeCssLayer: "grid",
};

// setup the grid after the page has finished loading
const gridDiv = document.querySelector<HTMLElement>("#myGrid")!;
gridApi = createGrid(gridDiv, gridOptions);

fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
  .then((response) => response.json())
  .then((data: IOlympicData[]) => gridApi!.setGridOption("rowData", data));
