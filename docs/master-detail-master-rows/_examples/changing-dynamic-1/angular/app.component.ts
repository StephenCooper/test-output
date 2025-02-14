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
  IDetailCellRendererParams,
  IsRowMaster,
  ModuleRegistry,
  RowApiModule,
  ValidationModule,
  createGrid,
} from "ag-grid-community";
import {
  ColumnMenuModule,
  ColumnsToolPanelModule,
  ContextMenuModule,
  MasterDetailModule,
} from "ag-grid-enterprise";
ModuleRegistry.registerModules([
  ClientSideRowModelApiModule,
  RowApiModule,
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
  template: `<div style="display: flex; flex-direction: column; height: 100%">
    <div style="padding-bottom: 4px">
      <button (click)="onBtClearMilaCalls()">Clear Mila Calls</button>
      <button (click)="onBtSetMilaCalls()">Set Mila Calls</button>
    </div>
    <ag-grid-angular
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
    />
  </div> `,
})
export class AppComponent {
  private gridApi!: GridApi<IAccount>;

  isRowMaster: IsRowMaster = (dataItem: any) => {
    return dataItem ? dataItem.callRecords.length > 0 : false;
  };
  columnDefs: ColDef[] = [
    // group cell renderer needed for expand / collapse icons
    { field: "name", cellRenderer: "agGroupCellRenderer" },
    { field: "account" },
    { field: "calls" },
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
  rowData!: IAccount[];

  constructor(private http: HttpClient) {}

  onFirstDataRendered(params: FirstDataRenderedEvent) {
    // arbitrarily expand a row for presentational purposes
    setTimeout(() => {
      params.api.getDisplayedRowAtIndex(1)!.setExpanded(true);
    }, 0);
  }

  onBtClearMilaCalls() {
    const milaSmithRowNode = this.gridApi.getRowNode("177001")!;
    const milaSmithData = milaSmithRowNode.data!;
    milaSmithData.callRecords = [];
    milaSmithData.calls = milaSmithData.callRecords.length;
    this.gridApi.applyTransaction({ update: [milaSmithData] });
  }

  onBtSetMilaCalls() {
    const milaSmithRowNode = this.gridApi.getRowNode("177001")!;
    const milaSmithData = milaSmithRowNode.data!;
    milaSmithData.callRecords = [
      {
        name: "susan",
        callId: 579,
        duration: 23,
        switchCode: "SW5",
        direction: "Out",
        number: "(02) 47485405",
      },
      {
        name: "susan",
        callId: 580,
        duration: 52,
        switchCode: "SW3",
        direction: "In",
        number: "(02) 32367069",
      },
    ];
    milaSmithData.calls = milaSmithData.callRecords.length;
    this.gridApi.applyTransaction({ update: [milaSmithData] });
  }

  onGridReady(params: GridReadyEvent<IAccount>) {
    this.gridApi = params.api;

    this.http
      .get<
        IAccount[]
      >("https://www.ag-grid.com/example-assets/master-detail-dynamic-data.json")
      .subscribe((data) => {
        this.rowData = data;
      });
  }
}
