import { Component } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { AgGridAngular } from "ag-grid-angular";
import "./styles.css";
import {
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  CsvExportModule,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ModuleRegistry,
  NumberFilterModule,
  TextFilterModule,
  ValidationModule,
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
  CsvExportModule,
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
      <label class="option" for="allColumns"
        ><input id="allColumns" type="checkbox" />All Columns</label
      >
      <div>
        <button (click)="onBtExport()" style="font-weight: bold">
          Export to Excel
        </button>
      </div>
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

  columnDefs: (ColDef | ColGroupDef)[] = [
    {
      headerName: "Top Level Column Group",
      children: [
        {
          headerName: "Group A",
          children: [
            { field: "athlete", minWidth: 200 },
            { field: "country", minWidth: 200 },
            { headerName: "Group", valueGetter: "data.country.charAt(0)" },
          ],
        },
        {
          headerName: "Group B",
          children: [
            { field: "sport", minWidth: 150 },
            { field: "gold", hide: true },
            { field: "silver", hide: true },
            { field: "bronze", hide: true },
            { field: "total", hide: true },
          ],
        },
      ],
    },
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

function getBoolean(id: string) {
  return !!(document.querySelector("#" + id) as HTMLInputElement).checked;
}
function getParams() {
  return {
    allColumns: getBoolean("allColumns"),
  };
}
