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
  GetRowIdFunc,
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
      :columnDefs="columnDefs"
      :rowData="rowData"
      :defaultColDef="defaultColDef"
      :getRowId="getRowId"></ag-grid-vue>
        </div>
    `,
  components: {
    "ag-grid-vue": AgGridVue,
  },
  setup(props) {
    const gridApi = shallowRef<GridApi | null>(null);
    const columnDefs = ref<ColDef[]>([
      { field: "id", headerName: "Row ID" },
      { field: "make" },
      { field: "model" },
      { field: "price" },
    ]);
    const rowData = ref<any[] | null>([
      { id: "c1", make: "Toyota", model: "Celica", price: 35000 },
      { id: "c2", make: "Ford", model: "Mondeo", price: 32000 },
      { id: "c8", make: "Porsche", model: "Boxster", price: 72000 },
      { id: "c4", make: "BMW", model: "M50", price: 60000 },
      { id: "c14", make: "Aston Martin", model: "DBX", price: 190000 },
    ]);
    const defaultColDef = ref<ColDef>({
      flex: 1,
    });
    const getRowId = ref<GetRowIdFunc>((params: GetRowIdParams) =>
      String(params.data.id),
    );

    const onGridReady = (params: GridReadyEvent) => {
      gridApi.value = params.api;
    };

    return {
      gridApi,
      columnDefs,
      rowData,
      defaultColDef,
      getRowId,
      onGridReady,
    };
  },
});

createApp(VueExample).mount("#app");
