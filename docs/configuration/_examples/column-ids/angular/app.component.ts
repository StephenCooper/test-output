import { Component } from "@angular/core";
import { AgGridAngular } from "ag-grid-angular";
import {
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  ColumnApiModule,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ModuleRegistry,
  ValidationModule,
  createGrid,
} from "ag-grid-community";
ModuleRegistry.registerModules([
  ColumnApiModule,
  ClientSideRowModelModule,
  ValidationModule /* Development Only */,
]);

@Component({
  selector: "my-app",
  standalone: true,
  imports: [AgGridAngular],
  template: `<div style="height: 100%; box-sizing: border-box">
    <ag-grid-angular
      style="width: 100%; height: 100%;"
      [columnDefs]="columnDefs"
      [rowData]="rowData"
      (gridReady)="onGridReady($event)"
    />
  </div> `,
})
export class AppComponent {
  columnDefs: ColDef[] = [
    // colId will be 'height',
    { headerName: "Col 1", field: "height" },
    // colId will be 'firstWidth',
    { headerName: "Col 2", colId: "firstWidth", field: "width" },
    // colId will be 'secondWidth'
    { headerName: "Col 3", colId: "secondWidth", field: "width" },
    // no colId, no field, so grid generated ID
    { headerName: "Col 4", valueGetter: "data.width" },
    { headerName: "Col 5", valueGetter: "data.width" },
  ];
  rowData: any[] | null = createRowData();

  onGridReady(params: GridReadyEvent) {
    const cols = params.api.getColumns()!;
    cols.forEach((col) => {
      const colDef = col.getColDef();
      console.log(
        colDef.headerName + ", Column ID = " + col.getId(),
        JSON.stringify(colDef),
      );
    });
  }
}

function createRowData() {
  const data = [];
  for (let i = 0; i < 20; i++) {
    data.push({
      height: Math.floor(Math.random() * 100),
      width: Math.floor(Math.random() * 100),
      depth: Math.floor(Math.random() * 100),
    });
  }
  return data;
}
