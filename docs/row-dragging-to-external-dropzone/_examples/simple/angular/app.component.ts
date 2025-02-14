import { Component } from "@angular/core";
import { AgGridAngular } from "ag-grid-angular";
import "./style.css";
import {
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ModuleRegistry,
  RowClassRules,
  RowDragModule,
  RowDropZoneParams,
  RowStyleModule,
  TextFilterModule,
  ValidationModule,
  createGrid,
} from "ag-grid-community";
ModuleRegistry.registerModules([
  TextFilterModule,
  RowDragModule,
  RowStyleModule,
  ClientSideRowModelModule,
  ValidationModule /* Development Only */,
]);

@Component({
  selector: "my-app",
  standalone: true,
  imports: [AgGridAngular],
  template: `<div class="example-wrapper">
    <div class="toolbar">
      <label
        ><input type="checkbox" /> Enable suppressMoveWhenRowDragging</label
      >
    </div>
    <div class="drop-containers">
      <div class="grid-wrapper">
        <ag-grid-angular
          style="width: 100%; height: 100%;"
          [columnDefs]="columnDefs"
          [defaultColDef]="defaultColDef"
          [rowClassRules]="rowClassRules"
          [rowData]="rowData"
          [rowDragManaged]="true"
          (gridReady)="onGridReady($event)"
        />
      </div>
      <div class="drop-col">
        <span id="eDropTarget" class="drop-target">==&gt; Drop to here</span>
        <div class="tile-container"></div>
      </div>
    </div>
  </div> `,
})
export class AppComponent {
  columnDefs: ColDef[] = [
    { field: "id", rowDrag: true },
    { field: "color" },
    { field: "value1" },
    { field: "value2" },
  ];
  defaultColDef: ColDef = {
    filter: true,
    flex: 1,
  };
  rowClassRules: RowClassRules = {
    "red-row": 'data.color == "Red"',
    "green-row": 'data.color == "Green"',
    "blue-row": 'data.color == "Blue"',
  };
  rowData: any[] | null = createRowData();

  onGridReady(params: GridReadyEvent) {
    addDropZones(params);
    addCheckboxListener(params);
  }
}

let rowIdSequence = 100;
function addCheckboxListener(params: GridReadyEvent) {
  const checkbox = document.querySelector("input[type=checkbox]")! as any;
  checkbox.addEventListener("change", () => {
    params.api.setGridOption("suppressMoveWhenRowDragging", checkbox.checked);
  });
}
function createRowData() {
  const data: any[] = [];
  [
    "Red",
    "Green",
    "Blue",
    "Red",
    "Green",
    "Blue",
    "Red",
    "Green",
    "Blue",
  ].forEach((color) => {
    const newDataItem = {
      id: rowIdSequence++,
      color: color,
      value1: Math.floor(Math.random() * 100),
      value2: Math.floor(Math.random() * 100),
    };
    data.push(newDataItem);
  });
  return data;
}
function createTile(data: any) {
  const el = document.createElement("div");
  el.classList.add("tile");
  el.classList.add(data.color.toLowerCase());
  el.innerHTML =
    '<div class="id">' +
    data.id +
    "</div>" +
    '<div class="value">' +
    data.value1 +
    "</div>" +
    '<div class="value">' +
    data.value2 +
    "</div>";
  return el;
}
function addDropZones(params: GridReadyEvent) {
  const tileContainer = document.querySelector(".tile-container") as any;
  const dropZone: RowDropZoneParams = {
    getContainer: () => {
      return tileContainer as any;
    },
    onDragStop: (params) => {
      const tile = createTile(params.node.data);
      tileContainer.appendChild(tile);
    },
  };
  params.api.addRowDropZone(dropZone);
}
