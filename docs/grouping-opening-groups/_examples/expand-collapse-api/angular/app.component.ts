import { Component } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { AgGridAngular } from "ag-grid-angular";
import {
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  GetRowIdFunc,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ModuleRegistry,
  RowApiModule,
  ValidationModule,
} from "ag-grid-community";
import { RowGroupingModule } from "ag-grid-enterprise";
ModuleRegistry.registerModules([
  RowApiModule,
  ClientSideRowModelModule,
  RowGroupingModule,
  ValidationModule /* Development Only */,
]);

@Component({
  selector: "my-app",
  standalone: true,
  imports: [AgGridAngular],
  template: `<ag-grid-angular
    style="width: 100%; height: 100%;"
    [columnDefs]="columnDefs"
    [defaultColDef]="defaultColDef"
    [getRowId]="getRowId"
    [rowData]="rowData"
    (firstDataRendered)="onFirstDataRendered($event)"
    (gridReady)="onGridReady($event)"
  /> `,
})
export class AppComponent {
  private gridApi!: GridApi;

  columnDefs: ColDef[] = [
    { field: "country", rowGroup: true, hide: true },
    { field: "year", rowGroup: true, hide: true },
    { field: "athlete" },
    { field: "total" },
  ];
  defaultColDef: ColDef = {
    flex: 1,
    minWidth: 150,
  };
  getRowId: GetRowIdFunc = (params) => params.data.id;
  rowData!: any[];

  constructor(private http: HttpClient) {}

  onFirstDataRendered() {
    const node = this.gridApi.getRowNode("2");
    if (node) {
      this.gridApi.setRowNodeExpanded(node, true, true);
    }
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;

    this.http
      .get<any[]>("https://www.ag-grid.com/example-assets/olympic-winners.json")
      .subscribe(
        (data) =>
          (this.rowData = data.map((d, i) => ({ ...d, id: String(i) }))),
      );
  }
}
