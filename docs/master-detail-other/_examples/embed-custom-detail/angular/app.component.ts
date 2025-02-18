import { Component } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { AgGridAngular } from "ag-grid-angular";
import "./style.css";
import {
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
import { MasterDetailModule } from "ag-grid-enterprise";
ModuleRegistry.registerModules([
  RowApiModule,
  ClientSideRowModelModule,
  MasterDetailModule,
  ValidationModule /* Development Only */,
]);
import { DetailCellRenderer } from "./detail-cell-renderer.component";
import { IAccount } from "./interfaces";

@Component({
  selector: "my-app",
  standalone: true,
  imports: [AgGridAngular, DetailCellRenderer],
  template: `<ag-grid-angular
    style="width: 100%; height: 100%;"
    [masterDetail]="true"
    [detailCellRenderer]="detailCellRenderer"
    [detailRowHeight]="detailRowHeight"
    [columnDefs]="columnDefs"
    [defaultColDef]="defaultColDef"
    [embedFullWidthRows]="true"
    [rowData]="rowData"
    (firstDataRendered)="onFirstDataRendered($event)"
    (gridReady)="onGridReady($event)"
  /> `,
})
export class AppComponent {
  detailCellRenderer: any = DetailCellRenderer;
  detailRowHeight = 150;
  columnDefs: ColDef[] = [
    // group cell renderer needed for expand / collapse icons
    { field: "name", cellRenderer: "agGroupCellRenderer", pinned: "left" },
    { field: "account" },
    { field: "calls" },
    { field: "minutes", valueFormatter: "x.toLocaleString() + 'm'" },
    { headerName: "Extra Col 1", valueGetter: '"AAA"' },
    { headerName: "Extra Col 2", valueGetter: '"BBB"' },
    { headerName: "Extra Col 3", valueGetter: '"CCC"' },
    { headerName: "Pinned Right", pinned: "right" },
  ];
  defaultColDef: ColDef = {};
  rowData!: IAccount[];

  constructor(private http: HttpClient) {}

  onFirstDataRendered(params: FirstDataRenderedEvent) {
    setTimeout(() => {
      params.api.forEachNode(function (node) {
        node.setExpanded(node.id === "1");
      });
    }, 1000);
  }

  onGridReady(params: GridReadyEvent<IAccount>) {
    this.http
      .get<
        IAccount[]
      >("https://www.ag-grid.com/example-assets/master-detail-data.json")
      .subscribe((data) => {
        this.rowData = data;
      });
  }
}
