import { Component } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { AgGridAngular } from "ag-grid-angular";
import "./style.css";
import {
  ClientSideRowModelApiModule,
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  FirstDataRenderedEvent,
  GetRowIdFunc,
  GetRowIdParams,
  GridApi,
  GridOptions,
  GridReadyEvent,
  IDetailCellRendererParams,
  IsRowMaster,
  ModuleRegistry,
  RowApiModule,
  ValidationModule,
} from "ag-grid-community";
import {
  ColumnMenuModule,
  ColumnsToolPanelModule,
  ContextMenuModule,
  MasterDetailModule,
} from "ag-grid-enterprise";
ModuleRegistry.registerModules([
  RowApiModule,
  ClientSideRowModelModule,
  ClientSideRowModelApiModule,
  ColumnsToolPanelModule,
  MasterDetailModule,
  ColumnMenuModule,
  ContextMenuModule,
  ValidationModule /* Development Only */,
]);
import { CallsCellRenderer } from "./calls-cell-renderer.component";

@Component({
  selector: "my-app",
  standalone: true,
  imports: [AgGridAngular, CallsCellRenderer],
  template: `<ag-grid-angular
    style="width: 100%; height: 100%;"
    [masterDetail]="true"
    [isRowMaster]="isRowMaster"
    [columnDefs]="columnDefs"
    [defaultColDef]="defaultColDef"
    [getRowId]="getRowId"
    [detailCellRendererParams]="detailCellRendererParams"
    [rowData]="rowData"
    (firstDataRendered)="onFirstDataRendered($event)"
    (gridReady)="onGridReady($event)"
  /> `,
})
export class AppComponent {
  isRowMaster: IsRowMaster = (dataItem: any) => {
    return dataItem ? dataItem.callRecords.length > 0 : false;
  };
  columnDefs: ColDef[] = [
    // group cell renderer needed for expand / collapse icons
    { field: "name", cellRenderer: "agGroupCellRenderer" },
    { field: "account" },
    { field: "calls", cellRenderer: CallsCellRenderer },
    { field: "minutes", valueFormatter: "x.toLocaleString() + 'm'" },
  ];
  defaultColDef: ColDef = {
    flex: 1,
  };
  getRowId: GetRowIdFunc = (params: GetRowIdParams) =>
    String(params.data.account);
  detailCellRendererParams: any = {
    detailGridOptions: {
      columnDefs: [
        { field: "callId" },
        { field: "direction" },
        { field: "number", minWidth: 150 },
        { field: "duration", valueFormatter: "x.toLocaleString() + 's'" },
        { field: "switchCode", minWidth: 150 },
      ],
      defaultColDef: {
        flex: 1,
      },
    },
    getDetailRowData: (params) => {
      params.successCallback(params.data.callRecords);
    },
  } as IDetailCellRendererParams<IAccount, ICallRecord>;
  rowData!: any[];

  constructor(private http: HttpClient) {}

  onFirstDataRendered(params: FirstDataRenderedEvent) {
    // arbitrarily expand a row for presentational purposes
    setTimeout(() => {
      params.api.getDisplayedRowAtIndex(1)!.setExpanded(true);
    }, 0);
  }

  onGridReady(params: GridReadyEvent) {
    this.http
      .get<
        any[]
      >("https://www.ag-grid.com/example-assets/master-detail-dynamic-data.json")
      .subscribe((data) => {
        this.rowData = data;
      });
  }
}
