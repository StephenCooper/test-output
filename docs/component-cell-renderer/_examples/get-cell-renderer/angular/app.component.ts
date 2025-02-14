import { Component } from "@angular/core";
import { HttpClient } from "@angular/common/http";
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
  NumberEditorModule,
  NumberFilterModule,
  RenderApiModule,
  RowApiModule,
  TextEditorModule,
  TextFilterModule,
  ValidationModule,
  ValueGetterParams,
  createGrid,
} from "ag-grid-community";
ModuleRegistry.registerModules([
  RenderApiModule,
  NumberEditorModule,
  TextEditorModule,
  TextFilterModule,
  NumberFilterModule,
  RowApiModule,
  ClientSideRowModelModule,
  ValidationModule /* Development Only */,
]);
import { MedalCellRenderer } from "./medal-cell-renderer.component";
import { IOlympicData } from "./interfaces";

@Component({
  selector: "my-app",
  standalone: true,
  imports: [AgGridAngular, MedalCellRenderer],
  template: `<div class="example-wrapper">
    <div style="margin-bottom: 5px">
      <button (click)="onCallGold()">Gold</button>
      <button (click)="onFirstRowGold()">First Row Gold</button>
      <button (click)="onCallAllCells()">All Cells</button>
    </div>

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
  private gridApi!: GridApi<IOlympicData>;

  columnDefs: ColDef[] = [
    { field: "athlete", width: 150 },
    { field: "country", width: 150 },
    { field: "year", width: 100 },
    { field: "gold", width: 100, cellRenderer: MedalCellRenderer },
    { field: "silver", width: 100, cellRenderer: MedalCellRenderer },
    { field: "bronze", width: 100, cellRenderer: MedalCellRenderer },
    {
      field: "total",
      editable: false,
      valueGetter: (params: ValueGetterParams) =>
        params.data.gold + params.data.silver + params.data.bronze,
      width: 100,
    },
  ];
  defaultColDef: ColDef = {
    editable: true,
    flex: 1,
    minWidth: 100,
    filter: true,
  };
  rowData!: IOlympicData[];

  constructor(private http: HttpClient) {}

  onCallGold() {
    console.log("=========> calling all gold");
    // pass in list of columns, here it's gold only
    const params = { columns: ["gold"] };
    const instances = this.gridApi.getCellRendererInstances(params) as any[];
    instances.forEach((instance) => {
      instance.medalUserFunction();
    });
  }

  onFirstRowGold() {
    console.log("=========> calling gold row one");
    // pass in one column and one row to identify one cell
    const firstRowNode = this.gridApi.getDisplayedRowAtIndex(0)!;
    const params = { columns: ["gold"], rowNodes: [firstRowNode] };
    const instances = this.gridApi.getCellRendererInstances(params) as any[];
    instances.forEach((instance) => {
      instance.medalUserFunction();
    });
  }

  onCallAllCells() {
    console.log("=========> calling everything");
    // no params, goes through all rows and columns where cell renderer exists
    const instances = this.gridApi.getCellRendererInstances() as any[];
    instances.forEach((instance) => {
      instance.medalUserFunction();
    });
  }

  onGridReady(params: GridReadyEvent<IOlympicData>) {
    this.gridApi = params.api;

    this.http
      .get<
        IOlympicData[]
      >("https://www.ag-grid.com/example-assets/olympic-winners.json")
      .subscribe((data) => {
        this.rowData = data;
      });
  }
}
