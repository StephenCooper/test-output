import {
  createApp,
  defineComponent,
  onBeforeMount,
  ref,
  shallowRef,
} from "vue";
import { AgGridVue } from "ag-grid-vue3";
import "./style.css";
import { AgChartsEnterpriseModule } from "ag-charts-enterprise";
import {
  CellSelectionOptions,
  ChartRef,
  ChartToolPanelsDef,
  ChartType,
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  FirstDataRenderedEvent,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ModuleRegistry,
  ValidationModule,
} from "ag-grid-community";
import {
  ColumnMenuModule,
  ContextMenuModule,
  IntegratedChartsModule,
  RowGroupingModule,
} from "ag-grid-enterprise";
import { getData } from "./data";
ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  IntegratedChartsModule.with(AgChartsEnterpriseModule),
  ColumnMenuModule,
  ContextMenuModule,
  RowGroupingModule,
  ValidationModule /* Development Only */,
]);

let chartRef: ChartRef;

const VueExample = defineComponent({
  template: `
        <div style="height: 100%">
                <div class="wrapper">
      <div class="button-container">
        <button v-on:click="updateChart('groupedColumn')">Grouped Column</button>
        <button v-on:click="updateChart('stackedColumn')">Stacked Column</button>
        <button v-on:click="updateChart('normalizedColumn')">Normalized Column</button>
        <button v-on:click="updateChart('groupedBar')">Grouped Bar</button>
        <button v-on:click="updateChart('stackedBar')">Stacked Bar</button>
        <button v-on:click="updateChart('normalizedBar')">Normalized Bar</button>
      </div>
      <ag-grid-vue
        style="width: 100%; height: 100%;"
        @grid-ready="onGridReady"
        :columnDefs="columnDefs"
        :defaultColDef="defaultColDef"
        :popupParent="popupParent"
        :cellSelection="true"
        :enableCharts="true"
        :chartToolPanelsDef="chartToolPanelsDef"
        :rowData="rowData"
        @first-data-rendered="onFirstDataRendered"></ag-grid-vue>
        <div id="myChart"></div>
      </div>
        </div>
    `,
  components: {
    "ag-grid-vue": AgGridVue,
  },
  setup(props) {
    const gridApi = shallowRef<GridApi | null>(null);
    const columnDefs = ref<ColDef[]>([
      {
        field: "period",
        chartDataType: "category",
        headerName: "Financial Period",
        width: 150,
      },
      {
        field: "recurring",
        chartDataType: "series",
        headerName: "Recurring revenue",
      },
      {
        field: "individual",
        chartDataType: "series",
        headerName: "Individual sales",
      },
    ]);
    const defaultColDef = ref<ColDef>({
      flex: 1,
      minWidth: 100,
    });
    const popupParent = ref<HTMLElement | null>(document.body);
    const chartToolPanelsDef = ref<ChartToolPanelsDef>({
      defaultToolPanel: "settings",
    });
    const rowData = ref<any[]>(null);

    function onFirstDataRendered(params: FirstDataRenderedEvent) {
      chartRef = params.api.createRangeChart({
        chartContainer: document.querySelector("#myChart") as any,
        cellRange: {
          columns: ["period", "recurring", "individual"],
        },
        chartType: "groupedColumn",
      })!;
    }
    function updateChart(chartType: ChartType) {
      gridApi.value.updateChart({
        type: "rangeChartUpdate",
        chartId: `${chartRef.chartId}`,
        chartType: chartType,
      });
    }
    const onGridReady = (params: GridReadyEvent) => {
      /** DARK INTEGRATED START **/
      const isInitialModeDark =
        document.documentElement.dataset.agThemeMode?.includes("dark");

      const updateChartThemes = (isDark) => {
        const themes = [
          "ag-default",
          "ag-material",
          "ag-sheets",
          "ag-polychroma",
          "ag-vivid",
        ];
        const currentThemes = params.api.getGridOption("chartThemes");
        const customTheme =
          currentThemes &&
          currentThemes.some((theme) => theme.startsWith("my-custom-theme"));

        let modifiedThemes = customTheme
          ? isDark
            ? ["my-custom-theme-dark", "my-custom-theme-light"]
            : ["my-custom-theme-light", "my-custom-theme-dark"]
          : Array.from(
              new Set(themes.map((theme) => theme + (isDark ? "-dark" : ""))),
            );

        // updating the 'chartThemes' grid option will cause the chart to reactively update!
        params.api.setGridOption("chartThemes", modifiedThemes);
      };

      // update chart themes when example first loads
      let initialSet = false;
      const maxTries = 5;
      let tries = 0;
      const trySetInitial = (delay) => {
        if (params.api) {
          initialSet = true;
          updateChartThemes(isInitialModeDark);
        } else {
          if (tries < maxTries) {
            setTimeout(() => trySetInitial(), 250);
            tries++;
          }
        }
      };
      trySetInitial(0);

      const handleColorSchemeChange = (event) => {
        const { darkMode } = event.detail;
        updateChartThemes(darkMode);
      };

      // listen for user-triggered dark mode changes (not removing listener is fine here!)
      document.addEventListener("color-scheme-change", handleColorSchemeChange);
      /** DARK INTEGRATED END **/
      gridApi.value = params.api;

      getData().then((rowData) => params.api.setGridOption("rowData", rowData));
    };

    return {
      gridApi,
      columnDefs,
      defaultColDef,
      popupParent,
      chartToolPanelsDef,
      rowData,
      onGridReady,
      onFirstDataRendered,
      updateChart,
    };
  },
});

createApp(VueExample).mount("#app");
