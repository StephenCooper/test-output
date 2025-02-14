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
import { CustomLoadingOverlay } from "./custom-loading-overlay.component";

interface IAthlete {
  athlete: string;
  country: string;
}

@Component({
  selector: "my-app",
  standalone: true,
  imports: [AgGridAngular, CustomLoadingOverlay],
  template: `<div class="example-wrapper">
    <div>
      <label class="checkbox">
        <input
          type="checkbox"
          checked=""
          (change)="setLoading($event.currentTarget.checked)"
        />
        loading
      </label>
    </div>
    <ag-grid-angular
      style="width: 100%; height: 100%;"
      [columnDefs]="columnDefs"
      [rowData]="rowData"
      [defaultColDef]="defaultColDef"
      [loading]="true"
      [loadingOverlayComponent]="loadingOverlayComponent"
      [loadingOverlayComponentParams]="loadingOverlayComponentParams"
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
  rowData: IAthlete[] | null = [
    { athlete: "Michael Phelps", country: "United States" },
    { athlete: "Natalie Coughlin", country: "United States" },
    { athlete: "Aleksey Nemov", country: "Russia" },
    { athlete: "Alicia Coutts", country: "Australia" },
  ];
  defaultColDef: ColDef = {
    editable: true,
    flex: 1,
    minWidth: 100,
    filter: true,
  };
  loadingOverlayComponent: any = CustomLoadingOverlay;
  loadingOverlayComponentParams: any = {
    loadingMessage: "One moment please...",
  };

  setLoading(value: boolean) {
    this.gridApi.setGridOption("loading", value);
  }

  onGridReady(params: GridReadyEvent<IAthlete>) {
    this.gridApi = params.api;
  }
}
