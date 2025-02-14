import { Component } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { AgGridAngular } from "ag-grid-angular";
import "./style.css";
import {
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
  NumberEditorModule,
  RowApiModule,
  TextEditorModule,
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
  TextEditorModule,
  NumberEditorModule,
  RowApiModule,
  ClientSideRowModelModule,
  ColumnsToolPanelModule,
  MasterDetailModule,
  ColumnMenuModule,
  ContextMenuModule,
  HighlightChangesModule,
  ValidationModule /* Development Only */,
]);
import { IAccount } from "./interfaces";

@Component({
  selector: "my-app",
  standalone: true,
  imports: [AgGridAngular],
  template: `<div style="display: flex; flex-direction: column; height: 100%">
    <div style="padding-bottom: 4px">
      <button (click)="flashMilaSmithOnly()">Flash Mila Smith</button>
      <button (click)="flashAll()">Flash All</button>
    </div>
    <ag-grid-angular
      style="width: 100%; height: 100%;"
      [columnDefs]="columnDefs"
      [masterDetail]="true"
      [detailRowHeight]="detailRowHeight"
      [detailCellRendererParams]="detailCellRendererParams"
      [getRowId]="getRowId"
      [defaultColDef]="defaultColDef"
      [rowData]="rowData"
      (firstDataRendered)="onFirstDataRendered($event)"
      (gridReady)="onGridReady($event)"
    />
  </div> `,
})
export class AppComponent {
  private gridApi!: GridApi<IAccount>;

  columnDefs: ColDef[] = [
    // group cell renderer needed for expand / collapse icons
    { field: "name", cellRenderer: "agGroupCellRenderer" },
    { field: "account" },
    { field: "calls" },
    { field: "minutes", valueFormatter: "x.toLocaleString() + 'm'" },
  ];
  detailRowHeight = 200;
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
        editable: true,
      },
    },
    getDetailRowData: (params) => {
      params.successCallback(params.data.callRecords);
    },
  } as IDetailCellRendererParams<IAccount, ICallRecord>;
  getRowId: GetRowIdFunc = (params: GetRowIdParams) => {
    // use 'account' as the row ID
    return String(params.data.account);
  };
  defaultColDef: ColDef = {
    flex: 1,
    editable: true,
  };
  rowData!: IAccount[];

  constructor(private http: HttpClient) {}

  onFirstDataRendered(params: FirstDataRenderedEvent) {
    setTimeout(() => {
      params.api.forEachNode(function (node) {
        node.setExpanded(true);
      });
    }, 0);
  }

  flashMilaSmithOnly() {
    // flash Mila Smith - we know her account is 177001 and we use the account for the row ID
    const detailGrid = this.gridApi.getDetailGridInfo("detail_177001");
    if (detailGrid) {
      detailGrid.api!.flashCells();
    }
  }

  flashAll() {
    this.gridApi.forEachDetailGridInfo(function (detailGridApi) {
      detailGridApi.api!.flashCells();
    });
  }

  onGridReady(params: GridReadyEvent<IAccount>) {
    this.gridApi = params.api;

    this.http
      .get<
        IAccount[]
      >("https://www.ag-grid.com/example-assets/master-detail-data.json")
      .subscribe((data) => {
        this.rowData = data;
      });
  }
}
