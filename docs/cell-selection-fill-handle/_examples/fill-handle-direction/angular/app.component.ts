import { Component } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { AgGridAngular } from "ag-grid-angular";
import "./styles.css";
import {
  CellSelectionOptions,
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ModuleRegistry,
  NumberEditorModule,
  TextEditorModule,
  ValidationModule,
} from "ag-grid-community";
import { CellSelectionModule } from "ag-grid-enterprise";
ModuleRegistry.registerModules([
  NumberEditorModule,
  TextEditorModule,
  ClientSideRowModelModule,
  CellSelectionModule,
  ValidationModule /* Development Only */,
]);
import { IOlympicData } from "./interfaces";

@Component({
  selector: "my-app",
  standalone: true,
  imports: [AgGridAngular],
  template: `<div class="example-wrapper">
    <div style="margin-bottom: 5px">
      <label>Axis: </label>
      <button class="ag-fill-direction xy" (click)="fillHandleAxis('xy')">
        xy
      </button>
      <button
        class="ag-fill-direction x selected"
        (click)="fillHandleAxis('x')"
      >
        x only
      </button>
      <button class="ag-fill-direction y" (click)="fillHandleAxis('y')">
        y only
      </button>
    </div>

    <ag-grid-angular
      style="width: 100%; height: 100%;"
      [columnDefs]="columnDefs"
      [defaultColDef]="defaultColDef"
      [cellSelection]="cellSelection"
      [rowData]="rowData"
      (gridReady)="onGridReady($event)"
    />
  </div> `,
})
export class AppComponent {
  private gridApi!: GridApi<IOlympicData>;

  columnDefs: ColDef[] = [
    { field: "athlete", minWidth: 150 },
    { field: "age", maxWidth: 90 },
    { field: "country", minWidth: 150 },
    { field: "year", maxWidth: 90 },
    { field: "date", minWidth: 150 },
    { field: "sport", minWidth: 150 },
    { field: "gold" },
    { field: "silver" },
    { field: "bronze" },
    { field: "total" },
  ];
  defaultColDef: ColDef = {
    flex: 1,
    minWidth: 100,
    editable: true,
    cellDataType: false,
  };
  cellSelection: boolean | CellSelectionOptions = {
    handle: {
      mode: "fill",
      direction: "x",
    },
  };
  rowData!: IOlympicData[];

  constructor(private http: HttpClient) {}

  fillHandleAxis(direction: "x" | "y" | "xy") {
    const buttons = Array.prototype.slice.call(
      document.querySelectorAll(".ag-fill-direction"),
    );
    const button = document.querySelector(".ag-fill-direction." + direction)!;
    buttons.forEach((btn) => {
      btn.classList.remove("selected");
    });
    button.classList.add("selected");
    this.gridApi.setGridOption("cellSelection", {
      handle: {
        mode: "fill",
        direction,
      },
    });
  }

  onGridReady(params: GridReadyEvent<IOlympicData>) {
    this.gridApi = params.api;

    this.http
      .get<
        IOlympicData[]
      >("https://www.ag-grid.com/example-assets/small-olympic-winners.json")
      .subscribe((data) => (this.rowData = data));
  }
}
