import { Component } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { AgGridAngular } from "ag-grid-angular";
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
  RowSelectionModule,
  RowSelectionOptions,
  SendToClipboardParams,
  TextEditorModule,
  ValidationModule,
} from "ag-grid-community";
import {
  CellSelectionModule,
  ClipboardModule,
  ColumnMenuModule,
  ContextMenuModule,
} from "ag-grid-enterprise";
ModuleRegistry.registerModules([
  NumberEditorModule,
  TextEditorModule,
  RowSelectionModule,
  ClientSideRowModelModule,
  ClipboardModule,
  ColumnMenuModule,
  ContextMenuModule,
  CellSelectionModule,
  ValidationModule /* Development Only */,
]);
import { IOlympicData } from "./interfaces";

@Component({
  selector: "my-app",
  standalone: true,
  imports: [AgGridAngular],
  template: `<div style="display: flex; height: 100%; flex-direction: column">
    <div style="padding-bottom: 5px">
      <button (click)="onBtCopyRows()">Copy Selected Rows to Clipboard</button>
      <button (click)="onBtCopyRange()">
        Copy Selected Range to Clipboard
      </button>
    </div>

    <ag-grid-angular
      style="width: 100%; height: 100%;"
      [columnDefs]="columnDefs"
      [defaultColDef]="defaultColDef"
      [cellSelection]="true"
      [rowSelection]="rowSelection"
      [sendToClipboard]="sendToClipboard"
      [rowData]="rowData"
      (gridReady)="onGridReady($event)"
    />
  </div> `,
})
export class AppComponent {
  private gridApi!: GridApi<IOlympicData>;

  columnDefs: ColDef[] = [
    { field: "athlete", minWidth: 200 },
    { field: "age" },
    { field: "country", minWidth: 150 },
    { field: "year" },
    { field: "date", minWidth: 150 },
    { field: "sport", minWidth: 150 },
    { field: "gold" },
    { field: "silver" },
    { field: "bronze" },
    { field: "total" },
  ];
  defaultColDef: ColDef = {
    editable: true,
    flex: 1,
    minWidth: 100,
  };
  rowSelection: RowSelectionOptions | "single" | "multiple" = {
    mode: "multiRow",
  };
  rowData!: IOlympicData[];

  constructor(private http: HttpClient) {}

  onBtCopyRows() {
    this.gridApi.copySelectedRowsToClipboard();
  }

  onBtCopyRange() {
    this.gridApi.copySelectedRangeToClipboard();
  }

  onGridReady(params: GridReadyEvent<IOlympicData>) {
    this.gridApi = params.api;

    this.http
      .get<
        IOlympicData[]
      >("https://www.ag-grid.com/example-assets/olympic-winners.json")
      .subscribe((data) => (this.rowData = data));
  }

  sendToClipboard = (params: SendToClipboardParams) => {
    console.log("send to clipboard called with data:");
    console.log(params.data);
  };
}
