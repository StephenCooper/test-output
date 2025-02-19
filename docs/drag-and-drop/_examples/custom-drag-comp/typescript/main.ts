import {
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
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
import { DragSourceRenderer } from "./dragSourceRenderer";

ModuleRegistry.registerModules([
  TextFilterModule,
  RowDragModule,
  RowStyleModule,
  ClientSideRowModelModule,
  ValidationModule /* Development Only */,
]);

const rowClassRules = {
  "red-row": 'data.color == "Red"',
  "green-row": 'data.color == "Green"',
  "blue-row": 'data.color == "Blue"',
};

let gridApi: GridApi;

const gridOptions: GridOptions = {
  defaultColDef: {
    width: 80,
    filter: true,
  },
  rowClassRules: rowClassRules,
  rowData: getData(),
  rowDragManaged: true,
  columnDefs: [
    { cellRenderer: DragSourceRenderer, minWidth: 100 },
    { field: "id" },
    { field: "color" },
    { field: "value1" },
    { field: "value2" },
  ],
};

function onDragOver(event: any) {
  const types = event.dataTransfer.types;

  const dragSupported = types.length;

  if (dragSupported) {
    event.dataTransfer.dropEffect = "move";
  }

  event.preventDefault();
}

function onDrop(event: any) {
  event.preventDefault();

  const textData = event.dataTransfer.getData("text/plain");
  const eJsonRow = document.createElement("div");
  eJsonRow.classList.add("json-row");
  eJsonRow.innerText = textData;

  const eJsonDisplay = document.querySelector("#eJsonDisplay")!;
  eJsonDisplay.appendChild(eJsonRow);
}

const gridDiv = document.querySelector<HTMLElement>("#myGrid")!;
gridApi = createGrid(gridDiv, gridOptions);

if (typeof window !== "undefined") {
  // Attach external event handlers to window so they can be called from index.html
  (<any>window).onDragOver = onDragOver;
  (<any>window).onDrop = onDrop;
}
