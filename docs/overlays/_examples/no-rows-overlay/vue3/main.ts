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
  GridApi,
  GridOptions,
  GridReadyEvent,
  ModuleRegistry,
  ValidationModule,
  createGrid,
} from "ag-grid-community";
ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  ValidationModule /* Development Only */,
]);

interface IAthlete {
  athlete: string;
  country: string;
}

const VueExample = defineComponent({
  template: `
        <div style="height: 100%">
                <div class="example-wrapper">
      <div>
        <button v-on:click="onBtnClearRowData()">Clear rowData</button>
        <button v-on:click="onBtnSetRowData()">Set rowData</button>
      </div>
      <ag-grid-vue
        style="width: 100%; height: 100%;"
        @grid-ready="onGridReady"
        :rowData="rowData"
        :columnDefs="columnDefs"></ag-grid-vue>
      </div>
        </div>
    `,
  components: {
    "ag-grid-vue": AgGridVue,
  },
  setup(props) {
    const gridApi = shallowRef<GridApi<IAthlete> | null>(null);
    const rowData = ref<IAthlete[] | null>([]);
    const columnDefs = ref<ColDef[]>([
      { field: "athlete" },
      { field: "country" },
    ]);

    function onBtnClearRowData() {
      gridApi.value!.setGridOption("rowData", []);
    }
    function onBtnSetRowData() {
      gridApi.value!.setGridOption("rowData", [
        { athlete: "Michael Phelps", country: "US" },
      ]);
    }
    const onGridReady = (params: GridReadyEvent) => {
      gridApi.value = params.api;
    };

    return {
      gridApi,
      rowData,
      columnDefs,
      onGridReady,
      onBtnClearRowData,
      onBtnSetRowData,
    };
  },
});

createApp(VueExample).mount("#app");
