import { Component } from "@angular/core";
import { AgGridAngular } from "ag-grid-angular";
import "./styles.css";
import {
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  CustomEditorModule,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ModuleRegistry,
  NumberEditorModule,
  TextEditorModule,
  ValidationModule,
} from "ag-grid-community";
import { RichSelectModule } from "ag-grid-enterprise";
import { getData } from "./data";
ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  RichSelectModule,
  NumberEditorModule,
  TextEditorModule,
  CustomEditorModule,
  ValidationModule /* Development Only */,
]);
import { MoodEditor } from "./mood-editor.component";
import { MoodRenderer } from "./mood-renderer.component";

@Component({
  selector: "my-app",
  standalone: true,
  imports: [AgGridAngular, MoodEditor, MoodRenderer],
  template: `<ag-grid-angular
    style="width: 100%; height: 100%;"
    [columnDefs]="columnDefs"
    [rowData]="rowData"
    [defaultColDef]="defaultColDef"
  /> `,
})
export class AppComponent {
  columnDefs: ColDef[] = [
    {
      field: "mood",
      headerName: "Inline",
      cellRenderer: MoodRenderer,
      cellEditor: MoodEditor,
    },
    {
      field: "mood",
      headerName: "Popup Over",
      cellRenderer: MoodRenderer,
      cellEditor: MoodEditor,
      cellEditorPopup: true,
    },
    {
      field: "mood",
      headerName: "Popup Under",
      cellRenderer: MoodRenderer,
      cellEditor: MoodEditor,
      cellEditorPopup: true,
      cellEditorPopupPosition: "under",
    },
  ];
  rowData: any[] | null = getData();
  defaultColDef: ColDef = {
    editable: true,
    flex: 1,
    minWidth: 100,
  };
}
