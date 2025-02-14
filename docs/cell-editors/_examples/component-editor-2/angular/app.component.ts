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
  createGrid,
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
import { GenderRenderer } from "./gender-renderer.component";
import { MoodEditor } from "./mood-editor.component";
import { MoodRenderer } from "./mood-renderer.component";
import { SimpleTextEditor } from "./simpleTextEditor.component";

@Component({
  selector: "my-app",
  standalone: true,
  imports: [
    AgGridAngular,
    GenderRenderer,
    MoodEditor,
    MoodRenderer,
    SimpleTextEditor,
  ],
  template: `<ag-grid-angular
    style="width: 100%; height: 100%;"
    [columnDefs]="columnDefs"
    [rowData]="rowData"
    [defaultColDef]="defaultColDef"
  /> `,
})
export class AppComponent {
  columnDefs: ColDef[] = [
    { field: "first_name", headerName: "Provided Text" },
    {
      field: "last_name",
      headerName: "Custom Text",
      cellEditor: SimpleTextEditor,
    },
    {
      field: "age",
      headerName: "Provided Number",
      cellEditor: "agNumberCellEditor",
    },
    {
      field: "gender",
      headerName: "Provided Rich Select",
      cellRenderer: GenderRenderer,
      cellEditor: "agRichSelectCellEditor",
      cellEditorParams: {
        cellRenderer: GenderRenderer,
        values: ["Male", "Female"],
      },
    },
    {
      field: "mood",
      headerName: "Custom Mood",
      cellRenderer: MoodRenderer,
      cellEditor: MoodEditor,
      cellEditorPopup: true,
    },
  ];
  rowData: any[] | null = getData();
  defaultColDef: ColDef = {
    editable: true,
    flex: 1,
    minWidth: 100,
  };
}
