import {
  createApp,
  defineComponent,
  onBeforeMount,
  ref,
  shallowRef,
} from "vue";
import { AgGridVue } from "ag-grid-vue3";
import "./styles.css";
import { AgChartsEnterpriseModule } from "ag-charts-enterprise";
import {
  CellSelectionOptions,
  ChartModel,
  ChartRef,
  ChartRefParams,
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  FirstDataRenderedEvent,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ModuleRegistry,
  NumberEditorModule,
  TextEditorModule,
  TextFilterModule,
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
  TextEditorModule,
  TextFilterModule,
  NumberEditorModule,
  ClientSideRowModelModule,
  IntegratedChartsModule.with(AgChartsEnterpriseModule),
  ColumnMenuModule,
  ContextMenuModule,
  RowGroupingModule,
  ValidationModule /* Development Only */,
]);

let chartModel: ChartModel | undefined;

let currentChartRef: ChartRef | undefined;

const VueExample = defineComponent({
  template: `
        <div style="height: 100%">
                <div class="wrapper">
      <div id="buttons">
        <button v-on:click="saveChart()">Save chart</button>
        <button v-on:click="clearChart()">Clear chart</button>
        <button v-on:click="restoreChart()">Restore chart</button>
      </div>
      <ag-grid-vue
        id="myGrid"
        style="width: 100%; height: 100%;"
        @grid-ready="onGridReady"
        :columnDefs="columnDefs"
        :defaultColDef="defaultColDef"
        :cellSelection="true"
        :popupParent="popupParent"
        :enableCharts="true"
        :createChartContainer="createChartContainer"
        :rowData="rowData"
        @first-data-rendered="onFirstDataRendered"></ag-grid-vue>
        <div id="myChart" class="my-chart"></div>
      </div>
        </div>
    `,
  components: {
    "ag-grid-vue": AgGridVue,
  },
  setup(props) {
    const gridApi = shallowRef<GridApi | null>(null);
    const columnDefs = ref<ColDef[]>([
      { field: "country", chartDataType: "category" },
      { field: "sugar", chartDataType: "series" },
      { field: "fat", chartDataType: "series" },
      { field: "weight", chartDataType: "series" },
    ]);
    const defaultColDef = ref<ColDef>({
      editable: true,
      flex: 1,
      minWidth: 100,
      filter: true,
    });
    const popupParent = ref<HTMLElement | null>(document.body);
    const rowData = ref<any[]>(null);

    function onFirstDataRendered(params: FirstDataRenderedEvent) {
      currentChartRef = params.api.createRangeChart({
        chartContainer: document.querySelector("#myChart") as any,
        cellRange: {
          columns: ["country", "sugar", "fat", "weight"],
          rowStartIndex: 0,
          rowEndIndex: 2,
        },
        chartType: "groupedColumn",
      });
    }
    function saveChart() {
      const chartModels = gridApi.value!.getChartModels() || [];
      if (chartModels.length > 0) {
        chartModel = chartModels[0];
      }
    }
    function clearChart() {
      if (currentChartRef) {
        currentChartRef.destroyChart();
        currentChartRef = undefined;
      }
    }
    function restoreChart() {
      if (!chartModel) return;
      currentChartRef = gridApi.value!.restoreChart(chartModel)!;
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
    function createChartContainer(chartRef: ChartRef) {
      if (currentChartRef) {
        currentChartRef.destroyChart();
      }
      const eChart = chartRef.chartElement;
      const eParent = document.querySelector<HTMLElement>("#myChart")!;
      eParent.appendChild(eChart);
      currentChartRef = chartRef;
    }

    return {
      gridApi,
      columnDefs,
      defaultColDef,
      popupParent,
      createChartContainer,
      rowData,
      onGridReady,
      onFirstDataRendered,
      saveChart,
      clearChart,
      restoreChart,
    };
  },
});

createApp(VueExample).mount("#app");
