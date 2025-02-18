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
  RowSelectionModule,
  RowSelectionOptions,
  SideBarDef,
  TextEditorModule,
  ValidationModule,
} from "ag-grid-community";
import {
  ClipboardModule,
  ColumnMenuModule,
  ColumnsToolPanelModule,
  ContextMenuModule,
  FiltersToolPanelModule,
  PivotModule,
  SetFilterModule,
} from "ag-grid-enterprise";
ModuleRegistry.registerModules([
  NumberEditorModule,
  TextEditorModule,
  RowSelectionModule,
  ClientSideRowModelModule,
  ColumnsToolPanelModule,
  FiltersToolPanelModule,
  ColumnMenuModule,
  ContextMenuModule,
  SetFilterModule,
  NumberFilterModule,
  ClipboardModule,
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
    [rowSelection]="rowSelection"
    [defaultColDef]="defaultColDef"
    [sideBar]="sideBar"
    [rowData]="rowData"
    (gridReady)="onGridReady($event)"
  /> `,
})
export class AppComponent {
  columnDefs: (ColDef | ColGroupDef)[] = [
    {
      headerName: "Participant",
      children: [
        { field: "athlete", minWidth: 170 },
        { field: "country", minWidth: 150 },
      ],
    },
    { field: "sport" },
    {
      headerName: "Medals",
      children: [
        {
          field: "total",
          columnGroupShow: "closed",
          filter: "agNumberColumnFilter",
          width: 120,
          flex: 0,
        },
        {
          field: "gold",
          columnGroupShow: "open",
          filter: "agNumberColumnFilter",
          width: 100,
          flex: 0,
        },
        {
          field: "silver",
          columnGroupShow: "open",
          filter: "agNumberColumnFilter",
          width: 100,
          flex: 0,
        },
        {
          field: "bronze",
          columnGroupShow: "open",
          filter: "agNumberColumnFilter",
          width: 100,
          flex: 0,
        },
      ],
    },
    { field: "year", filter: "agNumberColumnFilter" },
  ];
  rowSelection: RowSelectionOptions | "single" | "multiple" = {
    mode: "multiRow",
  };
  defaultColDef: ColDef = {
    editable: true,
    minWidth: 100,
    filter: true,
    floatingFilter: true,
    flex: 1,
  };
  sideBar: SideBarDef | string | string[] | boolean | null = {
    toolPanels: ["columns", "filters"],
    defaultToolPanel: "",
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
