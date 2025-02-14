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
  IsRowFilterable,
  ModuleRegistry,
  ValidationModule,
  ValueFormatterParams,
  createGrid,
} from "ag-grid-community";
import {
  ColumnMenuModule,
  ColumnsToolPanelModule,
  ContextMenuModule,
  FiltersToolPanelModule,
  SetFilterModule,
  TreeDataModule,
} from "ag-grid-enterprise";
import { getData } from "./data";
ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  ColumnsToolPanelModule,
  FiltersToolPanelModule,
  ColumnMenuModule,
  ContextMenuModule,
  SetFilterModule,
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
    [treeData]="true"
    [groupDefaultExpanded]="groupDefaultExpanded"
    [groupAggFiltering]="true"
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
      filter: "agSetColumnFilter",
      filterParams: {
        valueFormatter: (params: ValueFormatterParams) => {
          const sizeInKb = params.value / 1024;
          if (sizeInKb > 1024) {
            return `${+(sizeInKb / 1024).toFixed(2)} MB`;
          } else {
            return `${+sizeInKb.toFixed(2)} KB`;
          }
        },
      },
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
    minWidth: 200,
  };
  autoGroupColumnDef: ColDef = {
    cellRendererParams: {
      suppressCount: true,
    },
  };
  groupDefaultExpanded = -1;
  getDataPath: GetDataPath = (data: any) => data.path;
  rowData: any[] | null = getData();
}
