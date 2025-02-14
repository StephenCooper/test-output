import { Component } from "@angular/core";
import { AgGridAngular } from "ag-grid-angular";
import {
  CheckboxEditorModule,
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  DateEditorModule,
  GridApi,
  GridOptions,
  GridReadyEvent,
  INumberCellEditorParams,
  ModuleRegistry,
  NumberEditorModule,
  ValidationModule,
  ValueFormatterParams,
  createGrid,
} from "ag-grid-community";
ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  NumberEditorModule,
  DateEditorModule,
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
      headerName: "Number Editor",
      field: "number",
      cellEditor: "agNumberCellEditor",
      cellEditorParams: {
        precision: 0,
      } as INumberCellEditorParams,
    },
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
    {
      headerName: "Date as String Editor",
      field: "dateString",
      cellEditor: "agDateStringCellEditor",
    },
    {
      headerName: "Checkbox Cell Editor",
      field: "boolean",
      cellEditor: "agCheckboxCellEditor",
    },
  ];
  defaultColDef: ColDef = {
    flex: 1,
    editable: true,
  };
  rowData: any[] | null = data;
}

const data = Array.from(Array(20).keys()).map((val: any, index: number) => ({
  number: index,
  date: new Date(2023, 5, index + 1),
  dateString: `2023-06-${index < 9 ? "0" + (index + 1) : index + 1}`,
  boolean: !!(index % 2),
}));
