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
  TextEditorModule,
  TextFilterModule,
  ValidationModule,
  createGrid,
} from "ag-grid-community";
ModuleRegistry.registerModules([
  TextEditorModule,
  TextFilterModule,
  ClientSideRowModelModule,
  ValidationModule /* Development Only */,
]);
import { CustomNoRowsOverlay } from "./custom-no-rows-overlay.component";

interface IAthlete {
  athlete: string;
  country: string;
}

@Component({
  selector: "my-app",
  standalone: true,
  imports: [AgGridAngular, CustomNoRowsOverlay],
  template: `<div class="example-wrapper">
    <div>
      <button (click)="onBtnClearRowData()">Clear rowData</button>
      <button (click)="onBtnSetRowData()">Set rowData</button>
    </div>
    <ag-grid-angular
      style="width: 100%; height: 100%;"
      [columnDefs]="columnDefs"
      [defaultColDef]="defaultColDef"
      [rowData]="rowData"
      [noRowsOverlayComponent]="noRowsOverlayComponent"
      [noRowsOverlayComponentParams]="noRowsOverlayComponentParams"
      (gridReady)="onGridReady($event)"
    />
  </div> `,
})
export class AppComponent {
  private gridApi!: GridApi<IAthlete>;

  columnDefs: ColDef[] = [
    { field: "athlete", width: 150 },
    { field: "country", width: 120 },
  ];
  defaultColDef: ColDef = {
    editable: true,
    flex: 1,
    minWidth: 100,
    filter: true,
  };
  rowData: IAthlete[] | null = [];
  noRowsOverlayComponent: any = CustomNoRowsOverlay;
  noRowsOverlayComponentParams: any = {
    noRowsMessageFunc: () =>
      "No rows found at: " + new Date().toLocaleTimeString(),
  };

  onBtnClearRowData() {
    this.gridApi.setGridOption("rowData", []);
  }

  onBtnSetRowData() {
    this.gridApi.setGridOption("rowData", [
      { athlete: "Michael Phelps", country: "US" },
    ]);
  }

  onGridReady(params: GridReadyEvent<IAthlete>) {
    this.gridApi = params.api;
  }
}
