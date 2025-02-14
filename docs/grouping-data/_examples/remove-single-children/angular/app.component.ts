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
  ModuleRegistry,
  ValidationModule,
} from "ag-grid-community";
import {
  ColumnMenuModule,
  ColumnsToolPanelModule,
  ContextMenuModule,
  RowGroupingModule,
  SetFilterModule,
} from "ag-grid-enterprise";
import { getData } from "./data";
ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  ColumnsToolPanelModule,
  ColumnMenuModule,
  ContextMenuModule,
  RowGroupingModule,
  SetFilterModule,
  ValidationModule /* Development Only */,
]);

@Component({
  selector: "my-app",
  standalone: true,
  imports: [AgGridAngular],
  template: `<div class="example-wrapper">
    <div class="example-header">
      <label>
        <span>groupHideParentOfSingleChild:</span>
        <select id="input-display-type" (change)="onOptionChange()">
          <option value="false">false</option>
          <option value="true">true</option>
          <option value="leafGroupsOnly">"leafGroupsOnly"</option>
        </select>
      </label>
    </div>
    <ag-grid-angular
      style="width: 100%; height: 100%;"
      [columnDefs]="columnDefs"
      [defaultColDef]="defaultColDef"
      [autoGroupColumnDef]="autoGroupColumnDef"
      [rowData]="rowData"
      [groupDefaultExpanded]="groupDefaultExpanded"
      [suppressAggFuncInHeader]="true"
      (gridReady)="onGridReady($event)"
    />
  </div> `,
})
export class AppComponent {
  private gridApi!: GridApi;

  columnDefs: ColDef[] = [
    { field: "athlete" },
    { field: "country", rowGroup: true },
    { field: "city", rowGroup: true },
    { field: "year" },
    { field: "gold", aggFunc: "sum" },
    { field: "silver", aggFunc: "sum" },
    { field: "bronze", aggFunc: "sum" },
  ];
  defaultColDef: ColDef = {
    flex: 1,
    minWidth: 150,
  };
  autoGroupColumnDef: ColDef = {
    headerName: "Group",
    field: "athlete",
    minWidth: 220,
    cellRenderer: "agGroupCellRenderer",
  };
  rowData: any[] | null = getData();
  groupDefaultExpanded = -1;

  onOptionChange() {
    const key = (
      document.querySelector("#input-display-type") as HTMLSelectElement
    ).value;
    if (key === "true" || key === "false") {
      this.gridApi.setGridOption(
        "groupHideParentOfSingleChild",
        key === "true",
      );
    } else {
      this.gridApi.setGridOption(
        "groupHideParentOfSingleChild",
        "leafGroupsOnly",
      );
    }
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }
}
