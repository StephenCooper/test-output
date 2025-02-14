import { Component } from "@angular/core";
import { AgGridAngular } from "ag-grid-angular";
import {
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  DateEditorModule,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ModuleRegistry,
  ValidationModule,
} from "ag-grid-community";
ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  DateEditorModule,
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
      headerName: "Date as String Editor",
      field: "dateString",
      cellEditor: "agDateStringCellEditor",
    },
  ];
  defaultColDef: ColDef = {
    width: 200,
    editable: true,
  };
  rowData: any[] | null = data;
}

const data = Array.from(Array(20).keys()).map((val: any, index: number) => ({
  dateString: `2023-06-${index < 9 ? "0" + (index + 1) : index + 1}`,
}));
