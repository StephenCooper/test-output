import {
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  GridApi,
  GridOptions,
  ModuleRegistry,
  RowSelectedEvent,
  RowSelectionModule,
  RowSelectionOptions,
  SelectionChangedEvent,
  ValidationModule,
  createGrid,
} from "ag-grid-community";
import { IOlympicData } from "./interfaces";

ModuleRegistry.registerModules([
  RowSelectionModule,
  ClientSideRowModelModule,
  ValidationModule /* Development Only */,
]);

let gridApi: GridApi<IOlympicData>;

const gridOptions: GridOptions<IOlympicData> = {
  columnDefs: [
    { field: "athlete", minWidth: 150 },
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
  },
  rowSelection: { mode: "multiRow", headerCheckbox: false },
  onRowSelected,
  onSelectionChanged,
};

function onRowSelected(event: RowSelectedEvent) {
  console.log(
    "row " + event.node.data.athlete + " selected = " + event.node.isSelected(),
  );
}

function onSelectionChanged(event: SelectionChangedEvent) {
  const rowCount = event.api.getSelectedNodes().length;
  console.log("selection changed, " + rowCount + " rows selected");
}

// setup the grid after the page has finished loading
const gridDiv = document.querySelector<HTMLElement>("#myGrid")!;
gridApi = createGrid(gridDiv, gridOptions);

fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
  .then((response) => response.json())
  .then((data: IOlympicData[]) => gridApi!.setGridOption("rowData", data));
