import {
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  DndSourceOnRowDragParams,
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
  columnDefs: [
    {
      valueGetter: "'Drag'",
      dndSource: true,
      dndSourceOnRowDrag: onRowDrag,
    },
    { field: "id" },
    { field: "color" },
    { field: "value1" },
    { field: "value2" },
  ],
};

function onDragOver(event: any) {
  const dragSupported = event.dataTransfer.types.length;

  if (dragSupported) {
    event.dataTransfer.dropEffect = "move";
  }

  event.preventDefault();
}

function onDrop(event: any) {
  event.preventDefault();
  const jsonData = event.dataTransfer.getData("application/json");

  const eJsonRow = document.createElement("div");
  eJsonRow.classList.add("json-row");
  eJsonRow.innerText = jsonData;

  const eJsonDisplay = document.querySelector("#eJsonDisplay")!;
  eJsonDisplay.appendChild(eJsonRow);
}

function onRowDrag(params: DndSourceOnRowDragParams) {
  // create the data that we want to drag
  const rowNode = params.rowNode;
  const e = params.dragEvent;
  const jsonObject = {
    grid: "GRID_001",
    operation: "Drag on Column",
    rowId: rowNode.data.id,
    selected: rowNode.isSelected(),
  };
  const jsonData = JSON.stringify(jsonObject);

  e.dataTransfer!.setData("application/json", jsonData);
  e.dataTransfer!.setData("text/plain", jsonData);
}

const gridDiv = document.querySelector<HTMLElement>("#myGrid")!;
gridApi = createGrid(gridDiv, gridOptions);

if (typeof window !== "undefined") {
  // Attach external event handlers to window so they can be called from index.html
  (<any>window).onDragOver = onDragOver;
  (<any>window).onDrop = onDrop;
}
