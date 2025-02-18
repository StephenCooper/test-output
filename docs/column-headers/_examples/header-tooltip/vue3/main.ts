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
  TooltipModule,
  ValidationModule,
} from "ag-grid-community";
import { IOlympicData } from "./interfaces";
ModuleRegistry.registerModules([
  TooltipModule,
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
      :defaultColDef="defaultColDef"
      :tooltipShowDelay="tooltipShowDelay"
      :rowData="rowData"></ag-grid-vue>
        </div>
    `,
  components: {
    "ag-grid-vue": AgGridVue,
  },
  setup(props) {
    const gridApi = shallowRef<GridApi<IOlympicData> | null>(null);
    const columnDefs = ref<ColDef[]>([
      { field: "athlete", headerTooltip: "The athlete's name" },
      { field: "age", headerTooltip: "The athlete's age" },
      { field: "date", headerTooltip: "The date of the Olympics" },
      { field: "sport", headerTooltip: "The sport the medal was for" },
      { field: "gold", headerTooltip: "How many gold medals" },
      { field: "silver", headerTooltip: "How many silver medals" },
      { field: "bronze", headerTooltip: "How many bronze medals" },
      { field: "total", headerTooltip: "The total number of medals" },
    ]);
    const defaultColDef = ref<ColDef>({
      width: 150,
    });
    const tooltipShowDelay = ref(500);
    const rowData = ref<IOlympicData[]>(null);

    const onGridReady = (params: GridReadyEvent) => {
      gridApi.value = params.api;

      const updateData = (data) => (rowData.value = data);

      fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
        .then((resp) => resp.json())
        .then((data) => updateData(data));
    };

    return {
      gridApi,
      columnDefs,
      defaultColDef,
      tooltipShowDelay,
      rowData,
      onGridReady,
    };
  },
});

createApp(VueExample).mount("#app");
