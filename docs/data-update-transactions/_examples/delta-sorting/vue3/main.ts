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
  ClientSideRowModelApiModule,
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  GetRowIdFunc,
  GetRowIdParams,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ModuleRegistry,
  ValidationModule,
} from "ag-grid-community";
import { RowGroupingModule } from "ag-grid-enterprise";
ModuleRegistry.registerModules([
  ClientSideRowModelApiModule,
  ClientSideRowModelModule,
  RowGroupingModule,
  ValidationModule /* Development Only */,
]);

let lastGen = 0;

const generateItem = (id = lastGen++) => {
  return {
    id,
    sort: Math.floor(Math.random() * 3 + 2000),
    sort1: Math.floor(Math.random() * 3 + 2000),
    sort2: Math.floor(Math.random() * 100000 + 2000),
  };
};

const getRowData = (rows = 10) =>
  new Array(rows).fill(undefined).map((_) => generateItem());

const VueExample = defineComponent({
  template: `
        <div style="height: 100%">
                <div class="test-container">
      <div class="test-header">
        <div>
          <button v-on:click="addDefault()">Default Transaction</button>
          <button v-on:click="addDelta()">Delta Transaction</button>
          Transaction took: <span id="transactionDuration">N/A</span>
        </div>
      </div>
      <ag-grid-vue
        style="width: 100%; height: 100%;"
        class="test-grid"
        @grid-ready="onGridReady"
        :columnDefs="columnDefs"
        :defaultColDef="defaultColDef"
        :rowData="rowData"
        :deltaSort="true"
        :getRowId="getRowId"></ag-grid-vue>
      </div>
        </div>
    `,
  components: {
    "ag-grid-vue": AgGridVue,
  },
  setup(props) {
    const gridApi = shallowRef<GridApi | null>(null);
    const columnDefs = ref<ColDef[]>([
      { field: "id" },
      { field: "updatedBy" },
      { field: "sort", sortIndex: 0, sort: "desc" },
      { field: "sort1", sortIndex: 1, sort: "desc" },
      { field: "sort2", sortIndex: 2, sort: "desc" },
    ]);
    const defaultColDef = ref<ColDef>({
      flex: 1,
    });
    const rowData = ref<any[] | null>(getRowData(100000));
    const getRowId = ref<GetRowIdFunc>(({ data }: GetRowIdParams) =>
      String(data.id),
    );

    function addDelta() {
      const transaction = {
        add: getRowData(1).map((row) => ({ ...row, updatedBy: "delta" })),
        update: [{ id: 1, make: "Delta", updatedBy: "delta" }],
      };
      gridApi.value!.setGridOption("deltaSort", true);
      const startTime = new Date().getTime();
      gridApi.value!.applyTransaction(transaction);
      document.getElementById("transactionDuration")!.textContent =
        `${new Date().getTime() - startTime} ms`;
    }
    function addDefault() {
      const transaction = {
        add: getRowData(1).map((row) => ({ ...row, updatedBy: "default" })),
        update: [{ id: 2, make: "Default", updatedBy: "default" }],
      };
      gridApi.value!.setGridOption("deltaSort", false);
      const startTime = new Date().getTime();
      gridApi.value!.applyTransaction(transaction);
      document.getElementById("transactionDuration")!.textContent =
        `${new Date().getTime() - startTime} ms`;
    }
    const onGridReady = (params: GridReadyEvent) => {
      gridApi.value = params.api;
    };

    return {
      gridApi,
      columnDefs,
      defaultColDef,
      rowData,
      getRowId,
      onGridReady,
      addDelta,
      addDefault,
    };
  },
});

createApp(VueExample).mount("#app");
