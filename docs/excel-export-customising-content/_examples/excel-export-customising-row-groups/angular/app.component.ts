import { Component } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { AgGridAngular } from "ag-grid-angular";
import "./styles.css";
import {
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  CsvExportModule,
  ExcelExportParams,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ModuleRegistry,
  NumberFilterModule,
  ProcessCellForExportParams,
  ProcessRowGroupForExportParams,
  UseGroupTotalRow,
  ValidationModule,
  createGrid,
} from "ag-grid-community";
import {
  ColumnMenuModule,
  ContextMenuModule,
  ExcelExportModule,
  RowGroupingModule,
  SetFilterModule,
} from "ag-grid-enterprise";
ModuleRegistry.registerModules([
  NumberFilterModule,
  ClientSideRowModelModule,
  CsvExportModule,
  ExcelExportModule,
  ColumnMenuModule,
  ContextMenuModule,
  RowGroupingModule,
  SetFilterModule,
  ValidationModule /* Development Only */,
]);
import { IOlympicData } from "./interfaces";

@Component({
  selector: "my-app",
  standalone: true,
  imports: [AgGridAngular],
  template: `<div class="container">
    <div>
      <button (click)="onBtExport()" style="margin: 5px 0px; font-weight: bold">
        Export to Excel
      </button>
    </div>
    <div class="grid-wrapper">
      <ag-grid-angular
        style="width: 100%; height: 100%;"
        [columnDefs]="columnDefs"
        [defaultColDef]="defaultColDef"
        [groupTotalRow]="groupTotalRow"
        [grandTotalRow]="grandTotalRow"
        [popupParent]="popupParent"
        [defaultExcelExportParams]="defaultExcelExportParams"
        [rowData]="rowData"
        (gridReady)="onGridReady($event)"
      />
    </div>
  </div> `,
})
export class AppComponent {
  private gridApi!: GridApi<IOlympicData>;

  columnDefs: ColDef[] = [
    { field: "athlete", minWidth: 200 },
    { field: "country", minWidth: 200, rowGroup: true, hide: true },
    { field: "sport", minWidth: 150 },
    { field: "gold", aggFunc: "sum" },
  ];
  defaultColDef: ColDef = {
    filter: true,
    minWidth: 150,
    flex: 1,
  };
  groupTotalRow: "top" | "bottom" | UseGroupTotalRow = "bottom";
  grandTotalRow: "top" | "bottom" = "bottom";
  popupParent: HTMLElement | null = document.body;
  defaultExcelExportParams: ExcelExportParams = getParams();
  rowData!: IOlympicData[];

  constructor(private http: HttpClient) {}

  onBtExport() {
    this.gridApi.exportDataAsExcel(getParams());
  }

  onGridReady(params: GridReadyEvent<IOlympicData>) {
    this.gridApi = params.api;

    this.http
      .get<
        IOlympicData[]
      >("https://www.ag-grid.com/example-assets/small-olympic-winners.json")
      .subscribe(
        (data) =>
          (this.rowData = data.filter((rec: any) => rec.country != null)),
      );
  }
}

const getParams: () => ExcelExportParams = () => ({
  processCellCallback(params: ProcessCellForExportParams): string {
    const value = params.value;
    return value === undefined ? "" : `_${value}_`;
  },
  processRowGroupCallback(params: ProcessRowGroupForExportParams): string {
    const { node } = params;
    if (!node.footer) {
      return `row group: ${node.key}`;
    }
    const isRootLevel = node.level === -1;
    if (isRootLevel) {
      return "Grand Total";
    }
    return `Sub Total (${node.key})`;
  },
});
