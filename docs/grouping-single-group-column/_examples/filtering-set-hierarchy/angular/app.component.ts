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
  KeyCreatorParams,
  ModuleRegistry,
  NumberFilterModule,
  ValidationModule,
} from "ag-grid-community";
import { RowGroupingModule, SetFilterModule } from "ag-grid-enterprise";
ModuleRegistry.registerModules([
  NumberFilterModule,
  ClientSideRowModelModule,
  RowGroupingModule,
  SetFilterModule,
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
    [autoGroupColumnDef]="autoGroupColumnDef"
    [groupDefaultExpanded]="groupDefaultExpanded"
    [rowData]="rowData"
    (gridReady)="onGridReady($event)"
  /> `,
})
export class AppComponent {
  columnDefs: ColDef[] = [
    { field: "country", rowGroup: true, hide: true, filter: true },
    { field: "year", rowGroup: true, hide: true, filter: true },
    { field: "athlete" },
    { field: "sport" },
    { field: "total" },
  ];
  defaultColDef: ColDef = {
    flex: 1,
    minWidth: 100,
  };
  autoGroupColumnDef: ColDef = {
    minWidth: 200,
    filter: true,
    floatingFilter: true,
    filterValueGetter: (params) => params.data?.athlete,
    filterParams: {
      treeList: true,
      keyCreator: (params: KeyCreatorParams) =>
        params.value ? params.value.join("#") : null,
    },
  };
  groupDefaultExpanded = 1;
  rowData!: IOlympicData[];

  constructor(private http: HttpClient) {}

  onGridReady(params: GridReadyEvent<IOlympicData>) {
    params.api.showColumnFilter("ag-Grid-AutoColumn");

    this.http
      .get<
        IOlympicData[]
      >("https://www.ag-grid.com/example-assets/olympic-winners.json")
      .subscribe((data) => (this.rowData = data));
  }
}
