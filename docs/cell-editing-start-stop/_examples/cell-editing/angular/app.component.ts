import { Component } from "@angular/core";
import { AgGridAngular } from "ag-grid-angular";
import "./styles.css";
import {
  CellEditingStartedEvent,
  CellEditingStoppedEvent,
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ModuleRegistry,
  NumberEditorModule,
  PinnedRowModule,
  RowEditingStartedEvent,
  RowEditingStoppedEvent,
  RowPinnedType,
  TextEditorModule,
  ValidationModule,
} from "ag-grid-community";
import { getData } from "./data";
ModuleRegistry.registerModules([
  NumberEditorModule,
  TextEditorModule,
  PinnedRowModule,
  ClientSideRowModelModule,
  ValidationModule /* Development Only */,
]);

@Component({
  selector: "my-app",
  standalone: true,
  imports: [AgGridAngular],
  template: `<div class="example-wrapper">
    <div>
      <div style="margin-bottom: 5px; display: flex">
        <button (click)="onBtStartEditing(undefined)">edit (0)</button>
        <button (click)="onBtStartEditing('Backspace')">
          edit (0, Backspace)
        </button>
        <button (click)="onBtStartEditing('T')">edit (0, 'T')</button>
        <button (click)="onBtStartEditing(undefined, 'top')">
          edit (0, Top)
        </button>
        <button (click)="onBtStartEditing(undefined, 'bottom')">
          edit (0, Bottom)
        </button>
      </div>
      <div style="margin-bottom: 5px; display: flex">
        <button (click)="onBtStopEditing()">stop ()</button>
        <button (click)="onBtNextCell()">next ()</button>
        <button (click)="onBtPreviousCell()">previous ()</button>
        <button (click)="onBtWhich()">which ()</button>
      </div>
    </div>
    <div class="grid-wrapper">
      <ag-grid-angular
        style="width: 100%; height: 100%;"
        [columnDefs]="columnDefs"
        [defaultColDef]="defaultColDef"
        [rowData]="rowData"
        [pinnedTopRowData]="pinnedTopRowData"
        [pinnedBottomRowData]="pinnedBottomRowData"
        (rowEditingStarted)="onRowEditingStarted($event)"
        (rowEditingStopped)="onRowEditingStopped($event)"
        (cellEditingStarted)="onCellEditingStarted($event)"
        (cellEditingStopped)="onCellEditingStopped($event)"
        (gridReady)="onGridReady($event)"
      />
    </div>
  </div> `,
})
export class AppComponent {
  private gridApi!: GridApi;

  columnDefs: ColDef[] = [
    { field: "firstName" },
    { field: "lastName" },
    { field: "gender" },
    { field: "age" },
    { field: "mood" },
    { field: "country" },
    { field: "address", minWidth: 550 },
  ];
  defaultColDef: ColDef = {
    flex: 1,
    minWidth: 110,
    editable: true,
  };
  rowData: any[] | null = getData();
  pinnedTopRowData: any[] = getPinnedTopData();
  pinnedBottomRowData: any[] = getPinnedBottomData();

  onRowEditingStarted(event: RowEditingStartedEvent) {
    console.log("never called - not doing row editing");
  }

  onRowEditingStopped(event: RowEditingStoppedEvent) {
    console.log("never called - not doing row editing");
  }

  onCellEditingStarted(event: CellEditingStartedEvent) {
    console.log("cellEditingStarted");
  }

  onCellEditingStopped(event: CellEditingStoppedEvent) {
    console.log("cellEditingStopped");
  }

  onBtStopEditing() {
    this.gridApi.stopEditing();
  }

  onBtStartEditing(key?: string, pinned?: RowPinnedType) {
    this.gridApi.setFocusedCell(0, "lastName", pinned);
    this.gridApi.startEditingCell({
      rowIndex: 0,
      colKey: "lastName",
      // set to 'top', 'bottom' or undefined
      rowPinned: pinned,
      key: key,
    });
  }

  onBtNextCell() {
    this.gridApi.tabToNextCell();
  }

  onBtPreviousCell() {
    this.gridApi.tabToPreviousCell();
  }

  onBtWhich() {
    const cellDefs = this.gridApi.getEditingCells();
    if (cellDefs.length > 0) {
      const cellDef = cellDefs[0];
      console.log(
        "editing cell is: row = " +
          cellDef.rowIndex +
          ", col = " +
          cellDef.column.getId() +
          ", floating = " +
          cellDef.rowPinned,
      );
    } else {
      console.log("no cells are editing");
    }
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }
}

function getPinnedTopData() {
  return [
    {
      firstName: "##",
      lastName: "##",
      gender: "##",
      address: "##",
      mood: "##",
      country: "##",
    },
  ];
}
function getPinnedBottomData() {
  return [
    {
      firstName: "##",
      lastName: "##",
      gender: "##",
      address: "##",
      mood: "##",
      country: "##",
    },
  ];
}
