import { Component } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { AgGridAngular } from "ag-grid-angular";
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
  HighlightChangesModule,
  IDetailCellRendererParams,
  ModuleRegistry,
  RowApiModule,
  RowSelectionModule,
  ValidationModule,
} from "ag-grid-community";
import {
  ColumnMenuModule,
  ColumnsToolPanelModule,
  ContextMenuModule,
  MasterDetailModule,
} from "ag-grid-enterprise";
ModuleRegistry.registerModules([
  ClientSideRowModelApiModule,
  RowSelectionModule,
  RowApiModule,
  HighlightChangesModule,
  ClientSideRowModelModule,
  ColumnsToolPanelModule,
  MasterDetailModule,
  ColumnMenuModule,
  ContextMenuModule,
  ValidationModule /* Development Only */,
]);
import { IAccount } from "./interfaces";

@Component({
  selector: "my-app",
  standalone: true,
  imports: [AgGridAngular],
  template: `<ag-grid-angular
    style="width: 100%; height: 100%;"
    [columnDefs]="columnDefs"
    [defaultColDef]="defaultColDef"
    [getRowId]="getRowId"
    [masterDetail]="true"
    [detailCellRendererParams]="detailCellRendererParams"
    [rowData]="rowData"
    (firstDataRendered)="onFirstDataRendered($event)"
    (gridReady)="onGridReady($event)"
  /> `,
})
export class AppComponent {
  columnDefs: ColDef[] = [
    // group cell renderer needed for expand / collapse icons
    { field: "name", cellRenderer: "agGroupCellRenderer" },
    { field: "account" },
    { field: "calls" },
    { field: "minutes", valueFormatter: "x.toLocaleString() + 'm'" },
  ];
  defaultColDef: ColDef = {
    flex: 1,
    enableCellChangeFlash: true,
  };
  getRowId: GetRowIdFunc = (params: GetRowIdParams) =>
    String(params.data.account);
  detailCellRendererParams: any = {
    refreshStrategy: "nothing",
    template: (params) => {
      return (
        '<div class="ag-details-row ag-details-row-fixed-height">' +
        '<div style="padding: 4px; font-weight: bold;">' +
        (params.data ? params.data!.name : "") +
        " " +
        (params.data ? params.data!.calls : "") +
        " calls</div>" +
        '<div data-ref="eDetailGrid" class="ag-details-grid ag-details-grid-fixed-height"/>' +
        "</div>"
      );
    },
    detailGridOptions: {
      rowSelection: {
        mode: "multiRow",
        headerCheckbox: false,
      },
      getRowId: (params: GetRowIdParams) => String(params.data.callId),
      columnDefs: [
        { field: "callId" },
        { field: "direction" },
        { field: "number", minWidth: 150 },
        { field: "duration", valueFormatter: "x.toLocaleString() + 's'" },
        { field: "switchCode", minWidth: 150 },
      ],
      defaultColDef: {
        flex: 1,
        enableCellChangeFlash: true,
      },
    },
    getDetailRowData: (params) => {
      // params.successCallback([]);
      params.successCallback(params.data.callRecords);
    },
  } as IDetailCellRendererParams<IAccount, ICallRecord>;
  rowData!: IAccount[];

  constructor(private http: HttpClient) {}

  onFirstDataRendered(params: FirstDataRenderedEvent) {
    // arbitrarily expand a row for presentational purposes
    setTimeout(() => {
      params.api.getDisplayedRowAtIndex(0)!.setExpanded(true);
    }, 0);
    setInterval(() => {
      if (!allRowData) {
        return;
      }
      const data = allRowData[0];
      const newCallRecords: ICallRecord[] = [];
      data.callRecords.forEach(function (record: any, index: number) {
        newCallRecords.push({
          name: record.name,
          callId: record.callId,
          duration: record.duration + (index % 2),
          switchCode: record.switchCode,
          direction: record.direction,
          number: record.number,
        });
      });
      data.callRecords = newCallRecords;
      data.calls++;
      const tran = {
        update: [data],
      };
      params.api.applyTransaction(tran);
    }, 2000);
  }

  onGridReady(params: GridReadyEvent<IAccount>) {
    this.http
      .get<
        IAccount[]
      >("https://www.ag-grid.com/example-assets/master-detail-data.json")
      .subscribe((data) => {
        allRowData = data;
        this.rowData = data;
      });
  }
}

let allRowData: any[];
