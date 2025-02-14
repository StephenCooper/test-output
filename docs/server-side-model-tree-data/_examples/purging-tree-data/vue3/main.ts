import {
  createApp,
  defineComponent,
  onBeforeMount,
  ref,
  shallowRef,
} from "vue";
import { AgGridVue } from "ag-grid-vue3";
import "./styles.css";
import {
  ColDef,
  ColGroupDef,
  GetServerSideGroupKey,
  GridApi,
  GridOptions,
  GridReadyEvent,
  IServerSideDatasource,
  IServerSideGetRowsParams,
  IServerSideGetRowsRequest,
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
  ColumnMenuModule,
  ContextMenuModule,
  TreeDataModule,
  ServerSideRowModelModule,
  ServerSideRowModelApiModule,
  ValidationModule /* Development Only */,
]);

function createFakeServer(fakeServerData: any[]) {
  const fakeServer = {
    getData: (request: IServerSideGetRowsRequest) => {
      function extractRowsFromData(groupKeys: string[], data: any[]): any {
        if (groupKeys.length === 0) {
          return data.map(function (d) {
            return {
              group: !!d.underlings,
              employeeId: d.employeeId + "",
              employeeName: d.employeeName,
              employmentType: d.employmentType,
              startDate: d.startDate,
            };
          });
        }
        const key = groupKeys[0];
        for (let i = 0; i < data.length; i++) {
          if (data[i].employeeName === key) {
            return extractRowsFromData(
              groupKeys.slice(1),
              data[i].underlings.slice(),
            );
          }
        }
      }
      return extractRowsFromData(request.groupKeys, fakeServerData);
    },
  };
  return fakeServer;
}

function createServerSideDatasource(fakeServer: any) {
  const dataSource: IServerSideDatasource = {
    getRows: (params: IServerSideGetRowsParams) => {
      console.log("ServerSideDatasource.getRows: params = ", params);
      const request = params.request;
      const allRows = fakeServer.getData(request);
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
      }, 500);
    },
  };
  return dataSource;
}

const VueExample = defineComponent({
  template: `
        <div style="height: 100%">
                <div class="example-wrapper">
      <div style="margin-bottom: 5px">
        <button v-on:click="refreshCache([])">Refresh Everything</button>
        <button v-on:click="refreshCache(['Kathryn Powers','Mabel Ward'])">Refresh ['Kathryn Powers','Mabel Ward']</button>
      </div>
      <ag-grid-vue
        style="width: 100%; height: 100%;"
        @grid-ready="onGridReady"
        :columnDefs="columnDefs"
        :defaultColDef="defaultColDef"
        :autoGroupColumnDef="autoGroupColumnDef"
        :rowModelType="rowModelType"
        :treeData="true"
        :cacheBlockSize="cacheBlockSize"
        :isServerSideGroupOpenByDefault="isServerSideGroupOpenByDefault"
        :isServerSideGroup="isServerSideGroup"
        :getServerSideGroupKey="getServerSideGroupKey"
        :rowData="rowData"></ag-grid-vue>
      </div>
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
      { field: "employmentType" },
      { field: "startDate" },
    ]);
    const defaultColDef = ref<ColDef>({
      width: 235,
      flex: 1,
      sortable: false,
    });
    const autoGroupColumnDef = ref<ColDef>({
      field: "employeeName",
    });
    const rowModelType = ref<RowModelType>("serverSide");
    const cacheBlockSize = ref(10);
    const isServerSideGroupOpenByDefault = ref<
      (params: IsServerSideGroupOpenByDefaultParams) => boolean
    >((params: IsServerSideGroupOpenByDefaultParams) => {
      const isKathrynPowers =
        params.rowNode.level == 0 &&
        params.data.employeeName == "Kathryn Powers";
      const isMabelWard =
        params.rowNode.level == 1 && params.data.employeeName == "Mabel Ward";
      return isKathrynPowers || isMabelWard;
    });
    const isServerSideGroup = ref<IsServerSideGroup>((dataItem: any) => {
      // indicate if node is a group
      return dataItem.group;
    });
    const getServerSideGroupKey = ref<GetServerSideGroupKey>(
      (dataItem: any) => {
        // specify which group key to use
        return dataItem.employeeName;
      },
    );
    const rowData = ref<any[]>(null);

    function refreshCache(route: string[]) {
      gridApi.value!.refreshServerSide({ route: route, purge: true });
    }
    const onGridReady = (params: GridReadyEvent) => {
      gridApi.value = params.api;

      const updateData = (data) => {
        const fakeServer = createFakeServer(data);
        const datasource = createServerSideDatasource(fakeServer);
        params.api!.setGridOption("serverSideDatasource", datasource);
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
      cacheBlockSize,
      isServerSideGroupOpenByDefault,
      isServerSideGroup,
      getServerSideGroupKey,
      rowData,
      onGridReady,
      refreshCache,
    };
  },
});

createApp(VueExample).mount("#app");
