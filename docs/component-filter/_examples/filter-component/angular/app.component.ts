import { Component } from "@angular/core";
import { AgGridAngular } from "ag-grid-angular";
import "./styles.css";
import {
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  CustomFilterModule,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ModuleRegistry,
  TextEditorModule,
  TextFilterModule,
  ValidationModule,
} from "ag-grid-community";
import { getData } from "./data";
ModuleRegistry.registerModules([
  TextFilterModule,
  TextEditorModule,
  CustomFilterModule,
  ClientSideRowModelModule,
  ValidationModule /* Development Only */,
]);
import { PartialMatchFilter } from "./partial-match-filter.component";

@Component({
  selector: "my-app",
  standalone: true,
  imports: [AgGridAngular, PartialMatchFilter],
  template: `<div class="example-wrapper">
    <button
      style="margin-bottom: 5px"
      (click)="onClicked()"
      class="btn btn-primary"
    >
      Invoke Filter Instance Method
    </button>
    <ag-grid-angular
      style="width: 100%; height: 100%;"
      [columnDefs]="columnDefs"
      [defaultColDef]="defaultColDef"
      [rowData]="rowData"
      (gridReady)="onGridReady($event)"
    />
  </div> `,
})
export class AppComponent {
  private gridApi!: GridApi;

  columnDefs: ColDef[] = [
    { field: "row" },
    {
      field: "name",
      filter: PartialMatchFilter,
    },
  ];
  defaultColDef: ColDef = {
    editable: true,
    flex: 1,
    minWidth: 100,
    filter: true,
  };
  rowData: any[] | null = getData();

  onClicked() {
    this.gridApi
      .getColumnFilterInstance<PartialMatchFilter>("name")
      .then((instance) => {
        instance!.componentMethod("Hello World!");
      });
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }
}
