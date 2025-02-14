import { Component } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { AgGridAngular } from "ag-grid-angular";
import "./styles.css";
import {
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  ExcelExportParams,
  ExcelRow,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ModuleRegistry,
  NumberFilterModule,
  TextFilterModule,
  ValidationModule,
  createGrid,
} from "ag-grid-community";
import {
  ColumnMenuModule,
  ContextMenuModule,
  ExcelExportModule,
} from "ag-grid-enterprise";
ModuleRegistry.registerModules([
  TextFilterModule,
  NumberFilterModule,
  ClientSideRowModelModule,
  ExcelExportModule,
  ColumnMenuModule,
  ContextMenuModule,
  ValidationModule /* Development Only */,
]);
import { IOlympicData } from "./interfaces";

@Component({
  selector: "my-app",
  standalone: true,
  imports: [AgGridAngular],
  template: `<div class="container">
    <div class="columns">
      <label class="option" for="prependContent"
        ><input type="checkbox" id="prependContent" />Prepend Content</label
      >
      <label class="option" for="appendContent"
        ><input type="checkbox" id="appendContent" /> Append Content</label
      >
    </div>
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
        [popupParent]="popupParent"
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
    { field: "country", minWidth: 200 },
    { field: "sport", minWidth: 150 },
    { field: "gold" },
    { field: "silver" },
    { field: "bronze" },
    { field: "total" },
  ];
  defaultColDef: ColDef = {
    filter: true,
    minWidth: 100,
    flex: 1,
  };
  popupParent: HTMLElement | null = document.body;
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

const getRows: () => ExcelRow[] = () => [
  { cells: [] },
  {
    cells: [
      {
        data: {
          value: 'Here is a comma, and a some "quotes".',
          type: "String",
        },
      },
    ],
  },
  {
    cells: [
      {
        data: {
          value:
            "They are visible when the downloaded file is opened in Excel because custom content is properly escaped.",
          type: "String",
        },
      },
    ],
  },
  {
    cells: [
      { data: { value: "this cell:", type: "String" }, mergeAcross: 1 },
      {
        data: {
          value: "is empty because the first cell has mergeAcross=1",
          type: "String",
        },
      },
    ],
  },
  { cells: [] },
];
const getBoolean = (inputSelector: string) =>
  !!(document.querySelector(inputSelector) as HTMLInputElement).checked;
const getParams: () => ExcelExportParams = () => ({
  prependContent: getBoolean("#prependContent") ? getRows() : undefined,
  appendContent: getBoolean("#appendContent") ? getRows() : undefined,
});
