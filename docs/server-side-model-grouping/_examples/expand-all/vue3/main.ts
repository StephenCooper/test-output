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
  IServerSideGetRowsParams,
  ModuleRegistry,
  RowApiModule,
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
  RowApiModule,
  RowGroupingModule,
  ServerSideRowModelModule,
  ServerSideRowModelApiModule,
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
            groupLevelInfo: {
              lastLoadedTime: new Date().toLocaleString(),
              randomValue: Math.random(),
            },
          });
        } else {
          // inform the grid request failed
          params.fail();
        }
      }, 200);
    },
  };
}

const VueExample = defineComponent({
  template: `
        <div style="height: 100%">
                <div class="example-wrapper">
      <div style="margin-bottom: 5px">
        <button v-on:click="onBtExpandAll()">Expand All</button>
        &nbsp;&nbsp;&nbsp;
        <button v-on:click="onBtCollapseAll()">Collapse All</button>
        &nbsp;&nbsp;&nbsp;
        <button v-on:click="onBtExpandTopLevel()">Expand Top Level Only</button>
      </div>
      <ag-grid-vue
        style="width: 100%; height: 100%;"
        @grid-ready="onGridReady"
        :columnDefs="columnDefs"
        :defaultColDef="defaultColDef"
        :autoGroupColumnDef="autoGroupColumnDef"
        :maxConcurrentDatasourceRequests="maxConcurrentDatasourceRequests"
        :rowModelType="rowModelType"
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
        field: "year",
        enableRowGroup: true,
        rowGroup: true,
        hide: true,
        minWidth: 100,
      },
      { field: "country", enableRowGroup: true, rowGroup: true, hide: true },
      { field: "sport", enableRowGroup: true, rowGroup: true, hide: true },
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
    const maxConcurrentDatasourceRequests = ref(1);
    const rowModelType = ref<RowModelType>("serverSide");
    const rowData = ref<IOlympicData[]>(null);

    function onBtExpandAll() {
      gridApi.value!.expandAll();
    }
    function onBtCollapseAll() {
      gridApi.value!.collapseAll();
    }
    function onBtExpandTopLevel() {
      gridApi.value!.forEachNode(function (node) {
        if (node.group && node.level == 0) {
          node.setExpanded(true);
        }
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

    return {
      gridApi,
      columnDefs,
      defaultColDef,
      autoGroupColumnDef,
      maxConcurrentDatasourceRequests,
      rowModelType,
      rowData,
      onGridReady,
      onBtExpandAll,
      onBtCollapseAll,
      onBtExpandTopLevel,
    };
  },
});

createApp(VueExample).mount("#app");
