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
  GridApi,
  GridOptions,
  GridReadyEvent,
  HighlightChangesModule,
  IServerSideGetRowsParams,
  ModuleRegistry,
  RowModelType,
  ServerSideTransaction,
  ValidationModule,
} from "ag-grid-community";
import {
  ServerSideRowModelApiModule,
  ServerSideRowModelModule,
} from "ag-grid-enterprise";
import { data, dataObservers, randomUpdates } from "./data";
import { FakeServer } from "./fakeServer";
ModuleRegistry.registerModules([
  HighlightChangesModule,
  ServerSideRowModelModule,
  ServerSideRowModelApiModule,
  ValidationModule /* Development Only */,
]);

function getServerSideDatasource(server: any) {
  return {
    getRows: (params: IServerSideGetRowsParams) => {
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
      }, 300);
    },
  };
}

let interval: any;

function disable(id: string, disabled: boolean) {
  document.querySelector<HTMLInputElement>(id)!.disabled = disabled;
}

const VueExample = defineComponent({
  template: `
        <div style="height: 100%">
                <div class="example-wrapper">
      <div style="margin-bottom: 5px">
        <button id="startUpdates" v-on:click="startUpdates()">Start Updates</button>
        <button id="stopUpdates" v-on:click="stopUpdates()">Stop Updates</button>
      </div>
      <ag-grid-vue
        style="width: 100%; height: 100%;"
        @grid-ready="onGridReady"
        :columnDefs="columnDefs"
        :defaultColDef="defaultColDef"
        :autoGroupColumnDef="autoGroupColumnDef"
        :getRowId="getRowId"
        :asyncTransactionWaitMillis="asyncTransactionWaitMillis"
        :rowModelType="rowModelType"
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
      { field: "tradeId" },
      { field: "portfolio" },
      { field: "book" },
      { field: "previous" },
      { field: "current" },
      {
        field: "lastUpdated",
        wrapHeaderText: true,
        autoHeaderHeight: true,
        valueFormatter: (params) => {
          const ts = params.data!.lastUpdated;
          if (ts) {
            const hh_mm_ss = ts.toLocaleString().split(" ")[1];
            const SSS = ts.getMilliseconds();
            return `${hh_mm_ss}:${SSS}`;
          }
          return "";
        },
      },
      { field: "updateCount" },
    ]);
    const defaultColDef = ref<ColDef>({
      flex: 1,
      minWidth: 100,
      enableCellChangeFlash: true,
    });
    const autoGroupColumnDef = ref<ColDef>({
      minWidth: 220,
    });
    const getRowId = ref<GetRowIdFunc>((params: GetRowIdParams) => {
      let rowId = "";
      if (params.parentKeys && params.parentKeys.length) {
        rowId += params.parentKeys.join("-") + "-";
      }
      if (params.data.tradeId != null) {
        rowId += params.data.tradeId;
      }
      return rowId;
    });
    const asyncTransactionWaitMillis = ref(1000);
    const rowModelType = ref<RowModelType>("serverSide");
    const rowData = ref<any[]>(null);

    function startUpdates() {
      interval = setInterval(
        () => randomUpdates({ numUpdate: 10, numAdd: 1, numRemove: 1 }),
        10,
      );
      disable("#stopUpdates", false);
      disable("#startUpdates", true);
    }
    function stopUpdates() {
      if (interval !== undefined) {
        clearInterval(interval);
      }
      disable("#stopUpdates", true);
      disable("#startUpdates", false);
    }
    const onGridReady = (params: GridReadyEvent) => {
      gridApi.value = params.api;

      disable("#stopUpdates", true);
      // setup the fake server
      const server = FakeServer(data);
      // create datasource with a reference to the fake server
      const datasource = getServerSideDatasource(server);
      // register the datasource with the grid
      params.api.setGridOption("serverSideDatasource", datasource);
      // register interest in data changes
      dataObservers.push((t: ServerSideTransaction) => {
        params.api.applyServerSideTransactionAsync(t);
      });
    };

    return {
      gridApi,
      columnDefs,
      defaultColDef,
      autoGroupColumnDef,
      getRowId,
      asyncTransactionWaitMillis,
      rowModelType,
      rowData,
      onGridReady,
      startUpdates,
      stopUpdates,
    };
  },
});

createApp(VueExample).mount("#app");
