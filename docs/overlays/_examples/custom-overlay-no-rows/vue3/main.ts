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
  TextEditorModule,
  TextFilterModule,
  ValidationModule,
} from "ag-grid-community";
import CustomNoRowsOverlay from "./customNoRowsOverlayVue";
ModuleRegistry.registerModules([
  TextEditorModule,
  TextFilterModule,
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
        :columnDefs="columnDefs"
        :defaultColDef="defaultColDef"
        :rowData="rowData"
        :noRowsOverlayComponent="noRowsOverlayComponent"
        :noRowsOverlayComponentParams="noRowsOverlayComponentParams"></ag-grid-vue>
      </div>
        </div>
    `,
  components: {
    "ag-grid-vue": AgGridVue,
    CustomNoRowsOverlay,
  },
  setup(props) {
    const gridApi = shallowRef<GridApi<IAthlete> | null>(null);
    const columnDefs = ref<ColDef[]>([
      { field: "athlete", width: 150 },
      { field: "country", width: 120 },
    ]);
    const defaultColDef = ref<ColDef>({
      editable: true,
      flex: 1,
      minWidth: 100,
      filter: true,
    });
    const rowData = ref<IAthlete[] | null>([]);
    const noRowsOverlayComponent = ref("CustomNoRowsOverlay");
    const noRowsOverlayComponentParams = ref({
      noRowsMessageFunc: () =>
        "No rows found at: " + new Date().toLocaleTimeString(),
    });

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
      columnDefs,
      defaultColDef,
      rowData,
      noRowsOverlayComponent,
      noRowsOverlayComponentParams,
      onGridReady,
      onBtnClearRowData,
      onBtnSetRowData,
    };
  },
});

createApp(VueExample).mount("#app");
