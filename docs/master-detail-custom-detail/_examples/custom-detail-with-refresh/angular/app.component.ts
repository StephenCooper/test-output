import { Component } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { AgGridAngular } from "ag-grid-angular";
import "./styles.css";
import {
  ClientSideRowModelApiModule,
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  FirstDataRenderedEvent,
  GridApi,
  GridOptions,
  GridReadyEvent,
  HighlightChangesModule,
  ModuleRegistry,
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
  HighlightChangesModule,
  ClientSideRowModelModule,
  ColumnsToolPanelModule,
  MasterDetailModule,
  ColumnMenuModule,
  ContextMenuModule,
  ValidationModule /* Development Only */,
]);
import { DetailCellRenderer } from "./detail-cell-renderer.component";
import { IAccount } from "./interfaces";

@Component({
  selector: "my-app",
  standalone: true,
  imports: [AgGridAngular, DetailCellRenderer],
  template: `<ag-grid-angular
    style="width: 100%; height: 100%;"
    [columnDefs]="columnDefs"
    [defaultColDef]="defaultColDef"
    [masterDetail]="true"
    [detailCellRenderer]="detailCellRenderer"
    [detailRowHeight]="detailRowHeight"
    [groupDefaultExpanded]="groupDefaultExpanded"
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
  detailCellRenderer: any = DetailCellRenderer;
  detailRowHeight = 70;
  groupDefaultExpanded = 1;
  rowData!: IAccount[];

  constructor(private http: HttpClient) {}

  onFirstDataRendered(params: FirstDataRenderedEvent) {
    setInterval(() => {
      if (!allRowData) {
        return;
      }
      const data = allRowData[0];
      const newCallRecords: any[] = [];
      data.callRecords.forEach((record: any, index: number) => {
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
        params.api!.setGridOption("rowData", allRowData);
      });
  }
}

let allRowData: any[];
