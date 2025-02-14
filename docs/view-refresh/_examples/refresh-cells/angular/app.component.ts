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
  HighlightChangesModule,
  IRowNode,
  ModuleRegistry,
  PinnedRowModule,
  RefreshCellsParams,
  RenderApiModule,
  RowApiModule,
  ValidationModule,
} from "ag-grid-community";
ModuleRegistry.registerModules([
  RenderApiModule,
  RowApiModule,
  HighlightChangesModule,
  PinnedRowModule,
  ClientSideRowModelModule,
  ValidationModule /* Development Only */,
]);

@Component({
  selector: "my-app",
  standalone: true,
  imports: [AgGridAngular],
  template: `<div class="example-wrapper">
    <div class="example-header">
      <div>
        <button (click)="scrambleAndRefreshAll()">
          Scramble &amp; Refresh All
        </button>
        <button (click)="scrambleAndRefreshLeftToRight()">
          Scramble &amp; Refresh Left to Right
        </button>
        <button (click)="scrambleAndRefreshTopToBottom()">
          Scramble &amp; Refresh Top to Bottom
        </button>
      </div>
      <div>
        <label>
          <input type="checkbox" id="forceRefresh" />
          Force Refresh
        </label>
        <label>
          <input type="checkbox" id="suppressFlash" />
          Suppress Flash
        </label>
      </div>
    </div>
    <ag-grid-angular
      style="width: 100%; height: 100%;"
      [columnDefs]="columnDefs"
      [defaultColDef]="defaultColDef"
      [rowData]="rowData"
      [pinnedTopRowData]="pinnedTopRowData"
      [pinnedBottomRowData]="pinnedBottomRowData"
      (gridReady)="onGridReady($event)"
    />
  </div> `,
})
export class AppComponent {
  private gridApi!: GridApi;

  columnDefs: ColDef[] = [
    { field: "a", enableCellChangeFlash: false },
    { field: "b" },
    { field: "c" },
    { field: "d" },
    { field: "e" },
    { field: "f" },
  ];
  defaultColDef: ColDef = {
    flex: 1,
    enableCellChangeFlash: true,
  };
  rowData: any[] | null = [];
  pinnedTopRowData: any[] = [];
  pinnedBottomRowData: any[] = [];

  scrambleAndRefreshAll() {
    scramble();
    const params = {
      force: isForceRefreshSelected(),
      suppressFlash: isSuppressFlashSelected(),
    };
    this.gridApi.refreshCells(params);
  }

  scrambleAndRefreshLeftToRight() {
    scramble();
    ["a", "b", "c", "d", "e", "f"].forEach((col, index) => {
      const millis = index * 100;
      const params = {
        force: isForceRefreshSelected(),
        suppressFlash: isSuppressFlashSelected(),
        columns: [col],
      };
      callRefreshAfterMillis(params, millis, this.gridApi);
    });
  }

  scrambleAndRefreshTopToBottom() {
    scramble();
    let frame = 0;
    let i;
    let rowNode;
    for (i = 0; i < this.gridApi.getPinnedTopRowCount(); i++) {
      rowNode = this.gridApi.getPinnedTopRow(i)!;
      refreshRow(rowNode, this.gridApi);
    }
    for (i = 0; i < this.gridApi.getDisplayedRowCount(); i++) {
      rowNode = this.gridApi.getDisplayedRowAtIndex(i)!;
      refreshRow(rowNode, this.gridApi);
    }
    for (i = 0; i < this.gridApi.getPinnedBottomRowCount(); i++) {
      rowNode = this.gridApi.getPinnedBottomRow(i)!;
      refreshRow(rowNode, this.gridApi);
    }
    function refreshRow(rowNode: IRowNode, api: GridApi) {
      const millis = frame++ * 100;
      const rowNodes = [rowNode]; // params needs an array
      const params: RefreshCellsParams = {
        force: isForceRefreshSelected(),
        suppressFlash: isSuppressFlashSelected(),
        rowNodes: rowNodes,
      };
      callRefreshAfterMillis(params, millis, api);
    }
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;

    // placing in 13 rows, so there are exactly enough rows to fill the grid, makes
    // the row animation look nice when you see all the rows
    data = createData(14);
    topRowData = createData(2);
    bottomRowData = createData(2);
    params.api.setGridOption("rowData", data);
    params.api.setGridOption("pinnedTopRowData", topRowData);
    params.api.setGridOption("pinnedBottomRowData", bottomRowData);
  }
}

// placing in 13 rows, so there are exactly enough rows to fill the grid, makes
// the row animation look nice when you see all the rows
let data: any[] = [];
let topRowData: any[] = [];
let bottomRowData: any[] = [];
function createData(count: number): any[] {
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
function isForceRefreshSelected() {
  return (document.querySelector("#forceRefresh") as HTMLInputElement).checked;
}
function isSuppressFlashSelected() {
  return (document.querySelector("#suppressFlash") as HTMLInputElement).checked;
}
function callRefreshAfterMillis(
  params: RefreshCellsParams,
  millis: number,
  api: GridApi,
) {
  setTimeout(() => {
    api.refreshCells(params);
  }, millis);
}
function scramble() {
  data.forEach(scrambleItem);
  topRowData.forEach(scrambleItem);
  bottomRowData.forEach(scrambleItem);
}
function scrambleItem(item: any) {
  ["a", "b", "c", "d", "e", "f"].forEach((colId) => {
    // skip 50% of the cells so updates are random
    if (Math.random() > 0.5) {
      return;
    }
    item[colId] = Math.floor(Math.random() * 100);
  });
}
