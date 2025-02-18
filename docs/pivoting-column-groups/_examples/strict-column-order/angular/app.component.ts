import { Component } from "@angular/core";
import { AgGridAngular } from "ag-grid-angular";
import "./styles.css";
import {
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  GetRowIdFunc,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ModuleRegistry,
  ValidationModule,
} from "ag-grid-community";
import { PivotModule } from "ag-grid-enterprise";
import { getData } from "./data";
ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  PivotModule,
  ValidationModule /* Development Only */,
]);

@Component({
  selector: "my-app",
  standalone: true,
  imports: [AgGridAngular],
  template: `<div class="example-wrapper">
    <div class="example-header">
      <label>
        <span>enableStrictPivotColumnOrder:</span>
        <input
          id="enableStrictPivotColumnOrder"
          type="checkbox"
          (change)="toggleOption()"
        />
      </label>
    </div>
    <ag-grid-angular
      style="width: 100%; height: 100%;"
      [columnDefs]="columnDefs"
      [defaultColDef]="defaultColDef"
      [autoGroupColumnDef]="autoGroupColumnDef"
      [pivotMode]="true"
      [getRowId]="getRowId"
      [rowData]="rowData"
      (gridReady)="onGridReady($event)"
    />
  </div> `,
})
export class AppComponent {
  private gridApi!: GridApi;

  columnDefs: ColDef[] = [
    { field: "pivotValue", pivot: true },
    { field: "agg", aggFunc: "sum", rowGroup: true },
  ];
  defaultColDef: ColDef = {
    width: 130,
  };
  autoGroupColumnDef: ColDef = {
    minWidth: 100,
  };
  getRowId: GetRowIdFunc = (p) => String(p.data.pivotValue);
  rowData!: any[];

  toggleOption() {
    const isChecked = document.querySelector<HTMLInputElement>(
      "#enableStrictPivotColumnOrder",
    )!.checked;
    this.gridApi.setGridOption("enableStrictPivotColumnOrder", isChecked);
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;

    setInterval(() => {
      count += 1;
      const rowData = getData();
      params.api.setGridOption(
        "rowData",
        rowData.slice(0, (count % rowData.length) + 1),
      );
    }, 1000);
  }
}

let count = 0;
