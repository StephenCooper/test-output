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
ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  ValidationModule /* Development Only */,
]);

interface IAthlete {
  athlete: string;
  country: string;
}

@Component({
  selector: "my-app",
  standalone: true,
  imports: [AgGridAngular],
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

      <button (click)="onBtnClearRowData()">Clear rowData</button>
      <button (click)="onBtnSetRowData()">Set rowData</button>
    </div>
    <ag-grid-angular
      style="width: 100%; height: 100%;"
      [loading]="true"
      [columnDefs]="columnDefs"
      [rowData]="rowData"
      (gridReady)="onGridReady($event)"
    />
  </div> `,
})
export class AppComponent {
  private gridApi!: GridApi<IAthlete>;

  columnDefs: ColDef[] = [{ field: "athlete" }, { field: "country" }];
  rowData!: IAthlete[];

  setLoading(value: boolean) {
    this.gridApi.setGridOption("loading", value);
  }

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
