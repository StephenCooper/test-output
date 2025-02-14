import {
  createApp,
  defineComponent,
  onBeforeMount,
  ref,
  shallowRef,
} from "vue";
import { AgGridVue } from "ag-grid-vue3";
import {
  ColDef,
  ColGroupDef,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ModuleRegistry,
  Theme,
  themeQuartz,
} from "ag-grid-community";
import { AllEnterpriseModule } from "ag-grid-enterprise";
import { IOlympicData } from "./interfaces";
ModuleRegistry.registerModules([AllEnterpriseModule]);

const myTheme = themeQuartz.withParams({
  headerColumnBorder: { color: "purple" },
  headerColumnBorderHeight: "80%",
  headerColumnResizeHandleColor: "orange",
  headerColumnResizeHandleHeight: "25%",
  headerColumnResizeHandleWidth: "5px",
});

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
    const theme = ref<Theme | "legacy">(myTheme);
    const columnDefs = ref<(ColDef | ColGroupDef)[]>([
      {
        headerName: "Group 1",
        children: [
          { field: "athlete", minWidth: 170, resizable: true },
          { field: "age", resizable: true },
        ],
        resizable: true,
      },
      {
        headerName: "Group 2",
        children: [
          { field: "country" },
          { field: "year" },
          { field: "date" },
          { field: "sport" },
          { field: "gold" },
          { field: "silver" },
          { field: "bronze" },
          { field: "total" },
        ],
      },
    ]);
    const defaultColDef = ref<ColDef>({
      editable: true,
      filter: true,
      resizable: false,
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
