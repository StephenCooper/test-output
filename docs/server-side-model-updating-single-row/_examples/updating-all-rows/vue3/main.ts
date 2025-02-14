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
  HighlightChangesModule,
  IServerSideDatasource,
  ModuleRegistry,
  RowApiModule,
  RowModelType,
  ValidationModule,
} from "ag-grid-community";
import {
  RowGroupingModule,
  ServerSideRowModelModule,
} from "ag-grid-enterprise";
import { FakeServer } from "./fakeServer";
ModuleRegistry.registerModules([
  RowApiModule,
  HighlightChangesModule,
  RowGroupingModule,
  ServerSideRowModelModule,
  ValidationModule /* Development Only */,
]);

let versionCounter: number = 0;

const getServerSideDatasource = (server: any): IServerSideDatasource => {
  return {
    getRows: (params) => {
      console.log("[Datasource] - rows requested by grid: ", params.request);
      const response = server.getData(params.request);
      const dataWithVersion = response.rows.map((rowData: any) => {
        return {
          ...rowData,
          version:
            versionCounter + " - " + versionCounter + " - " + versionCounter,
        };
      });
      // adding delay to simulate real server call
      setTimeout(() => {
        if (response.success) {
          // call the success callback
          params.success({
            rowData: dataWithVersion,
            rowCount: response.lastRow,
          });
        } else {
          // inform the grid request failed
          params.fail();
        }
      }, 1000);
    },
  };
};

const VueExample = defineComponent({
  template: `
        <div style="height: 100%">
                <div class="example-wrapper">
      <div style="margin-bottom: 5px">
        <button v-on:click="setRows()">Set Rows</button>
        <button v-on:click="updateRows()">Update Rows</button>
      </div>
      <ag-grid-vue
        style="width: 100%; height: 100%;"
        @grid-ready="onGridReady"
        :columnDefs="columnDefs"
        :defaultColDef="defaultColDef"
        :rowModelType="rowModelType"
        :cacheBlockSize="cacheBlockSize"
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
      { field: "athlete" },
      { field: "date" },
      { field: "country" },
      { field: "version" },
    ]);
    const defaultColDef = ref<ColDef>({
      flex: 1,
      sortable: false,
      enableCellChangeFlash: true,
    });
    const rowModelType = ref<RowModelType>("serverSide");
    const cacheBlockSize = ref(75);
    const rowData = ref<any[]>(null);

    function setRows() {
      versionCounter += 1;
      const version =
        versionCounter + " - " + versionCounter + " - " + versionCounter;
      gridApi.value!.forEachNode((node) => {
        node.setData({ ...node.data, version });
      });
    }
    function updateRows() {
      versionCounter += 1;
      const version =
        versionCounter + " - " + versionCounter + " - " + versionCounter;
      gridApi.value!.forEachNode((node) => {
        node.updateData({ ...node.data, version });
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
      rowModelType,
      cacheBlockSize,
      rowData,
      onGridReady,
      setRows,
      updateRows,
    };
  },
});

createApp(VueExample).mount("#app");
