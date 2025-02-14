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
  RowSelectionOptions,
  ServerSideTransaction,
  ServerSideTransactionResult,
  ValidationModule,
} from "ag-grid-community";
import {
  ServerSideRowModelApiModule,
  ServerSideRowModelModule,
} from "ag-grid-enterprise";
import { data } from "./data";
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

function getNewValue() {
  return Math.floor(Math.random() * 100000) + 100;
}

let serverCurrentTradeId = data.length;

function createRow() {
  return {
    portfolio: "Aggressive",
    product: "Aluminium",
    book: "GL-62472",
    tradeId: ++serverCurrentTradeId,
    current: getNewValue(),
  };
}

const VueExample = defineComponent({
  template: `
        <div style="height: 100%">
                <div class="example-wrapper">
      <div style="margin-bottom: 5px">
        <button v-on:click="addRow()">Add Above Selected</button>
        <button v-on:click="updateRow()">Update Selected</button>
        <button v-on:click="removeRow()">Remove Selected</button>
      </div>
      <ag-grid-vue
        style="width: 100%; height: 100%;"
        @grid-ready="onGridReady"
        :columnDefs="columnDefs"
        :defaultColDef="defaultColDef"
        :autoGroupColumnDef="autoGroupColumnDef"
        :getRowId="getRowId"
        :rowSelection="rowSelection"
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
    const getRowId = ref<GetRowIdFunc>(
      (params: GetRowIdParams) => `${params.data.tradeId}`,
    );
    const rowSelection = ref<RowSelectionOptions | "single" | "multiple">({
      mode: "singleRow",
    });
    const rowModelType = ref<RowModelType>("serverSide");
    const rowData = ref<any[]>(null);

    function addRow() {
      const selectedRows = gridApi.value!.getSelectedNodes();
      if (selectedRows.length === 0) {
        console.warn("[Example] No row selected.");
        return;
      }
      const rowIndex = selectedRows[0].rowIndex;
      const transaction: ServerSideTransaction = {
        addIndex: rowIndex != null ? rowIndex : undefined,
        add: [createRow()],
      };
      const result = gridApi.value!.applyServerSideTransaction(transaction);
      logResults(transaction, result);
    }
    function updateRow() {
      const selectedRows = gridApi.value!.getSelectedNodes();
      if (selectedRows.length === 0) {
        console.warn("[Example] No row selected.");
        return;
      }
      const transaction: ServerSideTransaction = {
        update: [{ ...selectedRows[0].data, current: getNewValue() }],
      };
      const result = gridApi.value!.applyServerSideTransaction(transaction);
      logResults(transaction, result);
    }
    function removeRow() {
      const selectedRows = gridApi.value!.getSelectedNodes();
      if (selectedRows.length === 0) {
        console.warn("[Example] No row selected.");
        return;
      }
      const transaction: ServerSideTransaction = {
        remove: [selectedRows[0].data],
      };
      const result = gridApi.value!.applyServerSideTransaction(transaction);
      logResults(transaction, result);
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
      getRowId,
      rowSelection,
      rowModelType,
      rowData,
      onGridReady,
      addRow,
      updateRow,
      removeRow,
    };
  },
});

createApp(VueExample).mount("#app");
