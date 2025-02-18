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
  TextEditorModule,
  UndoRedoEditModule,
  ValidationModule,
  ValueFormatterParams,
  ValueGetterParams,
  ValueParserParams,
  ValueSetterParams,
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
      (gridReady)="onGridReady($event)"
    />
  </div> `,
})
export class AppComponent {
  private gridApi!: GridApi;

  columnDefs: ColDef[] = [
    {
      field: "a",
      valueFormatter: valueFormatterA,
      valueGetter: valueGetterA,
      valueParser: valueParserA,
      valueSetter: valueSetterA,
      equals: equalsA,
      cellDataType: "object",
    },
    {
      field: "b",
      valueFormatter: valueFormatterB,
      valueParser: valueParserB,
      cellDataType: "object",
    },
  ];
  defaultColDef: ColDef = {
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
    const undoSize = params.api.getCurrentUndoSize();
    setValue("#undoInput", undoSize);
    disable("#undoBtn", undoSize < 1);
    const redoSize = params.api.getCurrentRedoSize();
    setValue("#redoInput", redoSize);
    disable("#redoBtn", redoSize < 1);
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

function createValueA(value: string, data: any) {
  return value == null
    ? null
    : {
        actualValueA: value,
        anotherPropertyA: data.anotherPropertyA,
      };
}
function valueFormatterA(params: ValueFormatterParams) {
  // Convert complex object to string
  return params.value ? params.value.actualValueA : "";
}
function valueGetterA(params: ValueGetterParams) {
  // Create complex object from underlying data
  return createValueA(params.data[params.colDef.field!], params.data);
}
function valueParserA(params: ValueParserParams) {
  // Convert string `newValue` back into complex object (reverse of `valueFormatterA`). `newValue` is string.
  // We have access to `data` (as well as `oldValue`) to retrieve any other properties we need to recreate the complex object.
  // For undo/redo to work, we need immutable data, so can't mutate `oldValue`
  return createValueA(params.newValue, params.data);
}
function valueSetterA(params: ValueSetterParams) {
  // Update data from complex object (reverse of `valueGetterA`)
  params.data[params.colDef.field!] = params.newValue
    ? params.newValue.actualValueA
    : null;
  return true;
}
function equalsA(valueA: any, valueB: any) {
  // Used to detect whether cell value has changed for refreshing. Needed as `valueGetter` returns different references.
  return (
    (valueA == null && valueB == null) ||
    (valueA != null &&
      valueB != null &&
      valueA.actualValueA === valueB.actualValueA)
  );
}
function createValueB(value: string, data: any) {
  return value == null
    ? null
    : {
        actualValueB: value,
        anotherPropertyB: data.anotherPropertyB,
      };
}
function valueFormatterB(params: ValueFormatterParams) {
  // Convert complex object to string
  return params.value ? params.value.actualValueB : "";
}
function valueParserB(params: ValueParserParams) {
  // Convert string `newValue` back into complex object (reverse of `valueFormatterB`). `newValue` is string
  return createValueB(params.newValue, params.data);
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
      b: {
        actualValueB: "b-" + i,
        anotherPropertyB: "b",
      },
      anotherPropertyA: "a",
    };
  });
}
