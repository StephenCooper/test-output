import { Component } from "@angular/core";
import { AgGridAngular } from "ag-grid-angular";
import {
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ISelectCellEditorParams,
  ModuleRegistry,
  SelectEditorModule,
  ValidationModule,
  createGrid,
} from "ag-grid-community";
import { colors } from "./colors";
ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  SelectEditorModule,
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
      headerName: "Select Editor Without Max Height and Max Width",
      field: "color",
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {
        values: colors,
      } as ISelectCellEditorParams,
    },
    {
      headerName: "Select Editor With Max Height and Max Width",
      field: "color",
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {
        values: colors,
        valueListMaxHeight: 200,
        valueListMaxWidth: 150,
      } as ISelectCellEditorParams,
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
  return { color };
});
