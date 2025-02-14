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
  PinnedRowModule,
  RowClassParams,
  RowStyle,
  ValidationModule,
  createGrid,
} from "ag-grid-community";
ModuleRegistry.registerModules([
  PinnedRowModule,
  ClientSideRowModelModule,
  ValidationModule /* Development Only */,
]);
import { IOlympicData } from "./interfaces";

@Component({
  selector: "my-app",
  standalone: true,
  imports: [AgGridAngular],
  template: `<ag-grid-angular
    style="width: 100%; height: 100%;"
    [columnDefs]="columnDefs"
    [defaultColDef]="defaultColDef"
    [rowData]="rowData"
    [pinnedTopRowData]="pinnedTopRowData"
    [pinnedBottomRowData]="pinnedBottomRowData"
    (gridReady)="onGridReady($event)"
  /> `,
})
export class AppComponent {
  columnDefs: ColDef[] = [
    { field: "athlete" },
    { field: "country" },
    { field: "sport" },
  ];
  defaultColDef: ColDef = {
    flex: 1,
  };
  pinnedTopRowData: any[] = [
    {
      athlete: "TOP (athlete)",
      country: "TOP (country)",
      sport: "TOP (sport)",
    },
  ];
  pinnedBottomRowData: any[] = [
    {
      athlete: "BOTTOM (athlete)",
      country: "BOTTOM (country)",
      sport: "BOTTOM (sport)",
    },
  ];
  rowData!: IOlympicData[];

  constructor(private http: HttpClient) {}

  onGridReady(params: GridReadyEvent<IOlympicData>) {
    this.http
      .get<
        IOlympicData[]
      >("https://www.ag-grid.com/example-assets/olympic-winners.json")
      .subscribe((data) => (this.rowData = data));
  }
}
