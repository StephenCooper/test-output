import { Component } from "@angular/core";
import { AgGridAngular } from "ag-grid-angular";
import "./styles.css";
import {
  CellSelectionOptions,
  CellValueChangedEvent,
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  GridApi,
  GridOptions,
  GridReadyEvent,
  HighlightChangesModule,
  ModuleRegistry,
  RedoEndedEvent,
  RedoStartedEvent,
  TextEditorModule,
  UndoEndedEvent,
  UndoRedoEditModule,
  UndoStartedEvent,
  ValidationModule,
} from "ag-grid-community";
import { CellSelectionModule, ClipboardModule } from "ag-grid-enterprise";
ModuleRegistry.registerModules([
  UndoRedoEditModule,
  TextEditorModule,
  HighlightChangesModule,
  ClientSideRowModelModule,
  ClipboardModule,
  CellSelectionModule,
  ValidationModule /* Development Only */,
]);

@Component({
  selector: "my-app",
  standalone: true,
  imports: [AgGridAngular],
  template: `<div class="example-wrapper">
    <div>
      <span class="button-group">
        <label>Available Undo's</label>
        <input id="undoInput" class="undo-redo-input" />
        <label>Available Redo's</label>
        <input id="redoInput" class="undo-redo-input" />
        <button id="undoBtn" class="undo-btn" (click)="undo()">Undo</button>
        <button id="redoBtn" class="redo-btn" (click)="redo()">Redo</button>
      </span>
    </div>
    <ag-grid-angular
      style="width: 100%; height: 100%;"
      [columnDefs]="columnDefs"
      [defaultColDef]="defaultColDef"
      [rowData]="rowData"
      [cellSelection]="cellSelection"
      [undoRedoCellEditing]="true"
      [undoRedoCellEditingLimit]="undoRedoCellEditingLimit"
      (firstDataRendered)="onFirstDataRendered($event)"
      (cellValueChanged)="onCellValueChanged($event)"
      (undoStarted)="onUndoStarted($event)"
      (undoEnded)="onUndoEnded($event)"
      (redoStarted)="onRedoStarted($event)"
      (redoEnded)="onRedoEnded($event)"
      (gridReady)="onGridReady($event)"
    />
  </div> `,
})
export class AppComponent {
  private gridApi!: GridApi;

  columnDefs: ColDef[] = [
    { field: "a" },
    { field: "b" },
    { field: "c" },
    { field: "d" },
    { field: "e" },
    { field: "f" },
    { field: "g" },
    { field: "h" },
  ];
  defaultColDef: ColDef = {
    flex: 1,
    editable: true,
    enableCellChangeFlash: true,
  };
  rowData: any[] | null = getRows();
  cellSelection: boolean | CellSelectionOptions = {
    handle: {
      mode: "fill",
    },
  };
  undoRedoCellEditingLimit = 5;

  onFirstDataRendered() {
    setValue("#undoInput", 0);
    disable("#undoInput", true);
    disable("#undoBtn", true);
    setValue("#redoInput", 0);
    disable("#redoInput", true);
    disable("#redoBtn", true);
  }

  onCellValueChanged(params: CellValueChangedEvent) {
    console.log("cellValueChanged", params);
    const undoSize = params.api.getCurrentUndoSize();
    setValue("#undoInput", undoSize);
    disable("#undoBtn", undoSize < 1);
    const redoSize = params.api.getCurrentRedoSize();
    setValue("#redoInput", redoSize);
    disable("#redoBtn", redoSize < 1);
  }

  onUndoStarted(event: UndoStartedEvent) {
    console.log("undoStarted", event);
  }

  onUndoEnded(event: UndoEndedEvent) {
    console.log("undoEnded", event);
  }

  onRedoStarted(event: RedoStartedEvent) {
    console.log("redoStarted", event);
  }

  onRedoEnded(event: RedoEndedEvent) {
    console.log("redoEnded", event);
  }

  undo() {
    this.gridApi.undoCellEditing();
  }

  redo() {
    this.gridApi.redoCellEditing();
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }
}

function disable(id: string, disabled: boolean) {
  (document.querySelector(id) as any).disabled = disabled;
}
function setValue(id: string, value: number) {
  (document.querySelector(id) as any).value = value;
}
function getRows() {
  return Array.apply(null, Array(100)).map(function (_, i) {
    return {
      a: "a-" + i,
      b: "b-" + i,
      c: "c-" + i,
      d: "d-" + i,
      e: "e-" + i,
      f: "f-" + i,
      g: "g-" + i,
      h: "h-" + i,
    };
  });
}
