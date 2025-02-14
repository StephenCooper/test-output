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
  ColumnAutoSizeModule,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ModuleRegistry,
  SizeColumnsToContentStrategy,
  SizeColumnsToFitGridStrategy,
  SizeColumnsToFitProvidedWidthStrategy,
  ValidationModule,
} from "ag-grid-community";
import { ColumnsToolPanelModule, RowGroupingModule } from "ag-grid-enterprise";
import { IOlympicData } from "./interfaces";
ModuleRegistry.registerModules([
  ColumnApiModule,
  ColumnAutoSizeModule,
  ClientSideRowModelModule,
  ColumnsToolPanelModule,
  RowGroupingModule,
  ValidationModule /* Development Only */,
]);

const VueExample = defineComponent({
  template: `
        <div style="height: 100%">
                <div class="test-container">
      <div class="test-header">
        <button v-on:click="onBtSortAthlete()">Sort Athlete</button>
        <button v-on:click="onBtClearAllSorting()">Clear All Sorting</button>
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
    const columnDefs = ref<ColDef[]>([
      { field: "athlete" },
      { field: "age" },
      { field: "country" },
      { field: "sport" },
    ]);
    const autoSizeStrategy = ref<
      | SizeColumnsToFitGridStrategy
      | SizeColumnsToFitProvidedWidthStrategy
      | SizeColumnsToContentStrategy
    >({
      type: "fitGridWidth",
    });
    const rowData = ref<IOlympicData[]>(null);

    function onBtSortAthlete() {
      gridApi.value!.applyColumnState({
        state: [{ colId: "athlete", sort: "asc" }],
      });
    }
    function onBtClearAllSorting() {
      gridApi.value!.applyColumnState({
        defaultState: { sort: null },
      });
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
      onBtSortAthlete,
      onBtClearAllSorting,
    };
  },
});

createApp(VueExample).mount("#app");
