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
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  ColumnApiModule,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ModuleRegistry,
  ValidationModule,
  createGrid,
} from "ag-grid-community";
ModuleRegistry.registerModules([
  ColumnApiModule,
  ClientSideRowModelModule,
  ValidationModule /* Development Only */,
]);

const VueExample = defineComponent({
  template: `
        <div style="height: 100%">
                <div class="example-wrapper">
      <div style="margin-bottom: 1rem">
        <button v-on:click="getAllColumns()">Log All Columns</button>
        <button v-on:click="getAllColumnIds()">Log All Column IDs</button>
      </div>
      <ag-grid-vue
        style="width: 100%; height: 100%;"
        @grid-ready="onGridReady"
        :columnDefs="columnDefs"
        :rowData="rowData"
        :defaultColDef="defaultColDef"></ag-grid-vue>
      </div>
        </div>
    `,
  components: {
    "ag-grid-vue": AgGridVue,
  },
  setup(props) {
    const gridApi = shallowRef<GridApi | null>(null);
    const columnDefs = ref<ColDef[]>([
      { field: "make" },
      { field: "model" },
      { field: "price" },
    ]);
    const rowData = ref<any[] | null>([
      { make: "Toyota", model: "Celica", price: 35000 },
      { make: "Ford", model: "Mondeo", price: 32000 },
      { make: "Porsche", model: "Boxster", price: 72000 },
      { make: "BMW", model: "M50", price: 60000 },
      { make: "Aston Martin", model: "DBX", price: 190000 },
    ]);
    const defaultColDef = ref<ColDef>({
      flex: 1,
    });

    function getAllColumns() {
      console.log(gridApi.value!.getColumns());
      window.alert("Columns printed to developer's console");
    }
    function getAllColumnIds() {
      const columns = gridApi.value!.getColumns();
      if (columns) {
        console.log(columns.map((col) => col.getColId()));
      }
      window.alert("Column IDs printed to developer's console");
    }
    const onGridReady = (params: GridReadyEvent) => {
      gridApi.value = params.api;
    };

    return {
      gridApi,
      columnDefs,
      rowData,
      defaultColDef,
      onGridReady,
      getAllColumns,
      getAllColumnIds,
    };
  },
});

createApp(VueExample).mount("#app");
