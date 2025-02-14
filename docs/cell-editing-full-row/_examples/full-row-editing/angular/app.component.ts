import { Component } from "@angular/core";
import { AgGridAngular } from "ag-grid-angular";
import "./styles.css";
import {
  CellValueChangedEvent,
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  CustomEditorModule,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ModuleRegistry,
  RowValueChangedEvent,
  SelectEditorModule,
  TextEditorModule,
  ValidationModule,
  createGrid,
} from "ag-grid-community";
import {
  ColumnMenuModule,
  ColumnsToolPanelModule,
  ContextMenuModule,
} from "ag-grid-enterprise";
ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  ColumnsToolPanelModule,
  ColumnMenuModule,
  ContextMenuModule,
  SelectEditorModule,
  TextEditorModule,
  CustomEditorModule,
  ValidationModule /* Development Only */,
]);
import { NumericCellEditor } from "./numeric-cell-editor.component";

@Component({
  selector: "my-app",
  standalone: true,
  imports: [AgGridAngular, NumericCellEditor],
  template: `<div class="example-wrapper">
    <div style="margin-bottom: 5px">
      <button style="font-size: 12px" (click)="onBtStartEditing()">
        Start Editing Line 2
      </button>
      <button style="font-size: 12px" (click)="onBtStopEditing()">
        Stop Editing
      </button>
    </div>
    <ag-grid-angular
      style="width: 100%; height: 100%;"
      [columnDefs]="columnDefs"
      [defaultColDef]="defaultColDef"
      [editType]="editType"
      [rowData]="rowData"
      (cellValueChanged)="onCellValueChanged($event)"
      (rowValueChanged)="onRowValueChanged($event)"
      (gridReady)="onGridReady($event)"
    />
  </div> `,
})
export class AppComponent {
  private gridApi!: GridApi;

  columnDefs: ColDef[] = [
    {
      field: "make",
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {
        values: ["Porsche", "Toyota", "Ford", "AAA", "BBB", "CCC"],
      },
    },
    { field: "model" },
    { field: "field4", headerName: "Read Only", editable: false },
    { field: "price", cellEditor: NumericCellEditor },
    {
      headerName: "Suppress Navigable",
      field: "field5",
      suppressNavigable: true,
      minWidth: 200,
    },
    { headerName: "Read Only", field: "field6", editable: false },
  ];
  defaultColDef: ColDef = {
    flex: 1,
    editable: true,
    cellDataType: false,
  };
  editType: "fullRow" = "fullRow";
  rowData: any[] | null = getRowData();

  onCellValueChanged(event: CellValueChangedEvent) {
    console.log(
      "onCellValueChanged: " + event.colDef.field + " = " + event.newValue,
    );
  }

  onRowValueChanged(event: RowValueChangedEvent) {
    const data = event.data;
    console.log(
      "onRowValueChanged: (" +
        data.make +
        ", " +
        data.model +
        ", " +
        data.price +
        ", " +
        data.field5 +
        ")",
    );
  }

  onBtStopEditing() {
    this.gridApi.stopEditing();
  }

  onBtStartEditing() {
    this.gridApi.setFocusedCell(1, "make");
    this.gridApi.startEditingCell({
      rowIndex: 1,
      colKey: "make",
    });
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }
}

function getRowData() {
  const rowData = [];
  for (let i = 0; i < 10; i++) {
    rowData.push({
      make: "Toyota",
      model: "Celica",
      price: 35000 + i * 1000,
      field4: "Sample XX",
      field5: "Sample 22",
      field6: "Sample 23",
    });
    rowData.push({
      make: "Ford",
      model: "Mondeo",
      price: 32000 + i * 1000,
      field4: "Sample YY",
      field5: "Sample 24",
      field6: "Sample 25",
    });
    rowData.push({
      make: "Porsche",
      model: "Boxster",
      price: 72000 + i * 1000,
      field4: "Sample ZZ",
      field5: "Sample 26",
      field6: "Sample 27",
    });
  }
  return rowData;
}
