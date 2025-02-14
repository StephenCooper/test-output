import { Component } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { AgGridAngular } from "ag-grid-angular";
import "./styles.css";
import {
  CellStyleModule,
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ModuleRegistry,
  NumberFilterModule,
  RowDragCancelEvent,
  RowDragEndEvent,
  RowDragEnterEvent,
  RowDragModule,
  TextFilterModule,
  ValidationModule,
} from "ag-grid-community";
ModuleRegistry.registerModules([
  TextFilterModule,
  NumberFilterModule,
  RowDragModule,
  CellStyleModule,
  ClientSideRowModelModule,
  ValidationModule /* Development Only */,
]);
import { CustomCellRenderer } from "./custom-cell-renderer.component";
import { IOlympicData } from "./interfaces";

@Component({
  selector: "my-app",
  standalone: true,
  imports: [AgGridAngular, CustomCellRenderer],
  template: `<ag-grid-angular
    style="width: 100%; height: 100%;"
    [columnDefs]="columnDefs"
    [defaultColDef]="defaultColDef"
    [rowDragManaged]="true"
    [rowData]="rowData"
    (rowDragEnter)="onRowDragEnter($event)"
    (rowDragEnd)="onRowDragEnd($event)"
    (rowDragCancel)="onRowDragCancel($event)"
    (gridReady)="onGridReady($event)"
  /> `,
})
export class AppComponent {
  columnDefs: ColDef[] = [
    {
      field: "athlete",
      cellClass: "custom-athlete-cell",
      cellRenderer: CustomCellRenderer,
    },
    { field: "country" },
    { field: "year", width: 100 },
    { field: "date" },
    { field: "sport" },
    { field: "gold" },
    { field: "silver" },
    { field: "bronze" },
  ];
  defaultColDef: ColDef = {
    width: 170,
    filter: true,
  };
  rowData!: IOlympicData[];

  constructor(private http: HttpClient) {}

  onRowDragEnter(e: RowDragEnterEvent) {
    console.log("onRowDragEnter", e);
  }

  onRowDragEnd(e: RowDragEndEvent) {
    console.log("onRowDragEnd", e);
  }

  onRowDragCancel(e: RowDragCancelEvent) {
    console.log("onRowDragCancel", e);
  }

  onGridReady(params: GridReadyEvent<IOlympicData>) {
    this.http
      .get<
        IOlympicData[]
      >("https://www.ag-grid.com/example-assets/olympic-winners.json")
      .subscribe((data) => (this.rowData = data));
  }
}
