import { Component } from "@angular/core";
import { AgGridAngular } from "ag-grid-angular";
import "./styles.css";
import {
  CellEditingStartedEvent,
  CellEditingStoppedEvent,
  CellEditorSelectorResult,
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ICellEditorParams,
  ModuleRegistry,
  NumberEditorModule,
  RowEditingStartedEvent,
  RowEditingStoppedEvent,
  TextEditorModule,
  ValidationModule,
} from "ag-grid-community";
import {
  ColumnMenuModule,
  ColumnsToolPanelModule,
  ContextMenuModule,
  RichSelectModule,
} from "ag-grid-enterprise";
import { IRow, getData } from "./data";
ModuleRegistry.registerModules([
  NumberEditorModule,
  TextEditorModule,
  ClientSideRowModelModule,
  ColumnsToolPanelModule,
  ColumnMenuModule,
  ContextMenuModule,
  RichSelectModule,
  ValidationModule /* Development Only */,
]);
import { MoodEditor } from "./mood-editor.component";
import { NumericCellEditor } from "./numeric-cell-editor.component";

@Component({
  selector: "my-app",
  standalone: true,
  imports: [AgGridAngular, MoodEditor, NumericCellEditor],
  template: `<ag-grid-angular
    style="width: 100%; height: 100%;"
    [columnDefs]="columnDefs"
    [defaultColDef]="defaultColDef"
    [rowData]="rowData"
    (rowEditingStarted)="onRowEditingStarted($event)"
    (rowEditingStopped)="onRowEditingStopped($event)"
    (cellEditingStarted)="onCellEditingStarted($event)"
    (cellEditingStopped)="onCellEditingStopped($event)"
  /> `,
})
export class AppComponent {
  columnDefs: ColDef[] = [
    { field: "type" },
    {
      field: "value",
      editable: true,
      cellEditorSelector: cellEditorSelector,
    },
  ];
  defaultColDef: ColDef = {
    flex: 1,
    cellDataType: false,
  };
  rowData: IRow[] | null = getData();

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
}

function cellEditorSelector(
  params: ICellEditorParams<IRow>,
): CellEditorSelectorResult | undefined {
  if (params.data.type === "age") {
    return {
      component: NumericCellEditor,
    };
  }
  if (params.data.type === "gender") {
    return {
      component: "agRichSelectCellEditor",
      params: {
        values: ["Male", "Female"],
      },
    };
  }
  if (params.data.type === "mood") {
    return {
      component: MoodEditor,
      popup: true,
      popupPosition: "under",
    };
  }
  return undefined;
}
