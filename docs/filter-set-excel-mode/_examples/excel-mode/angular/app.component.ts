import { Component } from "@angular/core";
import { AgGridAngular } from "ag-grid-angular";
import {
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ISetFilterParams,
  LocaleModule,
  ModuleRegistry,
  SideBarDef,
  ValidationModule,
  createGrid,
} from "ag-grid-community";
import {
  ColumnMenuModule,
  ContextMenuModule,
  FiltersToolPanelModule,
  SetFilterModule,
} from "ag-grid-enterprise";
import { getData } from "./data";
ModuleRegistry.registerModules([
  LocaleModule,
  ClientSideRowModelModule,
  FiltersToolPanelModule,
  ColumnMenuModule,
  ContextMenuModule,
  SetFilterModule,
  ValidationModule /* Development Only */,
]);

@Component({
  selector: "my-app",
  standalone: true,
  imports: [AgGridAngular],
  template: `<ag-grid-angular
    style="width: 100%; height: 100%;"
    [columnDefs]="columnDefs"
    [defaultColDef]="defaultColDef"
    [sideBar]="sideBar"
    [rowData]="rowData"
    [localeText]="localeText"
  /> `,
})
export class AppComponent {
  columnDefs: ColDef[] = [
    {
      headerName: "Default",
      field: "animal",
      filter: "agSetColumnFilter",
    },
    {
      headerName: "Excel (Windows)",
      field: "animal",
      filter: "agSetColumnFilter",
      filterParams: {
        excelMode: "windows",
      } as ISetFilterParams,
    },
    {
      headerName: "Excel (Mac)",
      field: "animal",
      filter: "agSetColumnFilter",
      filterParams: {
        excelMode: "mac",
      } as ISetFilterParams,
    },
  ];
  defaultColDef: ColDef = {
    flex: 1,
    minWidth: 200,
  };
  sideBar: SideBarDef | string | string[] | boolean | null = "filters";
  rowData: any[] | null = getData();
  localeText: {
    [key: string]: string;
  } = {
    applyFilter: "OK",
    cancelFilter: "Cancel",
    resetFilter: "Clear Filter",
  };
}
