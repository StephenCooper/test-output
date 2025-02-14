import { Component } from "@angular/core";
import { AgGridAngular } from "ag-grid-angular";
import {
  CellValueChangedEvent,
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  ColumnAutoSizeModule,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ModuleRegistry,
  NumberEditorModule,
  SizeColumnsToContentStrategy,
  SizeColumnsToFitGridStrategy,
  SizeColumnsToFitProvidedWidthStrategy,
  TextEditorModule,
  ValidationModule,
  createGrid,
} from "ag-grid-community";
import { getData } from "./data";
ModuleRegistry.registerModules([
  TextEditorModule,
  ColumnAutoSizeModule,
  ClientSideRowModelModule,
  NumberEditorModule,
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
    [autoSizeStrategy]="autoSizeStrategy"
    (cellValueChanged)="onCellValueChanged($event)"
  /> `,
})
export class AppComponent {
  columnDefs: ColDef[] = [
    {
      headerName: "String (editable)",
      field: "simple",
      editable: true,
    },
    {
      headerName: "Number (editable)",
      field: "number",
      editable: true,
      valueFormatter: `"£" + Math.floor(value).toString().replace(/(\\d)(?=(\\d{3})+(?!\\d))/g, "$1,")`,
    },
    {
      headerName: "Name (editable)",
      editable: true,
      valueGetter: 'data.firstName + " " + data.lastName',
      valueSetter:
        // an expression can span multiple lines!!!
        `var nameSplit = newValue.split(" ");
             var newFirstName = nameSplit[0];
             var newLastName = nameSplit[1];
             if (data.firstName !== newFirstName || data.lastName !== newLastName) {  
                data.firstName = newFirstName;  
                data.lastName = newLastName;  
                return true;
            } else {  
                return false;
            }`,
    },
    { headerName: "A", field: "a", width: 100 },
    { headerName: "B", field: "b", width: 100 },
    { headerName: "A + B", valueGetter: "data.a + data.b" },
  ];
  defaultColDef: ColDef = {
    flex: 1,
    sortable: false,
  };
  rowData: any[] | null = getData();
  autoSizeStrategy:
    | SizeColumnsToFitGridStrategy
    | SizeColumnsToFitProvidedWidthStrategy
    | SizeColumnsToContentStrategy = { type: "fitGridWidth" };

  onCellValueChanged(event: CellValueChangedEvent) {
    console.log("data after changes is: ", event.data);
  }
}
