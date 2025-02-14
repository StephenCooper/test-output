import { Component } from "@angular/core";
import { AgGridAngular } from "ag-grid-angular";
import {
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  GetDataPath,
  GridApi,
  GridOptions,
  GridReadyEvent,
  IsGroupOpenByDefaultParams,
  ModuleRegistry,
  TextFilterModule,
  ValidationModule,
  createGrid,
} from "ag-grid-community";
import { TreeDataModule } from "ag-grid-enterprise";
import { getData } from "./data";
ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  TreeDataModule,
  TextFilterModule,
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
    [autoGroupColumnDef]="autoGroupColumnDef"
    [isGroupOpenByDefault]="isGroupOpenByDefault"
    [treeData]="true"
    [getDataPath]="getDataPath"
    [rowData]="rowData"
  /> `,
})
export class AppComponent {
  columnDefs: ColDef[] = [
    { field: "created" },
    { field: "modified" },
    {
      field: "size",
      aggFunc: "sum",
      valueFormatter: (params) => {
        const sizeInKb = params.value / 1024;
        if (sizeInKb > 1024) {
          return `${+(sizeInKb / 1024).toFixed(2)} MB`;
        } else {
          return `${+sizeInKb.toFixed(2)} KB`;
        }
      },
    },
  ];
  defaultColDef: ColDef = {
    flex: 1,
    minWidth: 100,
    filter: true,
  };
  autoGroupColumnDef: ColDef = {
    headerName: "File Explorer",
    minWidth: 280,
    filter: "agTextColumnFilter",
    cellRendererParams: {
      suppressCount: true,
    },
  };
  isGroupOpenByDefault: (params: IsGroupOpenByDefaultParams) => boolean = (
    params: IsGroupOpenByDefaultParams,
  ) => {
    return (
      (params.level === 0 && params.key === "Documents") ||
      (params.level === 1 && params.key === "Work") ||
      (params.level === 2 && params.key === "ProjectBeta")
    );
  };
  getDataPath: GetDataPath = (data) => data.path;
  rowData: any[] | null = getData();
}
