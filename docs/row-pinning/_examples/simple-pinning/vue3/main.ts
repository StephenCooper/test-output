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
  PinnedRowModule,
  RowClassParams,
  RowStyle,
  ValidationModule,
  createGrid,
} from "ag-grid-community";
import { IOlympicData } from "./interfaces";
ModuleRegistry.registerModules([
  PinnedRowModule,
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
      :rowData="rowData"
      :pinnedTopRowData="pinnedTopRowData"
      :pinnedBottomRowData="pinnedBottomRowData"></ag-grid-vue>
        </div>
    `,
  components: {
    "ag-grid-vue": AgGridVue,
  },
  setup(props) {
    const gridApi = shallowRef<GridApi<IOlympicData> | null>(null);
    const columnDefs = ref<ColDef[]>([
      { field: "athlete" },
      { field: "country" },
      { field: "sport" },
    ]);
    const defaultColDef = ref<ColDef>({
      flex: 1,
    });
    const pinnedTopRowData = ref<any[]>([
      {
        athlete: "TOP (athlete)",
        country: "TOP (country)",
        sport: "TOP (sport)",
      },
    ]);
    const pinnedBottomRowData = ref<any[]>([
      {
        athlete: "BOTTOM (athlete)",
        country: "BOTTOM (country)",
        sport: "BOTTOM (sport)",
      },
    ]);
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
      rowData,
      pinnedTopRowData,
      pinnedBottomRowData,
      onGridReady,
    };
  },
});

createApp(VueExample).mount("#app");
