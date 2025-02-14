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
  GridApi,
  GridOptions,
  GridReadyEvent,
  HighlightChangesModule,
  IServerSideGetRowsParams,
  IsServerSideGroupOpenByDefaultParams,
  ModuleRegistry,
  RowModelType,
  RowSelectionOptions,
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
import { createRowOnServer, data } from "./data";
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
        :rowSelection="rowSelection"
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
      field: "tradeId",
    });
    const isServerSideGroupOpenByDefault = ref<
      (params: IsServerSideGroupOpenByDefaultParams) => boolean
    >((params) => {
      return (
        params.rowNode.key === "Aggressive" || params.rowNode.key === "Hybrid"
      );
    });
    const getRowId = ref<GetRowIdFunc>((params) => {
      if (params.level === 0) {
        return params.data.portfolio;
      }
      return String(params.data.tradeId);
    });
    const rowModelType = ref<RowModelType>("serverSide");
    const rowSelection = ref<RowSelectionOptions | "single" | "multiple">({
      mode: "multiRow",
      groupSelects: "descendants",
    });
    const rowData = ref<any[]>(null);

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
    const onGridReady = (params: GridReadyEvent) => {
      gridApi.value = params.api;

      // setup the fake server
      const server = FakeServer(data);
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
      rowSelection,
      rowData,
      onGridReady,
      createOneAggressive,
    };
  },
});

createApp(VueExample).mount("#app");
