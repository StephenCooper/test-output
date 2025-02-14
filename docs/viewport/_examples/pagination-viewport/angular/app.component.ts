import { Component } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { AgGridAngular } from "ag-grid-angular";
import {
  CellStyleModule,
  ColDef,
  ColGroupDef,
  GetRowIdFunc,
  GetRowIdParams,
  GridApi,
  GridOptions,
  GridReadyEvent,
  HighlightChangesModule,
  ICellRendererComp,
  ICellRendererParams,
  ModuleRegistry,
  PaginationModule,
  RowModelType,
  RowSelectionModule,
  RowSelectionOptions,
  ValidationModule,
  ValueFormatterParams,
  createGrid,
} from "ag-grid-community";
import { ViewportRowModelModule } from "ag-grid-enterprise";
import { createMockServer } from "./mock-server";
import { createViewportDatasource } from "./viewport-datasource";
ModuleRegistry.registerModules([
  RowSelectionModule,
  PaginationModule,
  CellStyleModule,
  ViewportRowModelModule,
  HighlightChangesModule,
  ValidationModule /* Development Only */,
]);

@Component({
  selector: "my-app",
  standalone: true,
  imports: [AgGridAngular],
  template: `
    <ag-grid-angular
      style="width: 100%; height: 100%;"
      [columnDefs]="columnDefs"
      [defaultColDef]="defaultColDef"
      [rowModelType]="rowModelType"
      [pagination]="true"
      [paginationAutoPageSize]="true"
      [viewportRowModelPageSize]="viewportRowModelPageSize"
      [viewportRowModelBufferSize]="viewportRowModelBufferSize"
      [getRowId]="getRowId"
      [rowSelection]="rowSelection"
      [rowData]="rowData"
      (gridReady)="onGridReady($event)"
    />
  `,
})
export class AppComponent {
  columnDefs: ColDef[] = [
    // this col shows the row index, doesn't use any data from the row
    {
      headerName: "#",
      maxWidth: 80,
      cellRenderer: RowIndexRenderer,
    },
    { field: "code", maxWidth: 90 },
    { field: "name", minWidth: 220 },
    {
      field: "bid",
      cellClass: "cell-number",
      valueFormatter: numberFormatter,
      cellRenderer: "agAnimateShowChangeCellRenderer",
    },
    {
      field: "mid",
      cellClass: "cell-number",
      valueFormatter: numberFormatter,
      cellRenderer: "agAnimateShowChangeCellRenderer",
    },
    {
      field: "ask",
      cellClass: "cell-number",
      valueFormatter: numberFormatter,
      cellRenderer: "agAnimateShowChangeCellRenderer",
    },
    {
      field: "volume",
      cellClass: "cell-number",
      cellRenderer: "agAnimateSlideCellRenderer",
    },
  ];
  defaultColDef: ColDef = {
    flex: 1,
    minWidth: 140,
    sortable: false,
  };
  rowModelType: RowModelType = "viewport";
  viewportRowModelPageSize = 1;
  viewportRowModelBufferSize = 0;
  getRowId: GetRowIdFunc = (params: GetRowIdParams) => {
    // the code is unique, so perfect for the id
    return params.data.code;
  };
  rowSelection: RowSelectionOptions | "single" | "multiple" = {
    mode: "multiRow",
    headerCheckbox: false,
  };
  rowData!: any[];

  constructor(private http: HttpClient) {}

  onGridReady(params: GridReadyEvent) {
    this.http
      .get<any[]>("https://www.ag-grid.com/example-assets/stocks.json")
      .subscribe((data) => {
        // set up a mock server - real code will not do this, it will contact your
        // real server to get what it needs
        const mockServer = createMockServer();
        mockServer.init(data);
        const viewportDatasource = createViewportDatasource(mockServer);
        params.api!.setGridOption("viewportDatasource", viewportDatasource);
      });
  }
}

class RowIndexRenderer implements ICellRendererComp {
  eGui!: HTMLDivElement;
  init(params: ICellRendererParams) {
    this.eGui = document.createElement("div");
    this.eGui.textContent = "" + params.node.rowIndex;
  }
  refresh(params: ICellRendererParams): boolean {
    return false;
  }
  getGui(): HTMLElement {
    return this.eGui;
  }
}

function numberFormatter(params: ValueFormatterParams) {
  if (typeof params.value === "number") {
    return params.value.toFixed(2);
  } else {
    return params.value;
  }
}
