import { Component } from "@angular/core";
import { AgGridAngular } from "ag-grid-angular";
import {
  CellStyleModule,
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  ColTypeDef,
  GridApi,
  GridOptions,
  GridReadyEvent,
  HighlightChangesModule,
  ModuleRegistry,
  NumberFilterModule,
  TextEditorModule,
  TextFilterModule,
  ValidationModule,
} from "ag-grid-community";
ModuleRegistry.registerModules([
  TextEditorModule,
  TextFilterModule,
  HighlightChangesModule,
  CellStyleModule,
  ClientSideRowModelModule,
  NumberFilterModule,
  ValidationModule /* Development Only */,
]);

@Component({
  selector: "my-app",
  standalone: true,
  imports: [AgGridAngular],
  template: `
    <ag-grid-angular
      style="width: 100%; height: 100%;"
      [columnDefs]="columnDefs"
      [defaultColDef]="defaultColDef"
      [columnTypes]="columnTypes"
      [rowData]="rowData"
      [groupDefaultExpanded]="groupDefaultExpanded"
      [suppressAggFuncInHeader]="true"
    />
  `,
})
export class AppComponent {
  columnDefs: ColDef[] = [
    { field: "a", type: "valueColumn" },
    { field: "b", type: "valueColumn" },
    { field: "c", type: "valueColumn" },
    { field: "d", type: "valueColumn" },
    { field: "e", type: "valueColumn" },
    { field: "f", type: "valueColumn" },
    {
      headerName: "Total",
      valueGetter: "data.a + data.b + data.c + data.d + data.e + data.f",
      editable: false,
      cellClass: "total-col",
    },
  ];
  defaultColDef: ColDef = {
    flex: 1,
    enableCellChangeFlash: true,
  };
  columnTypes: {
    [key: string]: ColTypeDef;
  } = {
    valueColumn: {
      minWidth: 90,
      editable: true,
      valueParser: "Number(newValue)",
      filter: "agNumberColumnFilter",
    },
  };
  rowData: any[] | null = getRowData();
  groupDefaultExpanded = 1;
}

function getRowData() {
  const rowData = [];
  for (let i = 1; i <= 20; i++) {
    rowData.push({
      group: i < 5 ? "A" : "B",
      a: (i * 863) % 100,
      b: (i * 811) % 100,
      c: (i * 743) % 100,
      d: (i * 677) % 100,
      e: (i * 619) % 100,
      f: (i * 571) % 100,
    });
  }
  return rowData;
}
