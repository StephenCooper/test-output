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
  ISetFilterParams,
  KeyCreatorParams,
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
    [getDataPath]="getDataPath"
    [rowData]="rowData"
  /> `,
})
export class AppComponent {
  columnDefs: ColDef[] = [{ field: "employmentType" }, { field: "jobTitle" }];
  defaultColDef: ColDef = {
    flex: 1,
    minWidth: 200,
    filter: true,
    floatingFilter: true,
    cellDataType: false,
  };
  autoGroupColumnDef: ColDef = {
    headerName: "Employee",
    field: "path",
    cellRendererParams: {
      suppressCount: true,
    },
    filter: "agSetColumnFilter",
    filterParams: {
      treeList: true,
      keyCreator: (params: KeyCreatorParams) => params.value.join("."),
      treeListFormatter: treeListFormatter,
      valueFormatter: valueFormatter,
    } as ISetFilterParams<any, string[]>,
    minWidth: 280,
    valueFormatter: (params: ValueFormatterParams) => params.value.displayValue,
  };
  groupDefaultExpanded = -1;
  getDataPath: GetDataPath = (data) => data.path.key.split(".");
  rowData: any[] | null = getData();
}

const pathLookup: {
  [key: string]: string;
} = getData().reduce((pathMap, row) => {
  pathMap[row.path.key] = row.path.displayValue;
  return pathMap;
}, {});
function treeListFormatter(
  pathKey: string | null,
  _level: number,
  parentPathKeys: (string | null)[],
): string {
  return pathLookup[[...parentPathKeys, pathKey].join(".")];
}
function valueFormatter(params: ValueFormatterParams): string {
  return params.value ? pathLookup[params.value.join(".")] : "(Blanks)";
}
