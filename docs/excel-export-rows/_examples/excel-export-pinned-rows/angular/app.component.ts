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
  PinnedRowModule,
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
  PinnedRowModule,
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
      <div class="column">
        <label for="skipPinnedTop"
          ><input id="skipPinnedTop" type="checkbox" />Skip Pinned Top
          Rows</label
        >
      </div>
      <div class="column">
        <label for="skipPinnedBottom"
          ><input id="skipPinnedBottom" type="checkbox" />Skip Pinned Bottom
          Rows</label
        >
      </div>
      <div>
        <button
          (click)="onBtExport()"
          style="margin: 5px 0px; font-weight: bold"
        >
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
        [pinnedTopRowData]="pinnedTopRowData"
        [pinnedBottomRowData]="pinnedBottomRowData"
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
            { field: "date", minWidth: 150 },
            { field: "sport", minWidth: 150 },
            { field: "gold" },
            { field: "silver" },
            { field: "bronze" },
            { field: "total" },
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
  pinnedTopRowData: any[] = [
    {
      athlete: "Floating <Top> Athlete",
      country: "Floating <Top> Country",
      date: "01/08/2020",
      sport: "Track & Field",
      gold: 22,
      silver: 3,
      bronze: 44,
      total: 69,
    } as any,
  ];
  pinnedBottomRowData: any[] = [
    {
      athlete: "Floating <Bottom> Athlete",
      country: "Floating <Bottom> Country",
      date: "01/08/2030",
      sport: "Track & Field",
      gold: 222,
      silver: 5,
      bronze: 244,
      total: 471,
    } as any,
  ];
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
    skipPinnedTop: getBoolean("skipPinnedTop"),
    skipPinnedBottom: getBoolean("skipPinnedBottom"),
  };
}
