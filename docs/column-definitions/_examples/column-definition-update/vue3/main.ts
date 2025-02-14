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
  ColumnAutoSizeModule,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ModuleRegistry,
  SizeColumnsToContentStrategy,
  SizeColumnsToFitGridStrategy,
  SizeColumnsToFitProvidedWidthStrategy,
  ValidationModule,
  createGrid,
} from "ag-grid-community";
import { IOlympicData } from "./interfaces";
ModuleRegistry.registerModules([
  ColumnAutoSizeModule,
  ClientSideRowModelModule,
  ValidationModule /* Development Only */,
]);

const columnDefinitions: ColDef[] = [
  { field: "athlete" },
  { field: "age" },
  { field: "country" },
  { field: "sport" },
];

const updatedHeaderColumnDefs: ColDef[] = [
  { field: "athlete", headerName: "C1" },
  { field: "age", headerName: "C2" },
  { field: "country", headerName: "C3" },
  { field: "sport", headerName: "C4" },
];

const VueExample = defineComponent({
  template: `
        <div style="height: 100%">
                <div class="test-container">
      <div class="test-header">
        <button v-on:click="onBtUpdateHeaders()">Update Header Names</button>
        <button v-on:click="onBtRestoreHeaders()">Restore Original Column Definitions</button>
      </div>
      <ag-grid-vue
        style="width: 100%; height: 100%;"
        @grid-ready="onGridReady"
        :columnDefs="columnDefs"
        :autoSizeStrategy="autoSizeStrategy"
        :rowData="rowData"></ag-grid-vue>
      </div>
        </div>
    `,
  components: {
    "ag-grid-vue": AgGridVue,
  },
  setup(props) {
    const gridApi = shallowRef<GridApi<IOlympicData> | null>(null);
    const columnDefs = ref<ColDef[]>(columnDefinitions);
    const autoSizeStrategy = ref<
      | SizeColumnsToFitGridStrategy
      | SizeColumnsToFitProvidedWidthStrategy
      | SizeColumnsToContentStrategy
    >({
      type: "fitGridWidth",
    });
    const rowData = ref<IOlympicData[]>(null);

    function onBtUpdateHeaders() {
      gridApi.value!.setGridOption("columnDefs", updatedHeaderColumnDefs);
    }
    function onBtRestoreHeaders() {
      gridApi.value!.setGridOption("columnDefs", columnDefinitions);
    }
    const onGridReady = (params: GridReadyEvent) => {
      gridApi.value = params.api;

      const updateData = (data) => (rowData.value = data);

      fetch("https://www.ag-grid.com/example-assets/small-olympic-winners.json")
        .then((resp) => resp.json())
        .then((data) => updateData(data));
    };

    return {
      gridApi,
      columnDefs,
      autoSizeStrategy,
      rowData,
      onGridReady,
      onBtUpdateHeaders,
      onBtRestoreHeaders,
    };
  },
});

createApp(VueExample).mount("#app");
