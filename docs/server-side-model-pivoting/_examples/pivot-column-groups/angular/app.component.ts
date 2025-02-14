import { Component } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { AgGridAngular } from "ag-grid-angular";
import "./styles.css";
import {
  ColDef,
  ColGroupDef,
  GridApi,
  GridOptions,
  GridReadyEvent,
  IServerSideDatasource,
  ModuleRegistry,
  RowModelType,
  ValidationModule,
  createGrid,
} from "ag-grid-community";
import {
  ColumnMenuModule,
  ColumnsToolPanelModule,
  ContextMenuModule,
  RowGroupingModule,
  ServerSideRowModelModule,
} from "ag-grid-enterprise";
import { FakeServer } from "./fakeServer";
ModuleRegistry.registerModules([
  ColumnsToolPanelModule,
  ColumnMenuModule,
  ContextMenuModule,
  RowGroupingModule,
  ServerSideRowModelModule,
  ValidationModule /* Development Only */,
]);
import { IOlympicData } from "./interfaces";

@Component({
  selector: "my-app",
  standalone: true,
  imports: [AgGridAngular],
  template: `<div class="example-wrapper">
    <div style="margin-bottom: 5px">
      <button (click)="expand('2000', true)">Expand 2000</button>
      <button (click)="expand('2000')">Collapse 2000</button>
      <button (click)="expand(undefined, true)">Expand All</button>
      <button (click)="expand(undefined)">Collapse All</button>
    </div>
    <ag-grid-angular
      style="width: 100%; height: 100%;"
      [columnDefs]="columnDefs"
      [defaultColDef]="defaultColDef"
      [autoGroupColumnDef]="autoGroupColumnDef"
      [rowModelType]="rowModelType"
      [pivotMode]="true"
      [processPivotResultColDef]="processPivotResultColDef"
      [rowData]="rowData"
      (gridReady)="onGridReady($event)"
    />
  </div> `,
})
export class AppComponent {
  private gridApi!: GridApi<IOlympicData>;

  columnDefs: ColDef[] = [
    { field: "country", rowGroup: true },
    { field: "sport", rowGroup: true },
    { field: "year", pivot: true },
    { field: "total", aggFunc: "sum" },
    { field: "gold", aggFunc: "sum" },
    { field: "silver", aggFunc: "sum" },
    { field: "bronze", aggFunc: "sum" },
  ];
  defaultColDef: ColDef = {
    width: 150,
  };
  autoGroupColumnDef: ColDef = {
    minWidth: 200,
  };
  rowModelType: RowModelType = "serverSide";
  processPivotResultColDef: (colDef: ColDef) => void = (colDef: ColDef) => {
    const pivotValueColumn = colDef.pivotValueColumn;
    if (!pivotValueColumn) return;
    // if column is not the total column, it should only be shown when expanded.
    // this will enable expandable column groups.
    if (pivotValueColumn.getColId() !== "total") {
      colDef.columnGroupShow = "open";
    }
  };
  rowData!: IOlympicData[];

  constructor(private http: HttpClient) {}

  expand(key?: string, open = false) {
    if (key) {
      this.gridApi.setColumnGroupState([{ groupId: key, open: open }]);
      return;
    }
    const existingState = this.gridApi.getColumnGroupState();
    const expandedState = existingState.map(
      (s: { groupId: string; open: boolean }) => ({
        groupId: s.groupId,
        open: open,
      }),
    );
    this.gridApi.setColumnGroupState(expandedState);
  }

  onGridReady(params: GridReadyEvent<IOlympicData>) {
    this.gridApi = params.api;

    this.http
      .get<
        IOlympicData[]
      >("https://www.ag-grid.com/example-assets/olympic-winners.json")
      .subscribe((data) => {
        // setup the fake server with entire dataset
        const fakeServer = new FakeServer(data);
        // create datasource with a reference to the fake server
        const datasource = getServerSideDatasource(fakeServer);
        // register the datasource with the grid
        params.api!.setGridOption("serverSideDatasource", datasource);
      });
  }
}

function getServerSideDatasource(server: any): IServerSideDatasource {
  return {
    getRows: (params) => {
      const request = params.request;
      console.log("[Datasource] - rows requested by grid: ", params.request);
      const response = server.getData(request);
      // simulating real server call with a 500ms delay
      setTimeout(() => {
        if (response.success) {
          // supply data to grid
          params.success({
            rowData: response.rows,
            rowCount: response.lastRow,
            pivotResultFields: response.pivotFields,
          });
        } else {
          params.fail();
        }
      }, 500);
    },
  };
}
