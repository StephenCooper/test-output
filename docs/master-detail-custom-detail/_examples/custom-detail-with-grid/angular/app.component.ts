import { Component } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { AgGridAngular } from "ag-grid-angular";
import "./styles.css";
import {
  ClientSideRowModelApiModule,
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  FirstDataRenderedEvent,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ModuleRegistry,
  RowApiModule,
  ValidationModule,
} from "ag-grid-community";
import {
  ColumnMenuModule,
  ColumnsToolPanelModule,
  ContextMenuModule,
  MasterDetailModule,
} from "ag-grid-enterprise";
ModuleRegistry.registerModules([
  ClientSideRowModelApiModule,
  RowApiModule,
  ClientSideRowModelModule,
  ColumnsToolPanelModule,
  MasterDetailModule,
  ColumnMenuModule,
  ContextMenuModule,
  ValidationModule /* Development Only */,
]);
import { DetailCellRenderer } from "./detail-cell-renderer.component";
import { IAccount } from "./interfaces";

declare let window: any;

@Component({
  selector: "my-app",
  standalone: true,
  imports: [AgGridAngular, DetailCellRenderer],
  template: `<div class="example-wrapper">
    <div style="margin-bottom: 5px">
      <button (click)="printDetailGridInfo()">Print Detail Grid Info</button>
      <button (click)="expandCollapseAll()">Toggle Expand / Collapse</button>
    </div>
    <ag-grid-angular
      style="width: 100%; height: 100%;"
      [columnDefs]="columnDefs"
      [defaultColDef]="defaultColDef"
      [masterDetail]="true"
      [detailRowHeight]="detailRowHeight"
      [detailCellRenderer]="detailCellRenderer"
      [rowData]="rowData"
      (firstDataRendered)="onFirstDataRendered($event)"
      (gridReady)="onGridReady($event)"
    />
  </div> `,
})
export class AppComponent {
  private gridApi!: GridApi<IAccount>;

  columnDefs: ColDef[] = [
    // group cell renderer needed for expand / collapse icons
    { field: "name", cellRenderer: "agGroupCellRenderer" },
    { field: "account" },
    { field: "calls" },
    { field: "minutes", valueFormatter: "x.toLocaleString() + 'm'" },
  ];
  defaultColDef: ColDef = {
    flex: 1,
  };
  detailRowHeight = 310;
  detailCellRenderer: any = DetailCellRenderer;
  rowData!: IAccount[];

  constructor(private http: HttpClient) {}

  onFirstDataRendered(params: FirstDataRenderedEvent) {
    // arbitrarily expand a row for presentational purposes
    setTimeout(() => {
      params.api.getDisplayedRowAtIndex(1)!.setExpanded(true);
    }, 0);
  }

  expandCollapseAll() {
    this.gridApi.forEachNode(function (node) {
      node.expanded = !!window.collapsed;
    });
    window.collapsed = !window.collapsed;
    this.gridApi.onGroupExpandedOrCollapsed();
  }

  printDetailGridInfo() {
    console.log("Currently registered detail grid's: ");
    this.gridApi.forEachDetailGridInfo(function (detailGridInfo) {
      console.log(detailGridInfo);
    });
  }

  onGridReady(params: GridReadyEvent<IAccount>) {
    this.gridApi = params.api;

    this.http
      .get<
        IAccount[]
      >("https://www.ag-grid.com/example-assets/master-detail-data.json")
      .subscribe((data) => {
        this.rowData = data;
      });
  }
}
