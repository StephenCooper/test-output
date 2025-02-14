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
  id: string;
  make: string;
  model: string;
  price: number;
}

// specify the data
const rowDataA: ICar[] = [
  { id: "1", make: "Toyota", model: "Celica", price: 35000 },
  { id: "4", make: "BMW", model: "M50", price: 60000 },
  { id: "5", make: "Aston Martin", model: "DBX", price: 190000 },
];

const rowDataB: ICar[] = [
  { id: "1", make: "Toyota", model: "Celica", price: 35000 },
  { id: "2", make: "Ford", model: "Mondeo", price: 32000 },
  { id: "3", make: "Porsche", model: "Boxster", price: 72000 },
  { id: "4", make: "BMW", model: "M50", price: 60000 },
  { id: "5", make: "Aston Martin", model: "DBX", price: 190000 },
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
          :rowSelection="rowSelection"
          :getRowId="getRowId"></ag-grid-vue>
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
    const getRowId = ref<GetRowIdFunc>(
      (params: GetRowIdParams<ICar>) => params.data.id,
    );

    function onRowDataA() {
      gridApi.value!.setGridOption("rowData", rowDataA);
    }
    function onRowDataB() {
      gridApi.value!.setGridOption("rowData", rowDataB);
    }
    function onClearRowData() {
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
      getRowId,
      onGridReady,
      onRowDataA,
      onRowDataB,
      onClearRowData,
    };
  },
});

createApp(VueExample).mount("#app");
