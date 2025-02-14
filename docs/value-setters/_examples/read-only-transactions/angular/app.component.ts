import { Component } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { AgGridAngular } from "ag-grid-angular";
import {
  CellEditRequestEvent,
  ClientSideRowModelApiModule,
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  GetRowIdFunc,
  GetRowIdParams,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ModuleRegistry,
  NumberEditorModule,
  TextEditorModule,
  ValidationModule,
} from "ag-grid-community";
ModuleRegistry.registerModules([
  ClientSideRowModelApiModule,
  NumberEditorModule,
  TextEditorModule,
  ClientSideRowModelModule,
  ValidationModule /* Development Only */,
]);
import { IOlympicDataWithId } from "./interfaces";

@Component({
  selector: "my-app",
  standalone: true,
  imports: [AgGridAngular],
  template: `<ag-grid-angular
    style="width: 100%; height: 100%;"
    [columnDefs]="columnDefs"
    [defaultColDef]="defaultColDef"
    [getRowId]="getRowId"
    [readOnlyEdit]="true"
    [rowData]="rowData"
    (cellEditRequest)="onCellEditRequest($event)"
    (gridReady)="onGridReady($event)"
  /> `,
})
export class AppComponent {
  columnDefs: ColDef[] = [
    { field: "athlete", minWidth: 160 },
    { field: "age" },
    { field: "country", minWidth: 140 },
    { field: "year" },
    { field: "date", minWidth: 140 },
    { field: "sport", minWidth: 160 },
    { field: "gold" },
    { field: "silver" },
    { field: "bronze" },
    { field: "total" },
  ];
  defaultColDef: ColDef = {
    flex: 1,
    minWidth: 100,
    editable: true,
  };
  getRowId: GetRowIdFunc = (params: GetRowIdParams) => params.data.id;
  rowData!: IOlympicDataWithId[];

  constructor(private http: HttpClient) {}

  onCellEditRequest(event: CellEditRequestEvent) {
    const oldData = event.data;
    const field = event.colDef.field;
    const newValue = event.newValue;
    const newData = { ...oldData };
    newData[field!] = event.newValue;
    console.log("onCellEditRequest, updating " + field + " to " + newValue);
    const tx = {
      update: [newData],
    };
    event.api.applyTransaction(tx);
  }

  onGridReady(params: GridReadyEvent<IOlympicDataWithId>) {
    this.http
      .get<
        IOlympicDataWithId[]
      >("https://www.ag-grid.com/example-assets/olympic-winners.json")
      .subscribe((data) => {
        data.forEach((item, index) => (item.id = String(index)));
        this.rowData = data;
      });
  }
}
