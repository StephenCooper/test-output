import { Component } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { AgGridAngular } from "ag-grid-angular";
import "./styles.css";
import {
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  ColumnApiModule,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ModuleRegistry,
  SideBarDef,
  ValidationModule,
} from "ag-grid-community";
import {
  ColumnsToolPanelModule,
  PivotModule,
  RowGroupingPanelModule,
} from "ag-grid-enterprise";
ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  ColumnsToolPanelModule,
  PivotModule,
  RowGroupingPanelModule,
  ColumnApiModule,
  ValidationModule /* Development Only */,
]);
import { IOlympicData } from "./interfaces";

declare let window: any;

@Component({
  selector: "my-app",
  standalone: true,
  imports: [AgGridAngular],
  template: `<div class="test-container">
    <div class="test-header">
      <div class="example-section">
        <button (click)="saveState()">Save State</button>
        <button (click)="restoreState()">Restore State</button>
        <button (click)="resetState()">Reset State</button>
      </div>
    </div>
    <ag-grid-angular
      style="width: 100%; height: 100%;"
      [columnDefs]="columnDefs"
      [defaultColDef]="defaultColDef"
      [autoGroupColumnDef]="autoGroupColumnDef"
      [sideBar]="sideBar"
      [rowGroupPanelShow]="rowGroupPanelShow"
      [pivotPanelShow]="pivotPanelShow"
      [rowData]="rowData"
      (gridReady)="onGridReady($event)"
    />
  </div> `,
})
export class AppComponent {
  private gridApi!: GridApi<IOlympicData>;

  columnDefs: ColDef[] = [
    { field: "athlete" },
    { field: "age" },
    { field: "country" },
    { field: "sport" },
    { field: "year" },
    { field: "date" },
    { field: "gold" },
    { field: "silver" },
    { field: "bronze" },
    { field: "total" },
  ];
  defaultColDef: ColDef = {
    width: 100,
    enableRowGroup: true,
    enablePivot: true,
    enableValue: true,
  };
  autoGroupColumnDef: ColDef = {
    minWidth: 200,
  };
  sideBar: SideBarDef | string | string[] | boolean | null = {
    toolPanels: ["columns"],
  };
  rowGroupPanelShow: "always" | "onlyWhenGrouping" | "never" = "always";
  pivotPanelShow: "always" | "onlyWhenPivoting" | "never" = "always";
  rowData!: IOlympicData[];

  constructor(private http: HttpClient) {}

  saveState() {
    window.colState = this.gridApi.getColumnState();
    console.log("column state saved");
  }

  restoreState() {
    if (!window.colState) {
      console.log("no columns state to restore by, you must save state first");
      return;
    }
    this.gridApi.applyColumnState({
      state: window.colState,
      applyOrder: true,
    });
    console.log("column state restored");
  }

  resetState() {
    this.gridApi.resetColumnState();
    console.log("column state reset");
  }

  onGridReady(params: GridReadyEvent<IOlympicData>) {
    this.gridApi = params.api;

    this.http
      .get<
        IOlympicData[]
      >("https://www.ag-grid.com/example-assets/olympic-winners.json")
      .subscribe((data) => (this.rowData = data));
  }
}
