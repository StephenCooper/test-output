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
  GridApi,
  GridOptions,
  GridReadyEvent,
  ModuleRegistry,
  RowSelectionModule,
  RowSelectionOptions,
  ValidationModule,
  createGrid,
} from "ag-grid-community";
ModuleRegistry.registerModules([
  RowSelectionModule,
  ClientSideRowModelModule,
  ValidationModule /* Development Only */,
]);

interface ICar {
  make: string;
  model: string;
  price: number;
}

// specify the data
const rowDataA: ICar[] = [
  { make: "Toyota", model: "Celica", price: 35000 },
  { make: "Porsche", model: "Boxster", price: 72000 },
  { make: "Aston Martin", model: "DBX", price: 190000 },
];

const rowDataB: ICar[] = [
  { make: "Toyota", model: "Celica", price: 35000 },
  { make: "Ford", model: "Mondeo", price: 32000 },
  { make: "Porsche", model: "Boxster", price: 72000 },
  { make: "BMW", model: "M50", price: 60000 },
  { make: "Aston Martin", model: "DBX", price: 190000 },
];

const VueExample = defineComponent({
  template: `
        <div style="height: 100%">
                <div style="height: 100%; width: 100%; display: flex; flex-direction: column">
      <div style="margin-bottom: 5px; min-height: 30px">
        <button v-on:click="onRowDataA()">Row Data A</button>
        <button v-on:click="onRowDataB()">Row Data B</button>
        <button v-on:click="onClearRowData()">Clear Row Data</button>
      </div>
      <div style="flex: 1 1 0px">
        <ag-grid-vue
          style="width: 100%; height: 100%;"
          @grid-ready="onGridReady"
          :columnDefs="columnDefs"
          :rowData="rowData"
          :rowSelection="rowSelection"></ag-grid-vue>
        </div>
      </div>
        </div>
    `,
  components: {
    "ag-grid-vue": AgGridVue,
  },
  setup(props) {
    const gridApi = shallowRef<GridApi<ICar> | null>(null);
    const columnDefs = ref<ColDef[]>([
      { field: "make" },
      { field: "model" },
      { field: "price" },
    ]);
    const rowData = ref<ICar[] | null>(rowDataA);
    const rowSelection = ref<RowSelectionOptions | "single" | "multiple">({
      mode: "singleRow",
      checkboxes: false,
      enableClickSelection: true,
    });

    function onRowDataA() {
      gridApi.value!.setGridOption("rowData", rowDataA);
    }
    function onRowDataB() {
      gridApi.value!.setGridOption("rowData", rowDataB);
    }
    function onClearRowData() {
      // Clear rowData by setting it to an empty array
      gridApi.value!.setGridOption("rowData", []);
    }
    const onGridReady = (params: GridReadyEvent) => {
      gridApi.value = params.api;
    };

    return {
      gridApi,
      columnDefs,
      rowData,
      rowSelection,
      onGridReady,
      onRowDataA,
      onRowDataB,
      onClearRowData,
    };
  },
});

createApp(VueExample).mount("#app");
