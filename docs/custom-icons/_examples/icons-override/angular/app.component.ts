import { Component } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { AgGridAngular } from "ag-grid-angular";
import {
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ModuleRegistry,
  NumberEditorModule,
  NumberFilterModule,
  SideBarDef,
  TextEditorModule,
  Theme,
  ValidationModule,
  iconOverrides,
  themeQuartz,
} from "ag-grid-community";
import {
  ColumnMenuModule,
  ColumnsToolPanelModule,
  ContextMenuModule,
  FiltersToolPanelModule,
  PivotModule,
  RowGroupingModule,
  SetFilterModule,
} from "ag-grid-enterprise";
ModuleRegistry.registerModules([
  NumberEditorModule,
  TextEditorModule,
  NumberFilterModule,
  ClientSideRowModelModule,
  ColumnsToolPanelModule,
  FiltersToolPanelModule,
  ColumnMenuModule,
  ContextMenuModule,
  RowGroupingModule,
  SetFilterModule,
  PivotModule,
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
    [theme]="theme"
    [rowData]="rowData"
    [defaultColDef]="defaultColDef"
    [autoGroupColumnDef]="autoGroupColumnDef"
    [sideBar]="true"
    (gridReady)="onGridReady($event)"
  /> `,
})
export class AppComponent {
  columnDefs: ColDef[] = [
    { field: "country", sort: "asc", rowGroup: true, hide: true },
    { field: "athlete", minWidth: 170 },
    { field: "age" },
    { field: "year" },
    { field: "date" },
    { field: "sport" },
    { field: "gold" },
    { field: "silver" },
    { field: "bronze" },
    { field: "total" },
  ];
  theme: Theme | "legacy" = myTheme;
  defaultColDef: ColDef = {
    editable: true,
    filter: true,
    enableRowGroup: true,
    enablePivot: true,
    enableValue: true,
  };
  autoGroupColumnDef: ColDef = {
    headerName: "Country",
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

const myTheme = themeQuartz
  .withPart(
    iconOverrides({
      type: "image",
      icons: {
        filter: {
          url: "https://www.ag-grid.com/example-assets/svg-icons/filter.svg",
        },
      },
    }),
  )
  .withPart(
    iconOverrides({
      type: "image",
      mask: true,
      icons: {
        "menu-alt": {
          url: "https://www.ag-grid.com/example-assets/svg-icons/menu-alt.svg",
        },
      },
    }),
  )
  .withPart(
    iconOverrides({
      type: "font",
      icons: {
        columns: "🏛️",
      },
    }),
  )
  .withPart(
    iconOverrides({
      cssImports: ["https://use.fontawesome.com/releases/v5.6.3/css/all.css"],
      type: "font",
      weight: "bold",
      family: "Font Awesome 5 Free",
      color: "green",
      icons: {
        asc: "\u{f062}",
        desc: "\u{f063}",
        "tree-closed": "\u{f105}",
        "tree-indeterminate": "\u{f068}",
        "tree-open": "\u{f107}",
      },
    }),
  )
  .withPart(
    iconOverrides({
      cssImports: [
        "https://cdn.jsdelivr.net/npm/@mdi/font/css/materialdesignicons.css",
      ],
      type: "font",
      family: "Material Design Icons",
      color: "red",
      icons: {
        group: "\u{F0328}",
        aggregation: "\u{F02C3}",
      },
    }),
  );
