import { Component } from "@angular/core";
import { AgGridAngular } from "ag-grid-angular";
import "./styles.css";
import {
  ClientSideRowModelApiModule,
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  GetRowIdFunc,
  GridApi,
  GridOptions,
  GridReadyEvent,
  HighlightChangesModule,
  ModuleRegistry,
  NumberFilterModule,
  RowApiModule,
  TextFilterModule,
  ValidationModule,
} from "ag-grid-community";
import { RowGroupingModule, SetFilterModule } from "ag-grid-enterprise";
import { createDataItem, getData } from "./data";
ModuleRegistry.registerModules([
  ClientSideRowModelApiModule,
  TextFilterModule,
  SetFilterModule,
  RowApiModule,
  HighlightChangesModule,
  ClientSideRowModelModule,
  RowGroupingModule,
  NumberFilterModule,
  ValidationModule /* Development Only */,
]);

@Component({
  selector: "my-app",
  standalone: true,
  imports: [AgGridAngular],
  template: `<div class="test-container">
    <div class="test-header">
      <button (click)="onBtnApply()">Apply Transaction</button>
      <button (click)="onBtnRefreshModel()">Refresh Model</button>
    </div>
    <ag-grid-angular
      style="width: 100%; height: 100%;"
      class="test-grid"
      [getRowId]="getRowId"
      [columnDefs]="columnDefs"
      [defaultColDef]="defaultColDef"
      [suppressModelUpdateAfterUpdateTransaction]="true"
      [rowData]="rowData"
      (gridReady)="onGridReady($event)"
    />
  </div> `,
})
export class AppComponent {
  private gridApi!: GridApi;

  columnDefs: ColDef[] = [
    { field: "name" },
    { field: "laptop" },
    {
      field: "fixed",
      enableCellChangeFlash: true,
    },
    {
      field: "value",
      enableCellChangeFlash: true,
      sort: "desc",
    },
  ];
  defaultColDef: ColDef = {
    flex: 1,
    filter: true,
    floatingFilter: true,
  };
  rowData!: any[];

  onBtnApply() {
    const updatedItems: any[] = [];
    this.gridApi.forEachNode((rowNode) => {
      const newValue = Math.floor(Math.random() * 100) + 10;
      const newBoolean = Boolean(Math.round(Math.random()));
      const newItem = createDataItem(
        rowNode.data.name,
        rowNode.data.laptop,
        newBoolean,
        newValue,
        rowNode.data.id,
      );
      updatedItems.push(newItem);
    });
    this.gridApi.applyTransaction({ update: updatedItems });
  }

  onBtnRefreshModel() {
    this.gridApi.refreshClientSideRowModel("filter");
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;

    params.api
      .setColumnFilterModel("fixed", {
        filterType: "set",
        values: ["true"],
      })
      .then(() => {
        params.api.onFilterChanged();
      });
    params.api.setGridOption("rowData", getData());
  }

  getRowId = (params) => {
    return String(params.data.id);
  };
}
