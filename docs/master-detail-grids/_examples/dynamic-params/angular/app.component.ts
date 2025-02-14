import { Component } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { AgGridAngular } from "ag-grid-angular";
import {
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  FirstDataRenderedEvent,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ICellRendererParams,
  IDetailCellRendererParams,
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
    [masterDetail]="true"
    [detailRowHeight]="detailRowHeight"
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
  };
  detailRowHeight = 195;
  detailCellRendererParams: any = (params: ICellRendererParams) => {
    const res = {} as IDetailCellRendererParams;
    // we use the same getDetailRowData for both options
    res.getDetailRowData = function (params) {
      params.successCallback(params.data.callRecords);
    };
    const nameMatch =
      params.data.name === "Mila Smith" ||
      params.data.name === "Harper Johnson";
    if (nameMatch) {
      // grid options for columns {callId, number}
      res.detailGridOptions = {
        columnDefs: [{ field: "callId" }, { field: "number" }],
        defaultColDef: {
          flex: 1,
        },
      };
    } else {
      // grid options for columns {callId, direction, duration, switchCode}
      res.detailGridOptions = {
        columnDefs: [
          { field: "callId" },
          { field: "direction" },
          { field: "duration", valueFormatter: "x.toLocaleString() + 's'" },
          { field: "switchCode" },
        ],
        defaultColDef: {
          flex: 1,
        },
      };
    }
    return res;
  };
  rowData!: IAccount[];

  constructor(private http: HttpClient) {}

  onFirstDataRendered(params: FirstDataRenderedEvent) {
    // arbitrarily expand a row for presentational purposes
    setTimeout(() => {
      const node1 = params.api.getDisplayedRowAtIndex(1)!;
      const node2 = params.api.getDisplayedRowAtIndex(2)!;
      node1.setExpanded(true);
      node2.setExpanded(true);
    }, 0);
  }

  onGridReady(params: GridReadyEvent<IAccount>) {
    this.http
      .get<
        IAccount[]
      >("https://www.ag-grid.com/example-assets/master-detail-data.json")
      .subscribe((data) => {
        this.rowData = data;
      });
  }
}
