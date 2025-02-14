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
  ModuleRegistry,
  ValidationModule,
} from "ag-grid-community";
import {
  ColumnMenuModule,
  ContextMenuModule,
  RowGroupingModule,
} from "ag-grid-enterprise";
ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  ColumnMenuModule,
  ContextMenuModule,
  RowGroupingModule,
  ValidationModule /* Development Only */,
]);
import { IOlympicData } from "./interfaces";

@Component({
  selector: "my-app",
  standalone: true,
  imports: [AgGridAngular],
  template: `<div class="example-wrapper">
    <div class="example-header">
      <label>
        <span>suppressAggFuncInHeader:</span>
        <input
          id="suppressAggFuncInHeader"
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
      [rowData]="rowData"
      (gridReady)="onGridReady($event)"
    />
  </div> `,
})
export class AppComponent {
  private gridApi!: GridApi<IOlympicData>;

  columnDefs: ColDef[] = [
    { field: "country", rowGroup: true, hide: true },
    { field: "bronze", aggFunc: "max" },
    { field: "silver", aggFunc: "max" },
    { field: "gold", aggFunc: "max" },
    { field: "total", aggFunc: "avg" },
  ];
  defaultColDef: ColDef = {
    flex: 1,
    minWidth: 140,
  };
  autoGroupColumnDef: ColDef = {
    minWidth: 200,
  };
  rowData!: IOlympicData[];

  constructor(private http: HttpClient) {}

  toggleProperty() {
    const suppressAggFuncInHeader = document.querySelector<HTMLInputElement>(
      "#suppressAggFuncInHeader",
    )!.checked;
    this.gridApi.setGridOption(
      "suppressAggFuncInHeader",
      suppressAggFuncInHeader,
    );
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
