import {
  createApp,
  defineComponent,
  onBeforeMount,
  ref,
  shallowRef,
} from "vue";
import { AgGridVue } from "ag-grid-vue3";
import {
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  GetRowIdParams,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ModuleRegistry,
  ValidationModule,
} from "ag-grid-community";
ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  ValidationModule /* Development Only */,
]);

const VueExample = defineComponent({
  template: `
        <div style="height: 100%">
                <ag-grid-vue
      style="width: 100%; height: 100%;"
      @grid-ready="onGridReady"
      :rowData="rowData"
      :columnDefs="columnDefs"></ag-grid-vue>
        </div>
    `,
  components: {
    "ag-grid-vue": AgGridVue,
  },
  setup(props) {
    const gridApi = shallowRef<GridApi | null>(null);
    const rowData = ref<any[] | null>([
      { make: "Toyota", model: "Celica", price: 35000 },
      { make: "Ford", model: "Mondeo", price: 32000 },
      { make: "Porsche", model: "Boxster", price: 72000 },
      { make: "BMW", model: "M50", price: 60000 },
      { make: "Aston Martin", model: "DBX", price: 190000 },
    ]);
    const columnDefs = ref<ColDef[]>([
      { field: "make" },
      { field: "model" },
      { field: "price" },
    ]);

    const onGridReady = (params: GridReadyEvent) => {
      gridApi.value = params.api;
    };

    return {
      gridApi,
      rowData,
      columnDefs,
      onGridReady,
    };
  },
});

createApp(VueExample).mount("#app");
