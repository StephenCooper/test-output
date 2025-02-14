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
  GetRowIdFunc,
  GetRowIdParams,
  GetServerSideGroupLevelParamsParams,
  GridApi,
  GridOptions,
  GridReadyEvent,
  IServerSideDatasource,
  IServerSideGetRowsParams,
  IsServerSideGroupOpenByDefaultParams,
  ModuleRegistry,
  RowModelType,
  RowSelectionOptions,
  ServerSideGroupLevelParams,
  ValidationModule,
} from "ag-grid-community";
import {
  RowGroupingModule,
  ServerSideRowModelModule,
} from "ag-grid-enterprise";
import { FakeServer } from "./fakeServer";
import { IOlympicData } from "./interfaces";
ModuleRegistry.registerModules([
  RowGroupingModule,
  ServerSideRowModelModule,
  ValidationModule /* Development Only */,
]);

function getServerSideDatasource(server: any): IServerSideDatasource {
  return {
    getRows: (params: IServerSideGetRowsParams) => {
      console.log("[Datasource] - rows requested by grid: ", params.request);
      const response = server.getData(params.request);
      // adding delay to simulate real server call
      setTimeout(() => {
        if (response.success) {
          // call the success callback
          params.success({
            rowData: response.rows,
            rowCount: response.lastRow,
          });
        } else {
          // inform the grid request failed
          params.fail();
        }
      }, 400);
    },
  };
}

const VueExample = defineComponent({
  template: `
        <div style="height: 100%">
                <div class="example-wrapper">
      <div style="margin-bottom: 5px">
        <button v-on:click="onBtRouteOfSelected()">Route of Selected</button>
      </div>
      <ag-grid-vue
        style="width: 100%; height: 100%;"
        @grid-ready="onGridReady"
        :columnDefs="columnDefs"
        :defaultColDef="defaultColDef"
        :autoGroupColumnDef="autoGroupColumnDef"
        :rowModelType="rowModelType"
        :rowSelection="rowSelection"
        :getRowId="getRowId"
        :isServerSideGroupOpenByDefault="isServerSideGroupOpenByDefault"
        :rowData="rowData"></ag-grid-vue>
      </div>
        </div>
    `,
  components: {
    "ag-grid-vue": AgGridVue,
  },
  setup(props) {
    const gridApi = shallowRef<GridApi<IOlympicData> | null>(null);
    const columnDefs = ref<ColDef[]>([
      { field: "country", enableRowGroup: true, rowGroup: true, hide: true },
      { field: "sport", enableRowGroup: true, rowGroup: true, hide: true },
      { field: "year", minWidth: 100 },
      { field: "gold", aggFunc: "sum", enableValue: true },
      { field: "silver", aggFunc: "sum", enableValue: true },
      { field: "bronze", aggFunc: "sum", enableValue: true },
    ]);
    const defaultColDef = ref<ColDef>({
      flex: 1,
      minWidth: 120,
    });
    const autoGroupColumnDef = ref<ColDef>({
      flex: 1,
      minWidth: 280,
    });
    const rowModelType = ref<RowModelType>("serverSide");
    const rowSelection = ref<RowSelectionOptions | "single" | "multiple">({
      mode: "multiRow",
    });
    const rowData = ref<IOlympicData[]>(null);

    function onBtRouteOfSelected() {
      const selectedNodes = gridApi.value!.getSelectedNodes();
      selectedNodes.forEach(function (rowNode, index) {
        const route = rowNode.getRoute();
        const routeString = route ? route.join(",") : undefined;
        console.log("#" + index + ", route = [" + routeString + "]");
      });
    }
    const onGridReady = (params: GridReadyEvent) => {
      gridApi.value = params.api;

      const updateData = (data) => {
        // setup the fake server with entire dataset
        const fakeServer = new FakeServer(data);
        // create datasource with a reference to the fake server
        const datasource = getServerSideDatasource(fakeServer);
        // register the datasource with the grid
        params.api!.setGridOption("serverSideDatasource", datasource);
      };

      fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
        .then((resp) => resp.json())
        .then((data) => updateData(data));
    };
    function getRowId(params: GetRowIdParams) {
      return Math.random().toString();
    }
    function isServerSideGroupOpenByDefault(
      params: IsServerSideGroupOpenByDefaultParams,
    ) {
      const route = params.rowNode.getRoute();
      if (!route) {
        return false;
      }
      const routeAsString = route.join(",");
      const routesToOpenByDefault = [
        "Zimbabwe",
        "Zimbabwe,Swimming",
        "United States,Swimming",
      ];
      return routesToOpenByDefault.indexOf(routeAsString) >= 0;
    }

    return {
      gridApi,
      columnDefs,
      defaultColDef,
      autoGroupColumnDef,
      rowModelType,
      rowSelection,
      getRowId,
      isServerSideGroupOpenByDefault,
      rowData,
      onGridReady,
      onBtRouteOfSelected,
    };
  },
});

createApp(VueExample).mount("#app");
