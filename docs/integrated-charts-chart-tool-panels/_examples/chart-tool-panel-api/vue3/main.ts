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
  ChartCreatedEvent,
  ChartToolPanelName,
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  FirstDataRenderedEvent,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ModuleRegistry,
  ValidationModule,
  createGrid,
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

let chartId: string | undefined;

const VueExample = defineComponent({
  template: `
        <div style="height: 100%">
                <div class="wrapper">
      <div id="buttons">
        <button v-on:click="openChartToolPanel(undefined)">Open Chart Tool Panel</button>
        <button v-on:click="openChartToolPanel('format')">Open Chart Tool Panel Customize tab</button>
        <button v-on:click="closeChartToolPanel()">Close Chart Tool Panel</button>
      </div>
      <div id="contents">
        <ag-grid-vue
          style="width: 100%; height: 100%;"
          @grid-ready="onGridReady"
          :columnDefs="columnDefs"
          :defaultColDef="defaultColDef"
          :enableCharts="true"
          :cellSelection="true"
          :popupParent="popupParent"
          :rowData="rowData"
          @first-data-rendered="onFirstDataRendered"
          @chart-created="onChartCreated"></ag-grid-vue>
          <div id="myChart" class="my-chart"></div>
        </div>
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
      flex: 1,
      minWidth: 100,
    });
    const popupParent = ref<HTMLElement | null>(document.body);
    const rowData = ref<any[]>(null);

    function onFirstDataRendered(params: FirstDataRenderedEvent) {
      params.api.createRangeChart({
        chartContainer: document.querySelector("#myChart") as HTMLElement,
        cellRange: {
          columns: ["country", "sugar", "fat", "weight"],
        },
        chartType: "groupedColumn",
      });
    }
    function onChartCreated(event: ChartCreatedEvent) {
      chartId = event.chartId;
    }
    function openChartToolPanel(panel?: ChartToolPanelName) {
      if (!chartId || !gridApi.value) return;
      gridApi.value.openChartToolPanel({
        chartId,
        panel,
      });
    }
    function closeChartToolPanel() {
      if (!chartId || !gridApi.value) return;
      gridApi.value.closeChartToolPanel({ chartId });
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
      rowData,
      onGridReady,
      onFirstDataRendered,
      onChartCreated,
      openChartToolPanel,
      closeChartToolPanel,
    };
  },
});

createApp(VueExample).mount("#app");
