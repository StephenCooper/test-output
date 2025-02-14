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
  ISetFilter,
  ModuleRegistry,
  SideBarDef,
  ValidationModule,
  createGrid,
} from "ag-grid-community";
import {
  ColumnMenuModule,
  ColumnsToolPanelModule,
  ContextMenuModule,
  FiltersToolPanelModule,
  SetFilterModule,
} from "ag-grid-enterprise";
import { IOlympicData } from "./interfaces";
ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  ColumnsToolPanelModule,
  FiltersToolPanelModule,
  ColumnMenuModule,
  ContextMenuModule,
  SetFilterModule,
  ValidationModule /* Development Only */,
]);

let savedMiniFilterText: string | null = "";

const VueExample = defineComponent({
  template: `
        <div style="height: 100%">
                <div class="example-wrapper">
      <div class="example-header">
        <button v-on:click="getMiniFilterText()">Get Mini Filter Text</button>
        <button v-on:click="saveMiniFilterText()">Save Mini Filter Text</button>
        <button v-on:click="restoreMiniFilterText()">Restore Mini Filter Text</button>
      </div>
      <ag-grid-vue
        style="width: 100%; height: 100%;"
        @grid-ready="onGridReady"
        :columnDefs="columnDefs"
        :defaultColDef="defaultColDef"
        :sideBar="sideBar"
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
      { field: "athlete", filter: "agSetColumnFilter" },
    ]);
    const defaultColDef = ref<ColDef>({
      flex: 1,
      minWidth: 150,
      filter: true,
    });
    const sideBar = ref<SideBarDef | string | string[] | boolean | null>(
      "filters",
    );
    const rowData = ref<IOlympicData[]>(null);

    function getMiniFilterText() {
      gridApi
        .value!.getColumnFilterInstance<ISetFilter>("athlete")
        .then((athleteFilter) => {
          console.log(athleteFilter!.getMiniFilter());
        });
    }
    function saveMiniFilterText() {
      gridApi
        .value!.getColumnFilterInstance<ISetFilter>("athlete")
        .then((athleteFilter) => {
          savedMiniFilterText = athleteFilter!.getMiniFilter();
        });
    }
    function restoreMiniFilterText() {
      gridApi
        .value!.getColumnFilterInstance<ISetFilter>("athlete")
        .then((athleteFilter) => {
          athleteFilter!.setMiniFilter(savedMiniFilterText);
        });
    }
    const onGridReady = (params: GridReadyEvent) => {
      gridApi.value = params.api;

      params.api.getToolPanelInstance("filters")!.expandFilters();

      const updateData = (data) => (rowData.value = data);

      fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
        .then((resp) => resp.json())
        .then((data) => updateData(data));
    };

    return {
      gridApi,
      columnDefs,
      defaultColDef,
      sideBar,
      rowData,
      onGridReady,
      getMiniFilterText,
      saveMiniFilterText,
      restoreMiniFilterText,
    };
  },
});

createApp(VueExample).mount("#app");
