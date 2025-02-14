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
  createGrid,
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
        <button (click)="onBtSaveSortState()">Save Sort</button>
        <button (click)="onBtRestoreSortState()">Restore Sort</button>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <button (click)="onBtSaveOrderAndVisibilityState()">
          Save Order &amp; Visibility
        </button>
        <button (click)="onBtRestoreOrderAndVisibilityState()">
          Restore Order &amp; Visibility
        </button>
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

  onBtSaveSortState() {
    const allState = this.gridApi.getColumnState();
    const sortState = allState.map((state) => ({
      colId: state.colId,
      sort: state.sort,
      sortIndex: state.sortIndex,
    }));
    window.sortState = sortState;
    console.log("sort state saved", sortState);
  }

  onBtRestoreSortState() {
    if (!window.sortState) {
      console.log("no sort state to restore, you must save sort state first");
      return;
    }
    this.gridApi.applyColumnState({
      state: window.sortState,
    });
    console.log("sort state restored");
  }

  onBtSaveOrderAndVisibilityState() {
    const allState = this.gridApi.getColumnState();
    const orderAndVisibilityState = allState.map((state) => ({
      colId: state.colId,
      hide: state.hide,
    }));
    window.orderAndVisibilityState = orderAndVisibilityState;
    console.log("order and visibility state saved", orderAndVisibilityState);
  }

  onBtRestoreOrderAndVisibilityState() {
    if (!window.orderAndVisibilityState) {
      console.log(
        "no order and visibility state to restore by, you must save order and visibility state first",
      );
      return;
    }
    this.gridApi.applyColumnState({
      state: window.orderAndVisibilityState,
      applyOrder: true,
    });
    console.log("column state restored");
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
