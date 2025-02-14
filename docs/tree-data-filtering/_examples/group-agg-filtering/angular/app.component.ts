import { Component } from "@angular/core";
import { AgGridAngular } from "ag-grid-angular";
import "./style.css";
import {
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  GetDataPath,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ModuleRegistry,
  NumberFilterModule,
  TextFilterModule,
  ValidationModule,
} from "ag-grid-community";
import { TreeDataModule } from "ag-grid-enterprise";
import { getData } from "./data";
ModuleRegistry.registerModules([
  TextFilterModule,
  ClientSideRowModelModule,
  TreeDataModule,
  NumberFilterModule,
  ValidationModule /* Development Only */,
]);

@Component({
  selector: "my-app",
  standalone: true,
  imports: [AgGridAngular],
  template: `<div class="example-wrapper">
    <label>
      suppressAggFilteredOnly:
      <input
        type="checkbox"
        id="suppressAggFilteredOnly"
        checked=""
        (click)="toggleCheckbox()"
      />
    </label>
    <ag-grid-angular
      style="width: 100%; height: 100%;"
      [columnDefs]="columnDefs"
      [defaultColDef]="defaultColDef"
      [autoGroupColumnDef]="autoGroupColumnDef"
      [rowData]="rowData"
      [treeData]="true"
      [groupDefaultExpanded]="groupDefaultExpanded"
      [suppressAggFilteredOnly]="true"
      [getDataPath]="getDataPath"
      (gridReady)="onGridReady($event)"
    />
  </div> `,
})
export class AppComponent {
  private gridApi!: GridApi;

  columnDefs: ColDef[] = [
    { field: "created" },
    { field: "modified" },
    {
      field: "size",
      aggFunc: "sum",
      filter: "agNumberColumnFilter",
      valueFormatter: (params) => {
        const sizeInKb = params.value / 1024;
        if (sizeInKb > 1024) {
          return `${+(sizeInKb / 1024).toFixed(2)} MB`;
        } else {
          return `${+sizeInKb.toFixed(2)} KB`;
        }
      },
    },
  ];
  defaultColDef: ColDef = {
    flex: 1,
  };
  autoGroupColumnDef: ColDef = {
    headerName: "File Explorer",
    minWidth: 150,
    cellRendererParams: {
      suppressCount: true,
    },
  };
  rowData: any[] | null = getData();
  groupDefaultExpanded = 1;
  getDataPath: GetDataPath = (data) => data.path;

  toggleCheckbox() {
    const checkbox = document.querySelector<HTMLInputElement>(
      "#suppressAggFilteredOnly",
    )!;
    this.gridApi.setGridOption("suppressAggFilteredOnly", checkbox.checked);
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;

    params.api.setFilterModel({
      size: {
        filterType: "number",
        type: "equal",
        filter: 5193728,
      },
    });
  }
}
