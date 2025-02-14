import { Component } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { AG_GRID_LOCALE_DE } from "@ag-grid-community/locale";
import { AgGridAngular } from "ag-grid-angular";
import { AgChartsEnterpriseModule } from "ag-charts-enterprise";
import {
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  CsvExportModule,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ICellRendererComp,
  ICellRendererParams,
  LocaleModule,
  ModuleRegistry,
  NumberEditorModule,
  NumberFilterModule,
  PaginationModule,
  RowSelectionModule,
  RowSelectionOptions,
  SideBarDef,
  StatusPanelDef,
  TextEditorModule,
  TextFilterModule,
  ValidationModule,
} from "ag-grid-community";
import {
  CellSelectionModule,
  ClipboardModule,
  ColumnMenuModule,
  ColumnsToolPanelModule,
  ContextMenuModule,
  ExcelExportModule,
  FiltersToolPanelModule,
  IntegratedChartsModule,
  MultiFilterModule,
  PivotModule,
  RowGroupingPanelModule,
  SetFilterModule,
  SideBarModule,
  StatusBarModule,
} from "ag-grid-enterprise";
ModuleRegistry.registerModules([
  NumberEditorModule,
  TextEditorModule,
  RowSelectionModule,
  LocaleModule,
  PaginationModule,
  ClientSideRowModelModule,
  ClipboardModule,
  ColumnsToolPanelModule,
  CsvExportModule,
  ExcelExportModule,
  FiltersToolPanelModule,
  ColumnMenuModule,
  ContextMenuModule,
  MultiFilterModule,
  CellSelectionModule,
  PivotModule,
  SetFilterModule,
  SideBarModule,
  StatusBarModule,
  RowGroupingPanelModule,
  TextFilterModule,
  NumberFilterModule,
  IntegratedChartsModule.with(AgChartsEnterpriseModule),
  ValidationModule /* Development Only */,
]);
import { IOlympicData } from "./interfaces";

@Component({
  selector: "my-app",
  standalone: true,
  imports: [AgGridAngular],
  template: `<ag-grid-angular
    style="width: 100%; height: 100%;"
    [columnDefs]="columnDefs"
    [defaultColDef]="defaultColDef"
    [sideBar]="true"
    [statusBar]="statusBar"
    [rowGroupPanelShow]="rowGroupPanelShow"
    [pagination]="true"
    [paginationPageSize]="paginationPageSize"
    [paginationPageSizeSelector]="paginationPageSizeSelector"
    [enableCharts]="true"
    [localeText]="localeText"
    [rowSelection]="rowSelection"
    [rowData]="rowData"
    (gridReady)="onGridReady($event)"
  /> `,
})
export class AppComponent {
  columnDefs: ColDef[] = [
    // this row just shows the row index, doesn't use any data from the row
    {
      headerName: "#",
      cellRenderer: NodeIdRenderer,
    },
    {
      field: "athlete",
      filterParams: { buttons: ["clear", "reset", "apply"] },
    },
    {
      field: "age",
      filterParams: { buttons: ["apply", "cancel"] },
      enablePivot: true,
    },
    { field: "country", enableRowGroup: true },
    { field: "year", filter: "agNumberColumnFilter" },
    { field: "date" },
    {
      field: "sport",
      filter: "agMultiColumnFilter",
      filterParams: {
        filters: [
          {
            filter: "agTextColumnFilter",
            display: "accordion",
          },
          {
            filter: "agSetColumnFilter",
            display: "accordion",
          },
        ],
      },
    },
    { field: "gold", enableValue: true },
    { field: "silver", enableValue: true },
    { field: "bronze", enableValue: true },
    { field: "total", enableValue: true },
  ];
  defaultColDef: ColDef = {
    editable: true,
    flex: 1,
    minWidth: 100,
    filter: true,
  };
  statusBar: {
    statusPanels: StatusPanelDef[];
  } = {
    statusPanels: [
      { statusPanel: "agTotalAndFilteredRowCountComponent", align: "left" },
      { statusPanel: "agAggregationComponent" },
    ],
  };
  rowGroupPanelShow: "always" | "onlyWhenGrouping" | "never" = "always";
  paginationPageSize = 500;
  paginationPageSizeSelector: number[] | boolean = [100, 500, 1000];
  localeText: {
    [key: string]: string;
  } = AG_GRID_LOCALE_DE;
  rowSelection: RowSelectionOptions | "single" | "multiple" = {
    mode: "multiRow",
  };
  rowData!: IOlympicData[];

  constructor(private http: HttpClient) {}

  onGridReady(params: GridReadyEvent<IOlympicData>) {
    this.http
      .get<
        IOlympicData[]
      >("https://www.ag-grid.com/example-assets/olympic-winners.json")
      .subscribe((data) => (this.rowData = data));
  }
}

class NodeIdRenderer implements ICellRendererComp {
  eGui!: HTMLElement;

  init(params: ICellRendererParams) {
    this.eGui = document.createElement("div");
    this.eGui.textContent = params.node!.id! + 1;
  }

  getGui() {
    return this.eGui;
  }

  refresh(params: ICellRendererParams): boolean {
    return false;
  }
}
