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
  ModuleRegistry,
  ValidationModule,
} from "ag-grid-community";
import { TreeDataModule } from "ag-grid-enterprise";
import { getData } from "./data";
ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  TreeDataModule,
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
    [rowData]="rowData"
    [treeData]="true"
    [groupDefaultExpanded]="groupDefaultExpanded"
    [getDataPath]="getDataPath"
  /> `,
})
export class AppComponent {
  columnDefs: ColDef[] = [{ field: "employeeId" }];
  defaultColDef: ColDef = {
    flex: 1,
  };
  autoGroupColumnDef: ColDef = {
    headerName: "Organisation Chart",
    field: "name",
    cellRendererParams: {
      suppressCount: true,
    },
  };
  rowData: any[] | null = getData();
  groupDefaultExpanded = 1;
  getDataPath: GetDataPath = (data) => data.path;
}
