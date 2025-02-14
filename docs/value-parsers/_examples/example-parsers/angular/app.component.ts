import { Component } from "@angular/core";
import { AgGridAngular } from "ag-grid-angular";
import {
  CellValueChangedEvent,
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ModuleRegistry,
  TextEditorModule,
  ValidationModule,
  ValueParserParams,
  createGrid,
} from "ag-grid-community";
import { getData } from "./data";
ModuleRegistry.registerModules([
  TextEditorModule,
  ClientSideRowModelModule,
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
    (cellValueChanged)="onCellValueChanged($event)"
  /> `,
})
export class AppComponent {
  columnDefs: ColDef[] = [
    { headerName: "Name", field: "simple" },
    { headerName: "Bad Number", field: "numberBad" },
    {
      headerName: "Good Number",
      field: "numberGood",
      valueParser: numberParser,
    },
  ];
  defaultColDef: ColDef = {
    flex: 1,
    editable: true,
    cellDataType: false,
  };
  rowData: any[] | null = getData();

  onCellValueChanged(event: CellValueChangedEvent) {
    console.log("data after changes is: ", event.data);
  }
}

function numberParser(params: ValueParserParams) {
  return Number(params.newValue);
}
