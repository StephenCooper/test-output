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
  IDetailCellRendererParams,
  ModuleRegistry,
  RenderApiModule,
  RowApiModule,
  RowHeightParams,
  ValidationModule,
} from "ag-grid-community";
import {
  ColumnMenuModule,
  ColumnsToolPanelModule,
  ContextMenuModule,
  MasterDetailModule,
} from "ag-grid-enterprise";
ModuleRegistry.registerModules([
  RenderApiModule,
  RowApiModule,
  ClientSideRowModelModule,
  ColumnsToolPanelModule,
  MasterDetailModule,
  ColumnMenuModule,
  ContextMenuModule,
  ValidationModule /* Development Only */,
]);

@Component({
  selector: "my-app",
  standalone: true,
  imports: [AgGridAngular],
  template: `<ag-grid-angular
    style="width: 100%; height: 100%;"
    [columnDefs]="columnDefs"
    [defaultColDef]="defaultColDef"
    [masterDetail]="true"
    [detailCellRendererParams]="detailCellRendererParams"
    [getRowHeight]="getRowHeight"
    [alwaysShowVerticalScroll]="true"
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
  detailCellRendererParams: any = {
    detailGridOptions: {
      columnDefs: [
        { field: "callId" },
        { field: "direction" },
        { field: "number" },
        { field: "duration", valueFormatter: "x.toLocaleString() + 's'" },
        { field: "switchCode" },
      ],
      defaultColDef: {
        flex: 1,
      },
      onGridReady: (params) => {
        // using auto height to fit the height of the the detail grid
        params.api.setGridOption("domLayout", "autoHeight");
      },
    },
    getDetailRowData: (params) => {
      params.successCallback(params.data.callRecords);
    },
  } as IDetailCellRendererParams<IAccount, ICallRecord>;
  getRowHeight: (params: RowHeightParams) => number | undefined | null = (
    params: RowHeightParams,
  ) => {
    if (params.node && params.node.detail) {
      const offset = 80;
      const allDetailRowHeight =
        params.data.callRecords.length *
        params.api.getSizesForCurrentTheme().rowHeight;
      const gridSizes = params.api.getSizesForCurrentTheme();
      return (
        allDetailRowHeight +
        ((gridSizes && gridSizes.headerHeight) || 0) +
        offset
      );
    }
  };
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
      >("https://www.ag-grid.com/example-assets/master-detail-dynamic-row-height-data.json")
      .subscribe((data) => {
        this.rowData = data;
      });
  }
}
