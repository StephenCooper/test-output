import {
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  DragAndDropModule,
  GridApi,
  GridOptions,
  ModuleRegistry,
  RowClassRules,
  RowDragModule,
  RowStyleModule,
  TextFilterModule,
  ValidationModule,
  createGrid,
} from "ag-grid-community";
import { getData } from "./data";

ModuleRegistry.registerModules([
  DragAndDropModule,
  TextFilterModule,
  RowDragModule,
  RowStyleModule,
  ClientSideRowModelModule,
  ValidationModule /* Development Only */,
]);

const columnDefs: ColDef[] = [
  { valueGetter: "'Drag'", dndSource: true },
  { field: "id" },
  { field: "color" },
  { field: "value1" },
  { field: "value2" },
];

let gridApi: GridApi;

const gridOptions: GridOptions = {
  defaultColDef: {
    width: 80,
    filter: true,
  },
  rowClassRules: {
    "red-row": 'data.color == "Red"',
    "green-row": 'data.color == "Green"',
    "blue-row": 'data.color == "Blue"',
  },
  rowData: getData(),
  rowDragManaged: true,
  columnDefs: columnDefs,
};

function onDragOver(event: any) {
  const dragSupported = event.dataTransfer.length;

  if (dragSupported) {
    event.dataTransfer.dropEffect = "move";
  }

  event.preventDefault();
}

function onDrop(event: any) {
  const jsonData = event.dataTransfer.getData("application/json");

  const eJsonRow = document.createElement("div");
  eJsonRow.classList.add("json-row");
  eJsonRow.innerText = jsonData;

  const eJsonDisplay = document.querySelector("#eJsonDisplay")!;

  eJsonDisplay.appendChild(eJsonRow);
  event.preventDefault();
}

// setup the grid after the page has finished loading
const gridDiv = document.querySelector<HTMLElement>("#myGrid")!;
gridApi = createGrid(gridDiv, gridOptions);

if (typeof window !== "undefined") {
  // Attach external event handlers to window so they can be called from index.html
  (<any>window).onDragOver = onDragOver;
  (<any>window).onDrop = onDrop;
}
