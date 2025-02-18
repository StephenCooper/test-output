import { Component } from "@angular/core";
import { AgGridAngular } from "ag-grid-angular";
import {
  CheckboxEditorModule,
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ModuleRegistry,
  ValidationModule,
} from "ag-grid-community";
ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  CheckboxEditorModule,
  ValidationModule /* Development Only */,
]);

@Component({
  selector: "my-app",
  standalone: true,
  imports: [AgGridAngular],
  template: `<ag-grid-angular
    style="width: 100%; height: 100%;"
    [columnDefs]="columnDefs"
    [defaultColDef]="defaultColDef"
    [rowData]="rowData"
  /> `,
})
export class AppComponent {
  columnDefs: ColDef[] = [
    {
      headerName: "Checkbox Cell Editor",
      field: "boolean",
      cellEditor: "agCheckboxCellEditor",
    },
  ];
  defaultColDef: ColDef = {
    width: 200,
    editable: true,
  };
  rowData: any[] | null = data;
}

const data = Array.from(Array(20).keys()).map((val: any, index: number) => ({
  boolean: !!(index % 2),
}));
