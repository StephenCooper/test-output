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
  ValueFormatterParams,
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
      headerName: "Date Editor",
      field: "date",
      valueFormatter: (params: ValueFormatterParams<any, Date>) => {
        if (!params.value) {
          return "";
        }
        const month = params.value.getMonth() + 1;
        const day = params.value.getDate();
        return `${params.value.getFullYear()}-${month < 10 ? "0" + month : month}-${day < 10 ? "0" + day : day}`;
      },
      cellEditor: "agDateCellEditor",
    },
  ];
  defaultColDef: ColDef = {
    width: 200,
    editable: true,
  };
  rowData: any[] | null = data;
}

const data = Array.from(Array(20).keys()).map((val: any, index: number) => ({
  date: new Date(2023, 5, index + 1),
}));
