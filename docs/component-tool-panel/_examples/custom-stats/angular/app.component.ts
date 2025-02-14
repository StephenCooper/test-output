import { Component } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { AgGridAngular } from "ag-grid-angular";
import {
  CellValueChangedEvent,
  ClientSideRowModelApiModule,
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  EventApiModule,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ModuleRegistry,
  NumberEditorModule,
  NumberFilterModule,
  RowApiModule,
  SideBarDef,
  TextEditorModule,
  TextFilterModule,
  Theme,
  ValidationModule,
  iconOverrides,
  themeQuartz,
} from "ag-grid-community";
import {
  ColumnsToolPanelModule,
  FiltersToolPanelModule,
  SetFilterModule,
} from "ag-grid-enterprise";
ModuleRegistry.registerModules([
  ClientSideRowModelApiModule,
  NumberEditorModule,
  TextEditorModule,
  NumberFilterModule,
  ClientSideRowModelModule,
  ColumnsToolPanelModule,
  FiltersToolPanelModule,
  SetFilterModule,
  TextFilterModule,
  RowApiModule,
  EventApiModule,
  ValidationModule /* Development Only */,
]);
import { CustomStatsToolPanel } from "./custom-stats-tool-panel.component";
import { IOlympicData } from "./interfaces";

@Component({
  selector: "my-app",
  standalone: true,
  imports: [AgGridAngular, CustomStatsToolPanel],
  template: `<div style="height: 100%; box-sizing: border-box">
    <ag-grid-angular
      style="width: 100%; height: 100%;"
      [columnDefs]="columnDefs"
      [theme]="theme"
      [defaultColDef]="defaultColDef"
      [icons]="icons"
      [sideBar]="sideBar"
      [rowData]="rowData"
      (cellValueChanged)="onCellValueChanged($event)"
      (gridReady)="onGridReady($event)"
    />
  </div> `,
})
export class AppComponent {
  columnDefs: ColDef[] = [
    { field: "athlete", width: 150, filter: "agTextColumnFilter" },
    { field: "age", width: 90 },
    { field: "country", width: 120 },
    { field: "year", width: 90 },
    { field: "date", width: 110 },
    { field: "gold", width: 100, filter: false },
    { field: "silver", width: 100, filter: false },
    { field: "bronze", width: 100, filter: false },
    { field: "total", width: 100, filter: false },
  ];
  theme: Theme | "legacy" = themeQuartz.withPart(
    iconOverrides({
      type: "image",
      mask: true,
      icons: {
        // map of icon names to images
        "custom-stats": {
          svg: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"><g stroke="#7F8C8D" fill="none" fill-rule="evenodd"><path d="M10.5 6V4.5h-5v.532a1 1 0 0 0 .36.768l1.718 1.432a1 1 0 0 1 0 1.536L5.86 10.2a1 1 0 0 0-.36.768v.532h5V10"/><rect x="1.5" y="1.5" width="13" height="13" rx="2"/></g></svg>',
        },
      },
    }),
  );
  defaultColDef: ColDef = {
    editable: true,
    flex: 1,
    minWidth: 100,
    filter: true,
  };
  icons: {
    [key: string]: ((...args: any[]) => any) | string;
  } = {
    "custom-stats": '<span class="ag-icon ag-icon-custom-stats"></span>',
  };
  sideBar: SideBarDef | string | string[] | boolean | null = {
    toolPanels: [
      {
        id: "columns",
        labelDefault: "Columns",
        labelKey: "columns",
        iconKey: "columns",
        toolPanel: "agColumnsToolPanel",
      },
      {
        id: "filters",
        labelDefault: "Filters",
        labelKey: "filters",
        iconKey: "filter",
        toolPanel: "agFiltersToolPanel",
      },
      {
        id: "customStats",
        labelDefault: "Custom Stats",
        labelKey: "customStats",
        iconKey: "custom-stats",
        toolPanel: CustomStatsToolPanel,
        toolPanelParams: {
          title: "Custom Stats",
        },
      },
    ],
    defaultToolPanel: "customStats",
  };
  rowData!: IOlympicData[];

  constructor(private http: HttpClient) {}

  onCellValueChanged(params: CellValueChangedEvent) {
    params.api.refreshClientSideRowModel();
  }

  onGridReady(params: GridReadyEvent<IOlympicData>) {
    this.http
      .get<
        IOlympicData[]
      >("https://www.ag-grid.com/example-assets/olympic-winners.json")
      .subscribe((data) => {
        this.rowData = data;
      });
  }
}
