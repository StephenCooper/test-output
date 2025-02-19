import {
  CellSelectionOptions,
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  GridApi,
  GridOptions,
  ModuleRegistry,
  StatusPanelDef,
  ValidationModule,
  createGrid,
} from "ag-grid-community";
import { CellSelectionModule, StatusBarModule } from "ag-grid-enterprise";
import { IOlympicData } from "./interfaces";

ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  CellSelectionModule,
  StatusBarModule,
  ValidationModule /* Development Only */,
]);

let gridApi: GridApi<IOlympicData>;

const gridOptions: GridOptions<IOlympicData> = {
  columnDefs: [
    { field: "athlete", minWidth: 200 },
    { field: "age" },
    { field: "country", minWidth: 200 },
    { field: "year" },
    { field: "date", minWidth: 180 },
    { field: "sport", minWidth: 200 },
    { field: "gold" },
    { field: "silver" },
    { field: "bronze" },
    { field: "total" },
  ],
  defaultColDef: {
    flex: 1,
    minWidth: 100,
  },
  statusBar: {
    statusPanels: [
      {
        statusPanel: "agTotalRowCountComponent",
        align: "left",
      },
      {
        statusPanel: "agAggregationComponent",
        statusPanelParams: {
          aggFuncs: ["avg", "sum"],
        },
      },
    ],
  },
  cellSelection: true,
};

const gridDiv = document.querySelector<HTMLElement>("#myGrid")!;
gridApi = createGrid(gridDiv, gridOptions);

fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
  .then((response) => response.json())
  .then((data: IOlympicData[]) => gridApi!.setGridOption("rowData", data));
