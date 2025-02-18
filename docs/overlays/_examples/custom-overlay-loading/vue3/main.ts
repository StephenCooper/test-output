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
import CustomLoadingOverlay from "./customLoadingOverlayVue";
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
        <label class="checkbox">
          <input type="checkbox" checked="" v-on:change="setLoading($event.currentTarget.checked)">
            loading
          </label>
        </div>
        <ag-grid-vue
          style="width: 100%; height: 100%;"
          @grid-ready="onGridReady"
          :columnDefs="columnDefs"
          :rowData="rowData"
          :defaultColDef="defaultColDef"
          :loading="true"
          :loadingOverlayComponent="loadingOverlayComponent"
          :loadingOverlayComponentParams="loadingOverlayComponentParams"></ag-grid-vue>
        </div>
        </div>
    `,
  components: {
    "ag-grid-vue": AgGridVue,
    CustomLoadingOverlay,
  },
  setup(props) {
    const gridApi = shallowRef<GridApi<IAthlete> | null>(null);
    const columnDefs = ref<ColDef[]>([
      { field: "athlete", width: 150 },
      { field: "country", width: 120 },
    ]);
    const rowData = ref<IAthlete[] | null>([
      { athlete: "Michael Phelps", country: "United States" },
      { athlete: "Natalie Coughlin", country: "United States" },
      { athlete: "Aleksey Nemov", country: "Russia" },
      { athlete: "Alicia Coutts", country: "Australia" },
    ]);
    const defaultColDef = ref<ColDef>({
      editable: true,
      flex: 1,
      minWidth: 100,
      filter: true,
    });
    const loadingOverlayComponent = ref("CustomLoadingOverlay");
    const loadingOverlayComponentParams = ref({
      loadingMessage: "One moment please...",
    });

    function setLoading(value: boolean) {
      gridApi.value!.setGridOption("loading", value);
    }
    const onGridReady = (params: GridReadyEvent) => {
      gridApi.value = params.api;
    };

    return {
      gridApi,
      columnDefs,
      rowData,
      defaultColDef,
      loadingOverlayComponent,
      loadingOverlayComponentParams,
      onGridReady,
      setLoading,
    };
  },
});

createApp(VueExample).mount("#app");
