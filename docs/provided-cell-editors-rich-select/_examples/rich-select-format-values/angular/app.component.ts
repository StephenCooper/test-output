import { Component } from "@angular/core";
import { AgGridAngular } from "ag-grid-angular";
import {
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  GridApi,
  GridOptions,
  GridReadyEvent,
  IRichCellEditorParams,
  ModuleRegistry,
  TextEditorModule,
  ValidationModule,
} from "ag-grid-community";
import { RichSelectModule } from "ag-grid-enterprise";
ModuleRegistry.registerModules([
  TextEditorModule,
  ClientSideRowModelModule,
  RichSelectModule,
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
      headerName: "Rich Select Editor",
      field: "language",
      cellEditor: "agRichSelectCellEditor",
      cellEditorParams: {
        values: languages,
        formatValue: (values) => values.toUpperCase(),
      } as IRichCellEditorParams,
    },
  ];
  defaultColDef: ColDef = {
    width: 200,
    editable: true,
  };
  rowData: any[] | null = new Array(100)
    .fill(null)
    .map(() => ({ language: languages[getRandomNumber(0, 4)] }));
}

const languages = ["English", "Spanish", "French", "Portuguese", "(other)"];
function getRandomNumber(min: number, max: number) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}
