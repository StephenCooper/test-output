import {
  createApp,
  defineComponent,
  onBeforeMount,
  ref,
  shallowRef,
} from "vue";
import { AgGridVue } from "ag-grid-vue3";
import "./styles.css";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import {
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ModuleRegistry,
  NumberFilterModule,
  TextFilterModule,
  Theme,
  ValidationModule,
} from "ag-grid-community";
import { IOlympicData } from "./interfaces";
ModuleRegistry.registerModules([
  TextFilterModule,
  NumberFilterModule,
  ClientSideRowModelModule,
  ValidationModule /* Development Only */,
]);

const VueExample = defineComponent({
  template: `
        <div style="height: 100%">
                <ag-grid-vue
      style="width: 100%; height: 100%;"
      class="ag-theme-quartz"
      @grid-ready="onGridReady"
      :theme="theme"
      :columnDefs="columnDefs"
      :defaultColDef="defaultColDef"
      :rowData="rowData"></ag-grid-vue>
        </div>
    `,
  components: {
    "ag-grid-vue": AgGridVue,
  },
  setup(props) {
    const gridApi = shallowRef<GridApi<IOlympicData> | null>(null);
    const theme = ref<Theme | "legacy">("legacy");
    const columnDefs = ref<(ColDef | ColGroupDef)[]>([
      {
        headerName: "Athlete Details",
        children: [
          { field: "athlete" },
          { field: "age", maxWidth: 120 },
          { field: "country" },
        ],
      },
      { field: "year", maxWidth: 100 },
      {
        headerName: "Sport Details",
        children: [
          { field: "total", columnGroupShow: "closed" },
          { field: "gold", columnGroupShow: "open" },
          { field: "silver", columnGroupShow: "open" },
          { field: "bronze", columnGroupShow: "open" },
        ],
      },
    ]);
    const defaultColDef = ref<ColDef>({
      flex: 1,
      minWidth: 150,
      filter: true,
      floatingFilter: true,
    });
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
      theme,
      columnDefs,
      defaultColDef,
      rowData,
      onGridReady,
    };
  },
});

createApp(VueExample).mount("#app");
