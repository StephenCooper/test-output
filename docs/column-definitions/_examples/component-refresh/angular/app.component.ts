import { Component } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { AgGridAngular } from "ag-grid-angular";
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
import { MedalCellRenderer } from "./medal-cell-renderer.component";
import { UpdateCellRenderer } from "./update-cell-renderer.component";
import { IOlympicData } from "./interfaces";

@Component({
  selector: "my-app",
  standalone: true,
  imports: [AgGridAngular, MedalCellRenderer, UpdateCellRenderer],
  template: `<ag-grid-angular
    style="width: 100%; height: 100%;"
    [columnDefs]="columnDefs"
    [defaultColDef]="defaultColDef"
    [rowData]="rowData"
    (gridReady)="onGridReady($event)"
  /> `,
})
export class AppComponent {
  columnDefs: ColDef[] = [
    { field: "athlete" },
    { field: "year" },
    { field: "gold", cellRenderer: MedalCellRenderer },
    { field: "silver", cellRenderer: MedalCellRenderer },
    { field: "bronze", cellRenderer: MedalCellRenderer },
    { cellRenderer: UpdateCellRenderer },
  ];
  defaultColDef: ColDef = {
    flex: 1,
    minWidth: 100,
  };
  rowData!: IOlympicData[];

  constructor(private http: HttpClient) {}

  onGridReady(params: GridReadyEvent<IOlympicData>) {
    this.http
      .get<
        IOlympicData[]
      >("https://www.ag-grid.com/example-assets/small-olympic-winners.json")
      .subscribe((data) => {
        this.rowData = data;
      });
  }
}
