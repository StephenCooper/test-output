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
  IRowDragItem,
  ModuleRegistry,
  NumberFilterModule,
  RowDragModule,
  RowSelectionModule,
  RowSelectionOptions,
  TextFilterModule,
  ValidationModule,
} from "ag-grid-community";
ModuleRegistry.registerModules([
  TextFilterModule,
  NumberFilterModule,
  RowDragModule,
  RowSelectionModule,
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
    [rowDragManaged]="true"
    [rowDragText]="rowDragText"
    [rowDragMultiRow]="true"
    [rowSelection]="rowSelection"
    [rowData]="rowData"
    (gridReady)="onGridReady($event)"
  /> `,
})
export class AppComponent {
  columnDefs: ColDef[] = [
    {
      field: "athlete",
      rowDrag: true,
      rowDragText: athleteRowDragTextCallback,
    },
    { field: "country", rowDrag: true },
    { field: "year", width: 100 },
    { field: "date" },
    { field: "sport" },
    { field: "gold" },
    { field: "silver" },
    { field: "bronze" },
  ];
  defaultColDef: ColDef = {
    width: 170,
    filter: true,
  };
  rowDragText: (params: IRowDragItem, dragItemCount: number) => string =
    rowDragTextCallback;
  rowSelection: RowSelectionOptions | "single" | "multiple" = {
    mode: "multiRow",
  };
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

const athleteRowDragTextCallback = function (
  params: IRowDragItem,
  dragItemCount: number,
) {
  // keep double equals here because data can be a string or number
  return `${dragItemCount} athlete(s) selected`;
};
const rowDragTextCallback = function (params: IRowDragItem) {
  // keep double equals here because data can be a string or number
  if (params.rowNode!.data.year == "2012") {
    return params.defaultTextValue + " (London Olympics)";
  }
  return params.defaultTextValue;
};
