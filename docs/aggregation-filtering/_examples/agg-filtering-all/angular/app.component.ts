import { Component } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { AgGridAngular } from "ag-grid-angular";
import "./styles.css";
import {
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  GridApi,
  GridOptions,
  GridReadyEvent,
  IsRowFilterable,
  ModuleRegistry,
  NumberFilterModule,
  ValidationModule,
} from "ag-grid-community";
import {
  ColumnMenuModule,
  ContextMenuModule,
  RowGroupingModule,
  SetFilterModule,
} from "ag-grid-enterprise";
ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  ColumnMenuModule,
  ContextMenuModule,
  RowGroupingModule,
  SetFilterModule,
  NumberFilterModule,
  ValidationModule /* Development Only */,
]);

@Component({
  selector: "my-app",
  standalone: true,
  imports: [AgGridAngular],
  template: `<div class="example-wrapper">
    <div class="example-header">
      <label>
        <span>groupAggFiltering:</span>
        <input
          id="groupAggFiltering"
          type="checkbox"
          (change)="toggleProperty()"
        />
      </label>
    </div>
    <ag-grid-angular
      style="width: 100%; height: 100%;"
      [columnDefs]="columnDefs"
      [defaultColDef]="defaultColDef"
      [autoGroupColumnDef]="autoGroupColumnDef"
      [groupDefaultExpanded]="groupDefaultExpanded"
      [groupAggFiltering]="true"
      [rowData]="rowData"
      (gridReady)="onGridReady($event)"
    />
  </div> `,
})
export class AppComponent {
  private gridApi!: GridApi;

  columnDefs: ColDef[] = [
    { field: "country", rowGroup: true, hide: true },
    { field: "year" },
    { field: "total", aggFunc: "sum", filter: "agNumberColumnFilter" },
  ];
  defaultColDef: ColDef = {
    flex: 1,
    floatingFilter: true,
  };
  autoGroupColumnDef: ColDef = {
    field: "athlete",
  };
  groupDefaultExpanded = -1;
  rowData!: any[];

  constructor(private http: HttpClient) {}

  toggleProperty() {
    const enable =
      document.querySelector<HTMLInputElement>("#groupAggFiltering")!.checked;
    this.gridApi.setGridOption("groupAggFiltering", enable);
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;

    document.querySelector<HTMLInputElement>("#groupAggFiltering")!.checked =
      true;
    params.api.setFilterModel({
      total: {
        type: "contains",
        filter: "192",
      },
    });

    this.http
      .get<any[]>("https://www.ag-grid.com/example-assets/olympic-winners.json")
      .subscribe((data) => (this.rowData = data));
  }
}
