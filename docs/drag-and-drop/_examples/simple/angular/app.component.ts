import { Component } from "@angular/core";
import { AgGridAngular } from "ag-grid-angular";
import "./style.css";
import {
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  DragAndDropModule,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ModuleRegistry,
  RowClassRules,
  RowDragModule,
  RowStyleModule,
  TextFilterModule,
  ValidationModule,
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

@Component({
  selector: "my-app",
  standalone: true,
  imports: [AgGridAngular],
  template: `<div class="outer">
    <div class="grid-col">
      <ag-grid-angular
        style="width: 100%; height: 100%;"
        [columnDefs]="columnDefs"
        [defaultColDef]="defaultColDef"
        [rowClassRules]="rowClassRules"
        [rowData]="rowData"
        [rowDragManaged]="true"
      />
    </div>

    <div
      class="drop-col"
      (dragover)="onDragOver($event)"
      (drop)="onDrop($event)"
    >
      <span id="eDropTarget" class="drop-target"> ==&gt; Drop to here </span>
      <div id="eJsonDisplay" class="json-display"></div>
    </div>
  </div> `,
})
export class AppComponent {
  columnDefs: ColDef[] = [
    { valueGetter: "'Drag'", dndSource: true },
    { field: "id" },
    { field: "color" },
    { field: "value1" },
    { field: "value2" },
  ];
  defaultColDef: ColDef = {
    width: 80,
    filter: true,
  };
  rowClassRules: RowClassRules = {
    "red-row": 'data.color == "Red"',
    "green-row": 'data.color == "Green"',
    "blue-row": 'data.color == "Blue"',
  };
  rowData: any[] | null = getData();

  onDragOver(event: any) {
    const dragSupported = event.dataTransfer.length;
    if (dragSupported) {
      event.dataTransfer.dropEffect = "move";
    }
    event.preventDefault();
  }

  onDrop(event: any) {
    const jsonData = event.dataTransfer.getData("application/json");
    const eJsonRow = document.createElement("div");
    eJsonRow.classList.add("json-row");
    eJsonRow.innerText = jsonData;
    const eJsonDisplay = document.querySelector("#eJsonDisplay")!;
    eJsonDisplay.appendChild(eJsonRow);
    event.preventDefault();
  }
}
