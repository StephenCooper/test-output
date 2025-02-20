import {
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  GridApi,
  GridOptions,
  GridPreDestroyedEvent,
  GridStateModule,
  ModuleRegistry,
  NumberFilterModule,
  PaginationModule,
  RowSelectionModule,
  RowSelectionOptions,
  SideBarDef,
  StateUpdatedEvent,
  ValidationModule,
  createGrid,
} from "ag-grid-community";
import {
  CellSelectionModule,
  ColumnsToolPanelModule,
  FiltersToolPanelModule,
  PivotModule,
  SetFilterModule,
} from "ag-grid-enterprise";
import { IOlympicData } from "./interfaces";

ModuleRegistry.registerModules([
  NumberFilterModule,
  GridStateModule,
  PaginationModule,
  ClientSideRowModelModule,
  ColumnsToolPanelModule,
  FiltersToolPanelModule,
  RowSelectionModule,
  CellSelectionModule,
  SetFilterModule,
  PivotModule,
  ValidationModule /* Development Only */,
]);

let gridApi: GridApi<IOlympicData>;

const gridOptions: GridOptions<IOlympicData> = {
  columnDefs: [
    {
      field: "athlete",
      minWidth: 150,
    },
    { field: "age", maxWidth: 90 },
    { field: "country", minWidth: 150 },
    { field: "year", maxWidth: 90 },
    { field: "date", minWidth: 150 },
    { field: "sport", minWidth: 150 },
    { field: "gold" },
    { field: "silver" },
    { field: "bronze" },
    { field: "total" },
  ],
  defaultColDef: {
    flex: 1,
    minWidth: 100,
    filter: true,
    enableRowGroup: true,
    enablePivot: true,
    enableValue: true,
  },
  sideBar: true,
  pagination: true,
  rowSelection: { mode: "multiRow" },
  suppressColumnMoveAnimation: true,
  onGridPreDestroyed: onGridPreDestroyed,
  onStateUpdated: onStateUpdated,
};

function onGridPreDestroyed(event: GridPreDestroyedEvent<IOlympicData>): void {
  console.log("Grid state on destroy (can be persisted)", event.state);
}

function onStateUpdated(event: StateUpdatedEvent<IOlympicData>): void {
  console.log("State updated", event.state);
}

function reloadGrid() {
  const state = gridApi.getState();

  gridApi.destroy();

  const gridDiv = document.querySelector<HTMLElement>("#myGrid")!;

  gridOptions.initialState = state;

  gridApi = createGrid(gridDiv, gridOptions);

  fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
    .then((response) => response.json())
    .then((data) => gridApi.setGridOption("rowData", data));
}

function printState() {
  console.log("Grid state", gridApi.getState());
}

// setup the grid after the page has finished loading
const gridDiv = document.querySelector<HTMLElement>("#myGrid")!;
gridApi = createGrid(gridDiv, gridOptions);

fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
  .then((response) => response.json())
  .then((data: IOlympicData[]) => gridApi!.setGridOption("rowData", data));

if (typeof window !== "undefined") {
  // Attach external event handlers to window so they can be called from index.html
  (<any>window).reloadGrid = reloadGrid;
  (<any>window).printState = printState;
}
