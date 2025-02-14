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
  GridApi,
  GridOptions,
  GridReadyEvent,
  IServerSideDatasource,
  ModuleRegistry,
  RowModelType,
  ValidationModule,
} from "ag-grid-community";
import {
  RowGroupingModule,
  ServerSideRowModelApiModule,
  ServerSideRowModelModule,
} from "ag-grid-enterprise";
import { FakeServer } from "./fakeServer";
import { IOlympicData } from "./interfaces";
ModuleRegistry.registerModules([
  RowGroupingModule,
  ServerSideRowModelModule,
  ServerSideRowModelApiModule,
  ValidationModule /* Development Only */,
]);

function getServerSideDatasource(server: any): IServerSideDatasource {
  return {
    getRows: (params) => {
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
      }, 1000);
    },
  };
}

const VueExample = defineComponent({
  template: `
        <div style="height: 100%">
                <div class="example-wrapper">
      <div style="margin-bottom: 5px">
        <label><input type="checkbox" id="failLoad"> Make Loads Fail</label>
        &nbsp;&nbsp;&nbsp;&nbsp;
        <button v-on:click="onBtRetry()">Retry Failed Loads</button>
        &nbsp;&nbsp;&nbsp;&nbsp;
        <button v-on:click="onBtReset()">Reset Entire Grid</button>
      </div>
      <ag-grid-vue
        style="width: 100%; height: 100%;"
        @grid-ready="onGridReady"
        :columnDefs="columnDefs"
        :defaultColDef="defaultColDef"
        :autoGroupColumnDef="autoGroupColumnDef"
        :rowModelType="rowModelType"
        :maxConcurrentDatasourceRequests="maxConcurrentDatasourceRequests"
        :suppressAggFuncInHeader="true"
        :purgeClosedRowNodes="true"
        :cacheBlockSize="cacheBlockSize"
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
      {
        // demonstrating the use of valueGetters
        colId: "country",
        valueGetter: "data.country",
        rowGroup: true,
        hide: true,
      },
      { field: "sport", rowGroup: true, hide: true },
      { field: "year", minWidth: 100 },
      { field: "gold", aggFunc: "sum" },
      { field: "silver", aggFunc: "sum" },
      { field: "bronze", aggFunc: "sum" },
    ]);
    const defaultColDef = ref<ColDef>({
      flex: 1,
      minWidth: 120,
    });
    const autoGroupColumnDef = ref<ColDef>({
      flex: 1,
      minWidth: 280,
      field: "athlete",
    });
    const rowModelType = ref<RowModelType>("serverSide");
    const maxConcurrentDatasourceRequests = ref(1);
    const cacheBlockSize = ref(20);
    const rowData = ref<IOlympicData[]>(null);

    function onBtRetry() {
      gridApi.value!.retryServerSideLoads();
    }
    function onBtReset() {
      gridApi.value!.refreshServerSide({ purge: true });
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

    return {
      gridApi,
      columnDefs,
      defaultColDef,
      autoGroupColumnDef,
      rowModelType,
      maxConcurrentDatasourceRequests,
      cacheBlockSize,
      rowData,
      onGridReady,
      onBtRetry,
      onBtReset,
    };
  },
});

createApp(VueExample).mount("#app");
