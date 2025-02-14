import { Component } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { AgGridAngular } from "ag-grid-angular";
import {
  CellEditRequestEvent,
  CellSelectionOptions,
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
import { CellSelectionModule, ClipboardModule } from "ag-grid-enterprise";
ModuleRegistry.registerModules([
  NumberEditorModule,
  TextEditorModule,
  ClientSideRowModelModule,
  ClipboardModule,
  CellSelectionModule,
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
    [cellSelection]="true"
    [readOnlyEdit]="true"
    [rowData]="rowData"
    (cellEditRequest)="onCellEditRequest($event)"
    (gridReady)="onGridReady($event)"
  /> `,
})
export class AppComponent {
  private gridApi!: GridApi<IOlympicDataWithId>;

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
  getRowId: GetRowIdFunc = (params: GetRowIdParams) => String(params.data.id);
  rowData!: IOlympicDataWithId[];

  constructor(private http: HttpClient) {}

  onCellEditRequest(event: CellEditRequestEvent) {
    const data = event.data;
    const field = event.colDef.field;
    const newValue = event.newValue;
    const oldItem = rowImmutableStore.find((row) => row.id === data.id);
    if (!oldItem || !field) {
      return;
    }
    const newItem = { ...oldItem };
    newItem[field] = newValue;
    console.log("onCellEditRequest, updating " + field + " to " + newValue);
    rowImmutableStore = rowImmutableStore.map((oldItem) =>
      oldItem.id == newItem.id ? newItem : oldItem,
    );
    this.gridApi.setGridOption("rowData", rowImmutableStore);
  }

  onGridReady(params: GridReadyEvent<IOlympicDataWithId>) {
    this.gridApi = params.api;

    this.http
      .get<
        IOlympicDataWithId[]
      >("https://www.ag-grid.com/example-assets/olympic-winners.json")
      .subscribe((data) => {
        data.forEach((item, index) => (item.id = index));
        rowImmutableStore = data;
        params.api!.setGridOption("rowData", rowImmutableStore);
      });
  }
}

let rowImmutableStore: any[];
