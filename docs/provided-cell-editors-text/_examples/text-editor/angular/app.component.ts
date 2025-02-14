import { Component } from "@angular/core";
import { AgGridAngular } from "ag-grid-angular";
import {
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ITextCellEditorParams,
  ModuleRegistry,
  TextEditorModule,
  ValidationModule,
} from "ag-grid-community";
import { colors } from "./colors";
ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  TextEditorModule,
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
      field: "color",
      cellEditor: "agTextCellEditor",
      cellEditorParams: {
        maxLength: 20,
      } as ITextCellEditorParams,
    },
    {
      field: "value",
      valueFormatter: (params) => `£ ${params.value}`,
      cellEditor: "agTextCellEditor",
      cellEditorParams: {
        maxLength: 20,
      } as ITextCellEditorParams,
    },
  ];
  defaultColDef: ColDef = {
    flex: 1,
    editable: true,
  };
  rowData: any[] | null = data;
}

function getRandomNumber(min: number, max: number) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}
const data = Array.from(Array(20).keys()).map(() => {
  const color = colors[getRandomNumber(0, colors.length - 1)];
  return {
    color: color,
    value: getRandomNumber(0, 1000),
  };
});
