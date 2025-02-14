import {
  createApp,
  defineComponent,
  onBeforeMount,
  ref,
  shallowRef,
} from "vue";
import { AgGridVue } from "ag-grid-vue3";
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

const VueExample = defineComponent({
  template: `
        <div style="height: 100%">
                <ag-grid-vue
      style="width: 100%; height: 100%;"
      @grid-ready="onGridReady"
      :columnDefs="columnDefs"
      :defaultColDef="defaultColDef"
      :autoGroupColumnDef="autoGroupColumnDef"
      :rowModelType="rowModelType"
      :treeData="true"
      :isServerSideGroupOpenByDefault="isServerSideGroupOpenByDefault"
      :isServerSideGroup="isServerSideGroup"
      :getServerSideGroupKey="getServerSideGroupKey"
      :rowData="rowData"></ag-grid-vue>
        </div>
    `,
  components: {
    "ag-grid-vue": AgGridVue,
  },
  setup(props) {
    const gridApi = shallowRef<GridApi | null>(null);
    const columnDefs = ref<ColDef[]>([
      { field: "employeeId", hide: true },
      { field: "employeeName", hide: true },
      { field: "jobTitle" },
      { field: "employmentType" },
    ]);
    const defaultColDef = ref<ColDef>({
      width: 240,
      flex: 1,
      sortable: false,
    });
    const autoGroupColumnDef = ref<ColDef>({
      field: "employeeName",
      cellRendererParams: {
        innerRenderer: (params: ICellRendererParams) => {
          // display employeeName rather than group key (employeeId)
          return params.data.employeeName;
        },
      },
    });
    const rowModelType = ref<RowModelType>("serverSide");
    const isServerSideGroupOpenByDefault = ref<
      (params: IsServerSideGroupOpenByDefaultParams) => boolean
    >((params: IsServerSideGroupOpenByDefaultParams) => {
      // open first two levels by default
      return params.rowNode.level < 2;
    });
    const isServerSideGroup = ref<IsServerSideGroup>((dataItem: any) => {
      // indicate if node is a group
      return !!dataItem.underlings;
    });
    const getServerSideGroupKey = ref<GetServerSideGroupKey>(
      (dataItem: any) => {
        // specify which group key to use
        return dataItem.employeeId;
      },
    );
    const rowData = ref<any[]>(null);

    const onGridReady = (params: GridReadyEvent) => {
      gridApi.value = params.api;

      const updateData = (data) => {
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
      };

      fetch("https://www.ag-grid.com/example-assets/tree-data.json")
        .then((resp) => resp.json())
        .then((data) => updateData(data));
    };

    return {
      gridApi,
      columnDefs,
      defaultColDef,
      autoGroupColumnDef,
      rowModelType,
      isServerSideGroupOpenByDefault,
      isServerSideGroup,
      getServerSideGroupKey,
      rowData,
      onGridReady,
    };
  },
});

createApp(VueExample).mount("#app");
