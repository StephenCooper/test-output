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
import { CustomInnerHeaderGroup } from "./customInnerHeaderGroup";
import { IOlympicData } from "./interfaces";

ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  ValidationModule /* Development Only */,
]);

const columnDefs: ColGroupDef[] = [
  {
    headerName: "Athlete Details",
    headerGroupComponentParams: {
      innerHeaderGroupComponent: CustomInnerHeaderGroup,
      icon: "fa-user",
    },
    children: [
      { field: "athlete", width: 150 },
      { field: "age", width: 90, columnGroupShow: "open" },
      {
        field: "country",
        width: 120,
        columnGroupShow: "open",
      },
    ],
  },
  {
    headerName: "Medal details",
    headerGroupComponentParams: {
      innerHeaderGroupComponent: CustomInnerHeaderGroup,
    },
    children: [
      { field: "year", width: 90 },
      { field: "date", width: 110 },
      {
        field: "sport",
        width: 110,
        columnGroupShow: "open",
      },
      {
        field: "gold",
        width: 100,
        columnGroupShow: "open",
      },
      {
        field: "silver",
        width: 100,
        columnGroupShow: "open",
      },
      {
        field: "bronze",
        width: 100,
        columnGroupShow: "open",
      },
      {
        field: "total",
        width: 100,
        columnGroupShow: "open",
      },
    ],
  },
];

let gridApi: GridApi<IOlympicData>;

const gridOptions: GridOptions<IOlympicData> = {
  columnDefs: columnDefs,
  defaultColDef: {
    width: 100,
  },
};

const gridDiv = document.querySelector<HTMLElement>("#myGrid")!;
gridApi = createGrid(gridDiv, gridOptions);

fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
  .then((response) => response.json())
  .then((data: IOlympicData[]) => gridApi!.setGridOption("rowData", data));
