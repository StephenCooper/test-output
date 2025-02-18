import { Component } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { AgGridAngular } from "ag-grid-angular";
import "./style.css";
import {
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  CsvCell,
  CsvExportParams,
  ExcelCell,
  ExcelExportParams,
  ExcelRow,
  ExcelStyle,
  GridApi,
  GridOptions,
  GridReadyEvent,
  IDetailCellRendererParams,
  ModuleRegistry,
  ProcessRowGroupForExportParams,
  ValidationModule,
} from "ag-grid-community";
import {
  ClipboardModule,
  ColumnMenuModule,
  ColumnsToolPanelModule,
  ContextMenuModule,
  ExcelExportModule,
  MasterDetailModule,
} from "ag-grid-enterprise";
ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  ClipboardModule,
  ColumnsToolPanelModule,
  ExcelExportModule,
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
  template: `<div class="container">
    <div>
      <button
        (click)="onBtExport()"
        style="margin-bottom: 5px; font-weight: bold"
      >
        Export to Excel
      </button>
    </div>
    <div class="grid-wrapper">
      <ag-grid-angular
        style="width: 100%; height: 100%;"
        [defaultCsvExportParams]="defaultCsvExportParams"
        [defaultExcelExportParams]="defaultExcelExportParams"
        [columnDefs]="columnDefs"
        [defaultColDef]="defaultColDef"
        [masterDetail]="true"
        [detailCellRendererParams]="detailCellRendererParams"
        [excelStyles]="excelStyles"
        [rowData]="rowData"
        (gridReady)="onGridReady($event)"
      />
    </div>
  </div> `,
})
export class AppComponent {
  private gridApi!: GridApi<IAccount>;

  defaultCsvExportParams: CsvExportParams = {
    getCustomContentBelowRow: (params) => {
      const rows = getRows(params);
      return rows.map((row) => row.cells) as CsvCell[][];
    },
  };
  defaultExcelExportParams: ExcelExportParams = {
    getCustomContentBelowRow: (params) => getRows(params) as ExcelRow[],
    columnWidth: 120,
    fileName: "ag-grid.xlsx",
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
  excelStyles: ExcelStyle[] = [
    {
      id: "header",
      interior: {
        color: "#aaaaaa",
        pattern: "Solid",
      },
    },
    {
      id: "body",
      interior: {
        color: "#dddddd",
        pattern: "Solid",
      },
    },
  ];
  rowData!: IAccount[];

  constructor(private http: HttpClient) {}

  onBtExport() {
    this.gridApi.exportDataAsExcel();
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

const getRows = (params: ProcessRowGroupForExportParams) => {
  const rows = [
    {
      outlineLevel: 1,
      cells: [
        cell(""),
        cell("Call Id", "header"),
        cell("Direction", "header"),
        cell("Number", "header"),
        cell("Duration", "header"),
        cell("Switch Code", "header"),
      ],
    },
  ].concat(
    ...params.node.data.callRecords.map((record: any) => [
      {
        outlineLevel: 1,
        cells: [
          cell(""),
          cell(record.callId, "body"),
          cell(record.direction, "body"),
          cell(record.number, "body"),
          cell(record.duration, "body"),
          cell(record.switchCode, "body"),
        ],
      },
    ]),
  );
  return rows;
};
function cell(text: string, styleId?: string): ExcelCell {
  return {
    styleId: styleId,
    data: {
      type: /^\d+$/.test(text) ? "Number" : "String",
      value: String(text),
    },
  };
}
