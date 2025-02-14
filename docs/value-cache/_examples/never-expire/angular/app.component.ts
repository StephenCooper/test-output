import { Component } from "@angular/core";
import { AgGridAngular } from "ag-grid-angular";
import {
  CellStyleModule,
  ClientSideRowModelApiModule,
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  ColTypeDef,
  GetRowIdFunc,
  GetRowIdParams,
  GridApi,
  GridOptions,
  GridReadyEvent,
  HighlightChangesModule,
  ModuleRegistry,
  NumberEditorModule,
  RenderApiModule,
  RowApiModule,
  TextEditorModule,
  ValidationModule,
  ValueCacheModule,
  ValueFormatterParams,
  ValueGetterParams,
  createGrid,
} from "ag-grid-community";
import { RowGroupingModule } from "ag-grid-enterprise";
import { getData } from "./data";
ModuleRegistry.registerModules([
  ClientSideRowModelApiModule,
  RowApiModule,
  RenderApiModule,
  NumberEditorModule,
  TextEditorModule,
  ValueCacheModule,
  HighlightChangesModule,
  CellStyleModule,
  ClientSideRowModelModule,
  RowGroupingModule,
  ValidationModule /* Development Only */,
]);

@Component({
  selector: "my-app",
  standalone: true,
  imports: [AgGridAngular],
  template: `
    <div style="height: 100%; box-sizing: border-box; padding-top: 45px">
      <ag-grid-angular
        style="width: 100%; height: 100%;"
        [columnDefs]="columnDefs"
        [defaultColDef]="defaultColDef"
        [autoGroupColumnDef]="autoGroupColumnDef"
        [columnTypes]="columnTypes"
        [valueCache]="true"
        [valueCacheNeverExpires]="true"
        [rowData]="rowData"
        [suppressAggFuncInHeader]="true"
        [groupDefaultExpanded]="groupDefaultExpanded"
        [getRowId]="getRowId"
        (cellValueChanged)="onCellValueChanged($event)"
        (gridReady)="onGridReady($event)"
      />
    </div>
    <div style="position: absolute; top: 0; left: 15px">
      <button (click)="onUpdateOneValue()">Update One Value</button>
      <button (click)="onExpireValueCache()">Expire Value Cache</button>
      <button (click)="onRefreshCells()">
        Aggregate Data &amp; Refresh Cells
      </button>
    </div>
  `,
})
export class AppComponent {
  private gridApi!: GridApi;

  columnDefs: ColDef[] = [
    { field: "q1", type: "quarterFigure" },
    { field: "q2", type: "quarterFigure" },
    { field: "q3", type: "quarterFigure" },
    { field: "q4", type: "quarterFigure" },
    { field: "year", rowGroup: true, hide: true },
    {
      headerName: "Total",
      colId: "total",
      cellClass: ["number-cell", "total-col"],
      aggFunc: "sum",
      valueFormatter: formatNumber,
      valueGetter: totalValueGetter,
    },
    {
      headerName: "Total x 10",
      cellClass: ["number-cell", "total-col"],
      aggFunc: "sum",
      minWidth: 120,
      valueFormatter: formatNumber,
      valueGetter: total10ValueGetter,
    },
  ];
  defaultColDef: ColDef = {
    flex: 1,
    enableCellChangeFlash: true,
  };
  autoGroupColumnDef: ColDef = {
    minWidth: 130,
  };
  columnTypes: {
    [key: string]: ColTypeDef;
  } = {
    quarterFigure: {
      editable: true,
      cellClass: "number-cell",
      aggFunc: "sum",
      valueFormatter: formatNumber,
      valueParser: function numberParser(params) {
        return Number(params.newValue);
      },
    },
  };
  rowData: any[] | null = getData();
  groupDefaultExpanded = 1;
  getRowId: GetRowIdFunc = (params: GetRowIdParams) => {
    return String(params.data.id);
  };

  onCellValueChanged() {
    console.log("onCellValueChanged");
  }

  onExpireValueCache() {
    console.log("onInvalidateValueCache -> start");
    this.gridApi.expireValueCache();
    console.log("onInvalidateValueCache -> end");
  }

  onRefreshCells() {
    console.log("onRefreshCells -> start");
    this.gridApi.refreshClientSideRowModel("aggregate");
    this.gridApi.refreshCells();
    console.log("onRefreshCells -> end");
  }

  onUpdateOneValue() {
    const randomId = Math.floor(Math.random() * 10) + "";
    const rowNode = this.gridApi.getRowNode(randomId);
    if (rowNode) {
      const randomCol = ["q1", "q2", "q3", "q4"][Math.floor(Math.random() * 4)];
      const newValue = Math.floor(Math.random() * 1000);
      console.log("onUpdateOneValue -> start");
      rowNode.setDataValue(randomCol, newValue);
      console.log("onUpdateOneValue -> end");
    }
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }
}

let callCount = 1;
const totalValueGetter = function (params: ValueGetterParams) {
  const q1 = params.getValue("q1");
  const q2 = params.getValue("q2");
  const q3 = params.getValue("q3");
  const q4 = params.getValue("q4");
  const result = q1 + q2 + q3 + q4;
  console.log(
    "Total Value Getter (" +
      callCount +
      ", " +
      params.column.getId() +
      "): " +
      [q1, q2, q3, q4].join(", ") +
      " = " +
      result,
  );
  callCount++;
  return result;
};
const total10ValueGetter = function (params: ValueGetterParams) {
  const total = params.getValue("total");
  return total * 10;
};
function formatNumber(params: ValueFormatterParams) {
  const number = params.value;
  return Math.floor(number).toLocaleString();
}
