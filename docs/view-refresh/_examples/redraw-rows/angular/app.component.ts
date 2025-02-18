import { Component } from "@angular/core";
import { AgGridAngular } from "ag-grid-angular";
import "./styles.css";
import {
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ModuleRegistry,
  RowApiModule,
  RowClassParams,
  RowStyle,
  RowStyleModule,
  ValidationModule,
} from "ag-grid-community";
ModuleRegistry.registerModules([
  RowApiModule,
  RowStyleModule,
  ClientSideRowModelModule,
  ValidationModule /* Development Only */,
]);

@Component({
  selector: "my-app",
  standalone: true,
  imports: [AgGridAngular],
  template: `<div class="example-wrapper">
    <div style="margin-bottom: 5px">
      <button (click)="redrawAllRows()">Redraw All Rows</button>
      <button (click)="redrawTopRows()">Redraw Top Rows</button>
    </div>

    <ag-grid-angular
      style="width: 100%; height: 100%;"
      [columnDefs]="columnDefs"
      [defaultColDef]="defaultColDef"
      [rowData]="rowData"
      [getRowStyle]="getRowStyle"
      (gridReady)="onGridReady($event)"
    />
  </div> `,
})
export class AppComponent {
  private gridApi!: GridApi;

  columnDefs: ColDef[] = [
    { headerName: "A", field: "a" },
    { headerName: "B", field: "b" },
    { headerName: "C", field: "c" },
    { headerName: "D", field: "d" },
    { headerName: "E", field: "e" },
    { headerName: "F", field: "f" },
  ];
  defaultColDef: ColDef = {
    flex: 1,
  };
  rowData: any[] | null = createData(12);
  getRowStyle: (params: RowClassParams) => RowStyle | undefined = (
    params: RowClassParams,
  ): RowStyle | undefined => {
    return {
      backgroundColor: colors[colorIndex],
    };
  };

  redrawAllRows() {
    progressColor();
    this.gridApi.redrawRows();
  }

  redrawTopRows() {
    progressColor();
    const rows = [];
    for (let i = 0; i < 6; i++) {
      const row = this.gridApi.getDisplayedRowAtIndex(i)!;
      rows.push(row);
    }
    this.gridApi.redrawRows({ rowNodes: rows });
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }
}

let colorIndex = 0;
const colors = ["#99999944", "#CC333344", "#33CC3344", "#2244CC44"];
function createData(count: number) {
  const result = [];
  for (let i = 1; i <= count; i++) {
    result.push({
      a: (i * 863) % 100,
      b: (i * 811) % 100,
      c: (i * 743) % 100,
      d: (i * 677) % 100,
      e: (i * 619) % 100,
      f: (i * 571) % 100,
    });
  }
  return result;
}
function progressColor() {
  colorIndex++;
  if (colorIndex === colors.length) {
    colorIndex = 0;
  }
}
