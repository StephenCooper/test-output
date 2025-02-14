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
  IsServerSideGroupOpenByDefaultParams,
  ModuleRegistry,
  RowModelType,
  ServerSideTransaction,
  ServerSideTransactionResult,
  ValidationModule,
  createGrid,
} from "ag-grid-community";
import {
  RowGroupingModule,
  ServerSideRowModelApiModule,
  ServerSideRowModelModule,
} from "ag-grid-enterprise";
import {
  changePortfolioOnServer,
  createRowOnServer,
  data,
  deletePortfolioOnServer,
} from "./data";
import { FakeServer } from "./fakeServer";
ModuleRegistry.registerModules([
  HighlightChangesModule,
  RowGroupingModule,
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

function logResults(
  transaction: ServerSideTransaction,
  result?: ServerSideTransactionResult,
) {
  console.log(
    "[Example] - Applied transaction:",
    transaction,
    "Result:",
    result,
  );
}

const VueExample = defineComponent({
  template: `
        <div style="height: 100%">
                <div class="example-wrapper">
      <div style="margin-bottom: 5px">
        <button v-on:click="createOneAggressive()">Add new 'Aggressive'</button>
        <button v-on:click="updateAggressiveToHybrid()">Move all 'Aggressive' to 'Hybrid'</button>
        <button v-on:click="deleteAllHybrid()">Remove all 'Hybrid'</button>
      </div>
      <ag-grid-vue
        style="width: 100%; height: 100%;"
        @grid-ready="onGridReady"
        :columnDefs="columnDefs"
        :defaultColDef="defaultColDef"
        :autoGroupColumnDef="autoGroupColumnDef"
        :isServerSideGroupOpenByDefault="isServerSideGroupOpenByDefault"
        :getRowId="getRowId"
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
      { field: "portfolio", hide: true, rowGroup: true },
      { field: "book" },
      { field: "previous" },
      { field: "current" },
    ]);
    const defaultColDef = ref<ColDef>({
      flex: 1,
      minWidth: 100,
      enableCellChangeFlash: true,
    });
    const autoGroupColumnDef = ref<ColDef>({
      minWidth: 220,
    });
    const isServerSideGroupOpenByDefault = ref<
      (params: IsServerSideGroupOpenByDefaultParams) => boolean
    >((params: IsServerSideGroupOpenByDefaultParams) => {
      return (
        params.rowNode.key === "Aggressive" || params.rowNode.key === "Hybrid"
      );
    });
    const getRowId = ref<GetRowIdFunc>((params: GetRowIdParams) => {
      if (params.level === 0) {
        return params.data.portfolio;
      }
      return String(params.data.tradeId);
    });
    const rowModelType = ref<RowModelType>("serverSide");
    const rowData = ref<any[]>(null);

    function deleteAllHybrid() {
      // NOTE: real applications would be better served listening to a stream of changes from the server instead
      const serverResponse: any = deletePortfolioOnServer("Hybrid");
      if (!serverResponse.success) {
        console.warn("Nothing has changed on the server");
        return;
      }
      if (serverResponse) {
        // apply tranaction to keep grid in sync
        const transaction = {
          remove: [{ portfolio: "Hybrid" }],
        };
        const result = gridApi.value!.applyServerSideTransaction(transaction);
        logResults(transaction, result);
      }
    }
    function createOneAggressive() {
      // NOTE: real applications would be better served listening to a stream of changes from the server instead
      const serverResponse: any = createRowOnServer(
        "Aggressive",
        "Aluminium",
        "GL-1",
      );
      if (!serverResponse.success) {
        console.warn("Nothing has changed on the server");
        return;
      }
      if (serverResponse.newGroupCreated) {
        // if a new group had to be created, reflect in the grid
        const transaction = {
          route: [],
          add: [{ portfolio: "Aggressive" }],
        };
        const result = gridApi.value!.applyServerSideTransaction(transaction);
        logResults(transaction, result);
      } else {
        // if the group already existed, add rows to it
        const transaction = {
          route: ["Aggressive"],
          add: [serverResponse.newRecord],
        };
        const result = gridApi.value!.applyServerSideTransaction(transaction);
        logResults(transaction, result);
      }
    }
    function updateAggressiveToHybrid() {
      // NOTE: real applications would be better served listening to a stream of changes from the server instead
      const serverResponse: any = changePortfolioOnServer(
        "Aggressive",
        "Hybrid",
      );
      if (!serverResponse.success) {
        console.warn("Nothing has changed on the server");
        return;
      }
      const transaction = {
        remove: [{ portfolio: "Aggressive" }],
      };
      // aggressive group no longer exists, so delete the group
      const result = gridApi.value!.applyServerSideTransaction(transaction);
      logResults(transaction, result);
      if (serverResponse.newGroupCreated) {
        // hybrid group didn't exist, so just create the new group
        const t = {
          route: [],
          add: [{ portfolio: "Hybrid" }],
        };
        const r = gridApi.value!.applyServerSideTransaction(t);
        logResults(t, r);
      } else {
        // hybrid group already existed, add rows to it
        const t = {
          route: ["Hybrid"],
          add: serverResponse.updatedRecords,
        };
        const r = gridApi.value!.applyServerSideTransaction(t);
        logResults(t, r);
      }
    }
    const onGridReady = (params: GridReadyEvent) => {
      gridApi.value = params.api;

      // setup the fake server
      const server = new FakeServer(data);
      // create datasource with a reference to the fake server
      const datasource = getServerSideDatasource(server);
      // register the datasource with the grid
      params.api.setGridOption("serverSideDatasource", datasource);
    };

    return {
      gridApi,
      columnDefs,
      defaultColDef,
      autoGroupColumnDef,
      isServerSideGroupOpenByDefault,
      getRowId,
      rowModelType,
      rowData,
      onGridReady,
      deleteAllHybrid,
      createOneAggressive,
      updateAggressiveToHybrid,
    };
  },
});

createApp(VueExample).mount("#app");
