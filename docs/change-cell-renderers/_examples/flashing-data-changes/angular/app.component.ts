import { Component } from "@angular/core";
import { AgGridAngular } from "ag-grid-angular";
import {
  CellStyleModule,
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  GridApi,
  GridOptions,
  GridReadyEvent,
  HighlightChangesModule,
  ModuleRegistry,
  RowApiModule,
  ValidationModule,
} from "ag-grid-community";
ModuleRegistry.registerModules([
  HighlightChangesModule,
  RowApiModule,
  CellStyleModule,
  ClientSideRowModelModule,
  ValidationModule /* Development Only */,
]);

@Component({
  selector: "my-app",
  standalone: true,
  imports: [AgGridAngular],
  template: `<div style="height: 100%; display: flex; flex-direction: column">
    <div style="margin-bottom: 4px">
      <button (click)="onFlashOneCell()" style="margin-left: 15px">
        Flash One Cell
      </button>
      <button (click)="onFlashTwoRows()">Flash Two Rows</button>
      <button (click)="onFlashTwoColumns()">Flash Two Columns</button>
    </div>
    <div style="flex-grow: 1">
      <ag-grid-angular
        style="width: 100%; height: 100%;"
        [columnDefs]="columnDefs"
        [defaultColDef]="defaultColDef"
        [rowData]="rowData"
        (gridReady)="onGridReady($event)"
      />
    </div>
  </div> `,
})
export class AppComponent {
  private gridApi!: GridApi;

  columnDefs: ColDef[] = [
    { field: "a" },
    { field: "b" },
    { field: "c" },
    { field: "d" },
    { field: "e" },
    { field: "f" },
  ];
  defaultColDef: ColDef = {
    flex: 1,
    cellClass: "align-right",
    valueFormatter: (params) => {
      return formatNumber(params.value);
    },
  };
  rowData: any[] | null = createRowData();

  onFlashOneCell() {
    // pick fourth row at random
    const rowNode = this.gridApi.getDisplayedRowAtIndex(4)!;
    // pick 'c' column
    this.gridApi.flashCells({ rowNodes: [rowNode], columns: ["c"] });
  }

  onFlashTwoColumns() {
    // flash whole column, so leave row selection out
    this.gridApi.flashCells({ columns: ["c", "d"] });
  }

  onFlashTwoRows() {
    // pick fourth and fifth row at random
    const rowNode1 = this.gridApi.getDisplayedRowAtIndex(4)!;
    const rowNode2 = this.gridApi.getDisplayedRowAtIndex(5)!;
    // flash whole row, so leave column selection out
    this.gridApi.flashCells({ rowNodes: [rowNode1, rowNode2] });
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }
}

function formatNumber(number: number) {
  return Math.floor(number).toLocaleString();
}
function createRowData() {
  const rowData = [];
  for (let i = 0; i < 20; i++) {
    rowData.push({
      a: Math.floor(((i + 323) * 25435) % 10000),
      b: Math.floor(((i + 323) * 23221) % 10000),
      c: Math.floor(((i + 323) * 468276) % 10000),
      d: 0,
      e: 0,
      f: 0,
    });
  }
  return rowData;
}
