import { Component } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { AgGridAngular } from "ag-grid-angular";
import {
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  GetContextMenuItems,
  GetContextMenuItemsParams,
  GetMainMenuItems,
  GetMainMenuItemsParams,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ModuleRegistry,
  ValidationModule,
} from "ag-grid-community";
import {
  CellSelectionModule,
  ClipboardModule,
  ColumnMenuModule,
  ContextMenuModule,
  ExcelExportModule,
} from "ag-grid-enterprise";
ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  ClipboardModule,
  ExcelExportModule,
  ColumnMenuModule,
  ContextMenuModule,
  CellSelectionModule,
  ValidationModule /* Development Only */,
]);
import { MenuItem } from "./menu-item.component";
import { IOlympicData } from "./interfaces";

@Component({
  selector: "my-app",
  standalone: true,
  imports: [AgGridAngular, MenuItem],
  template: `<ag-grid-angular
    style="width: 100%; height: 100%;"
    [columnDefs]="columnDefs"
    [defaultColDef]="defaultColDef"
    [rowData]="rowData"
    [getMainMenuItems]="getMainMenuItems"
    [getContextMenuItems]="getContextMenuItems"
    (gridReady)="onGridReady($event)"
  /> `,
})
export class AppComponent {
  columnDefs: ColDef[] = [
    { field: "athlete" },
    { field: "country" },
    { field: "sport" },
    { field: "year" },
    { field: "gold" },
    { field: "silver" },
    { field: "bronze" },
  ];
  defaultColDef: ColDef = {
    flex: 1,
    minWidth: 100,
  };
  getMainMenuItems: GetMainMenuItems = (params: GetMainMenuItemsParams) => {
    return [
      ...params.defaultItems,
      "separator",
      {
        name: "Click Alert Button and Close Menu",
        menuItem: MenuItem,
        menuItemParams: {
          buttonValue: "Alert",
        },
      },
      {
        name: "Click Alert Button and Keep Menu Open",
        suppressCloseOnSelect: true,
        menuItem: MenuItem,
        menuItemParams: {
          buttonValue: "Alert",
        },
      },
    ];
  };
  getContextMenuItems: GetContextMenuItems = (
    params: GetContextMenuItemsParams,
  ) => {
    return [
      ...(params.defaultItems || []),
      "separator",
      {
        name: "Click Alert Button and Close Menu",
        menuItem: MenuItem,
        menuItemParams: {
          buttonValue: "Alert",
        },
      },
      {
        name: "Click Alert Button and Keep Menu Open",
        suppressCloseOnSelect: true,
        menuItem: MenuItem,
        menuItemParams: {
          buttonValue: "Alert",
        },
      },
    ];
  };
  rowData!: IOlympicData[];

  constructor(private http: HttpClient) {}

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
