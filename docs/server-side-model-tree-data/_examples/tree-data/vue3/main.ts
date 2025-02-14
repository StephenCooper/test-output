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
  IServerSideGetRowsRequest,
  IsServerSideGroup,
  IsServerSideGroupOpenByDefaultParams,
  ModuleRegistry,
  RowModelType,
  ValidationModule,
} from "ag-grid-community";
import {
  ColumnMenuModule,
  ColumnsToolPanelModule,
  ContextMenuModule,
  ServerSideRowModelModule,
  TreeDataModule,
} from "ag-grid-enterprise";
ModuleRegistry.registerModules([
  ColumnsToolPanelModule,
  ColumnMenuModule,
  ContextMenuModule,
  TreeDataModule,
  ServerSideRowModelModule,
  ValidationModule /* Development Only */,
]);

function createFakeServer(fakeServerData: any[]) {
  const fakeServer = {
    data: fakeServerData,
    getData: function (request: IServerSideGetRowsRequest) {
      function extractRowsFromData(groupKeys: string[], data: any[]): any {
        if (groupKeys.length === 0) {
          return data.map(function (d) {
            return {
              group: !!d.children,
              employeeId: d.employeeId,
              employeeName: d.employeeName,
              employmentType: d.employmentType,
              jobTitle: d.jobTitle,
            };
          });
        }
        const key = groupKeys[0];
        for (let i = 0; i < data.length; i++) {
          if (data[i].employeeId === key) {
            return extractRowsFromData(
              groupKeys.slice(1),
              data[i].children.slice(),
            );
          }
        }
      }
      return extractRowsFromData(request.groupKeys, this.data);
    },
  };
  return fakeServer;
}

function createServerSideDatasource(fakeServer: any) {
  const dataSource: IServerSideDatasource = {
    getRows: (params: IServerSideGetRowsParams) => {
      console.log("ServerSideDatasource.getRows: params = ", params);
      const allRows = fakeServer.getData(params.request);
      const request = params.request;
      const doingInfinite = request.startRow != null && request.endRow != null;
      const result = doingInfinite
        ? {
            rowData: allRows.slice(request.startRow, request.endRow),
            rowCount: allRows.length,
          }
        : { rowData: allRows };
      console.log("getRows: result = ", result);
      setTimeout(() => {
        params.success(result);
      }, 200);
    },
  };
  return dataSource;
}

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
      return dataItem.group;
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
        const fakeServer = createFakeServer(data);
        const datasource = createServerSideDatasource(fakeServer);
        params.api!.setGridOption("serverSideDatasource", datasource);
      };

      fetch("https://www.ag-grid.com/example-assets/small-tree-data.json")
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
