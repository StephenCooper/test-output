import { Component } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { AgGridAngular } from "ag-grid-angular";
import {
  ColDef,
  ColGroupDef,
  GetServerSideGroupKey,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ICellRendererParams,
  IServerSideDatasource,
  IServerSideGetRowsParams,
  IsServerSideGroup,
  IsServerSideGroupOpenByDefaultParams,
  ModuleRegistry,
  RowModelType,
  ValidationModule,
  createGrid,
} from "ag-grid-community";
import {
  ColumnMenuModule,
  ColumnsToolPanelModule,
  ContextMenuModule,
  ServerSideRowModelApiModule,
  ServerSideRowModelModule,
  TreeDataModule,
} from "ag-grid-enterprise";
ModuleRegistry.registerModules([
  ColumnsToolPanelModule,
  TreeDataModule,
  ColumnMenuModule,
  ContextMenuModule,
  ServerSideRowModelModule,
  ServerSideRowModelApiModule,
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
    [rowModelType]="rowModelType"
    [treeData]="true"
    [isServerSideGroupOpenByDefault]="isServerSideGroupOpenByDefault"
    [isServerSideGroup]="isServerSideGroup"
    [getServerSideGroupKey]="getServerSideGroupKey"
    [rowData]="rowData"
    (gridReady)="onGridReady($event)"
  /> `,
})
export class AppComponent {
  columnDefs: ColDef[] = [
    { field: "employeeId", hide: true },
    { field: "employeeName", hide: true },
    { field: "jobTitle" },
    { field: "employmentType" },
  ];
  defaultColDef: ColDef = {
    width: 240,
    flex: 1,
    sortable: false,
  };
  autoGroupColumnDef: ColDef = {
    field: "employeeName",
    cellRendererParams: {
      innerRenderer: (params: ICellRendererParams) => {
        // display employeeName rather than group key (employeeId)
        return params.data.employeeName;
      },
    },
  };
  rowModelType: RowModelType = "serverSide";
  isServerSideGroupOpenByDefault: (
    params: IsServerSideGroupOpenByDefaultParams,
  ) => boolean = (params: IsServerSideGroupOpenByDefaultParams) => {
    // open first two levels by default
    return params.rowNode.level < 2;
  };
  isServerSideGroup: IsServerSideGroup = (dataItem: any) => {
    // indicate if node is a group
    return !!dataItem.underlings;
  };
  getServerSideGroupKey: GetServerSideGroupKey = (dataItem: any) => {
    // specify which group key to use
    return dataItem.employeeId;
  };
  rowData!: any[];

  constructor(private http: HttpClient) {}

  onGridReady(params: GridReadyEvent) {
    this.http
      .get<any[]>("https://www.ag-grid.com/example-assets/tree-data.json")
      .subscribe((data) => {
        const datasource = createServerSideDatasource(data);
        params.api!.setGridOption("serverSideDatasource", datasource);
        function createServerSideDatasource(data: any) {
          const dataSource: IServerSideDatasource = {
            getRows: (params: IServerSideGetRowsParams) => {
              console.log("ServerSideDatasource.getRows: params = ", params);
              const request = params.request;
              if (request.groupKeys.length) {
                // this example doesn't need to support lower levels.
                params.fail();
                return;
              }
              const result = {
                rowData: data.slice(request.startRow, request.endRow),
              };
              console.log("getRows: result = ", result);
              setTimeout(() => {
                params.success(result);
                const recursivelyPopulateHierarchy = (
                  route: string[],
                  node: any,
                ) => {
                  if (node.underlings) {
                    params.api!.applyServerSideRowData({
                      route,
                      successParams: {
                        rowData: node.underlings,
                        rowCount: node.underlings.length,
                      },
                    });
                    node.underlings.forEach((child: any) => {
                      recursivelyPopulateHierarchy(
                        [...route, child.employeeId],
                        child,
                      );
                    });
                  }
                };
                result.rowData.forEach((topLevelNode: any) => {
                  recursivelyPopulateHierarchy(
                    [topLevelNode.employeeId],
                    topLevelNode,
                  );
                });
              }, 200);
            },
          };
          return dataSource;
        }
      });
  }
}
