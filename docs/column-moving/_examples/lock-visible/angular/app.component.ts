import { Component } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { AgGridAngular } from "ag-grid-angular";
import "./style.css";
import {
  CellStyleModule,
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ModuleRegistry,
  SideBarDef,
  ValidationModule,
} from "ag-grid-community";
import {
  ColumnsToolPanelModule,
  FiltersToolPanelModule,
} from "ag-grid-enterprise";
ModuleRegistry.registerModules([
  CellStyleModule,
  ClientSideRowModelModule,
  ColumnsToolPanelModule,
  FiltersToolPanelModule,
  ValidationModule /* Development Only */,
]);
import { IOlympicData } from "./interfaces";

@Component({
  selector: "my-app",
  standalone: true,
  imports: [AgGridAngular],
  template: `<div class="example-wrapper">
    <div class="legend-bar">
      <span class="legend-box locked-visible"></span> Locked Visible Column
    </div>
    <ag-grid-angular
      style="width: 100%; height: 100%;"
      [columnDefs]="columnDefs"
      [sideBar]="sideBar"
      [defaultColDef]="defaultColDef"
      [allowDragFromColumnsToolPanel]="true"
      [rowData]="rowData"
      (gridReady)="onGridReady($event)"
    />
  </div> `,
})
export class AppComponent {
  columnDefs: (ColDef | ColGroupDef)[] = [
    {
      headerName: "Athlete",
      children: [
        { field: "athlete", width: 150 },
        { field: "age", lockVisible: true, cellClass: "locked-visible" },
        { field: "country", width: 150 },
        { field: "year" },
        { field: "date" },
        { field: "sport" },
      ],
    },
    {
      headerName: "Medals",
      children: [
        { field: "gold", lockVisible: true, cellClass: "locked-visible" },
        { field: "silver", lockVisible: true, cellClass: "locked-visible" },
        { field: "bronze", lockVisible: true, cellClass: "locked-visible" },
        {
          field: "total",
          lockVisible: true,
          cellClass: "locked-visible",
          hide: true,
        },
      ],
    },
  ];
  sideBar: SideBarDef | string | string[] | boolean | null = {
    toolPanels: [
      {
        id: "columns",
        labelDefault: "Columns",
        labelKey: "columns",
        iconKey: "columns",
        toolPanel: "agColumnsToolPanel",
        toolPanelParams: {
          suppressRowGroups: true,
          suppressValues: true,
          suppressPivots: true,
          suppressPivotMode: true,
        },
      },
    ],
  };
  defaultColDef: ColDef = {
    width: 100,
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
