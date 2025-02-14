import {
  createApp,
  defineComponent,
  onBeforeMount,
  ref,
  shallowRef,
} from "vue";
import { AgGridVue } from "ag-grid-vue3";
import { AgChartsEnterpriseModule } from "ag-charts-enterprise";
import {
  CellSelectionOptions,
  ChartToolPanelsDef,
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  FirstDataRenderedEvent,
  GetChartToolbarItems,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ModuleRegistry,
  NumberEditorModule,
  NumberFilterModule,
  TextEditorModule,
  TextFilterModule,
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
  NumberEditorModule,
  TextEditorModule,
  TextFilterModule,
  NumberFilterModule,
  ClientSideRowModelModule,
  IntegratedChartsModule.with(AgChartsEnterpriseModule),
  ColumnMenuModule,
  ContextMenuModule,
  RowGroupingModule,
  ValidationModule /* Development Only */,
]);

function createGroupedBarChart(
  params: FirstDataRenderedEvent,
  selector: string,
  columns: string[],
) {
  params.api.createRangeChart({
    chartContainer: document.querySelector(selector) as HTMLElement,
    cellRange: {
      rowStartIndex: 0,
      rowEndIndex: 4,
      columns,
    },
    suppressChartRanges: true,
    chartType: "groupedBar",
  });
}

function createPieChart(
  params: FirstDataRenderedEvent,
  selector: string,
  columns: string[],
) {
  params.api.createRangeChart({
    chartContainer: document.querySelector(selector) as HTMLElement,
    cellRange: { columns },
    suppressChartRanges: true,
    chartType: "pie",
    aggFunc: "sum",
    chartThemeOverrides: {
      common: {
        padding: {
          top: 20,
          left: 10,
          bottom: 30,
          right: 10,
        },
        legend: {
          position: "right",
        },
      },
    },
  });
}

const VueExample = defineComponent({
  template: `
        <div style="height: 100%">
                <div style="display: flex; flex-direction: column; height: 100%; width: 100%; overflow: hidden">
      <ag-grid-vue
        style="width: 100%; height: 30%;"
        @grid-ready="onGridReady"
        :columnDefs="columnDefs"
        :defaultColDef="defaultColDef"
        :cellSelection="true"
        :enableCharts="true"
        :chartToolPanelsDef="chartToolPanelsDef"
        :popupParent="popupParent"
        :getChartToolbarItems="getChartToolbarItems"
        :rowData="rowData"
        @first-data-rendered="onFirstDataRendered"></ag-grid-vue>
        <div id="chart1" class="my-chart" style="flex: 1 1 auto; height: 30%"></div>
        <div style="display: flex; flex: 1 1 auto; height: 30%; gap: 8px">
          <div id="chart2" class="my-chart" style="flex: 1 1 auto; width: 50%"></div>
          <div id="chart3" class="my-chart" style="flex: 1 1 auto; width: 50%"></div>
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
      { field: "country", width: 150, chartDataType: "category" },
      { field: "group", chartDataType: "category" },
      { field: "gold", chartDataType: "series" },
      { field: "silver", chartDataType: "series" },
      { field: "bronze", chartDataType: "series" },
    ]);
    const defaultColDef = ref<ColDef>({
      editable: true,
      flex: 1,
      minWidth: 100,
      filter: true,
    });
    const chartToolPanelsDef = ref<ChartToolPanelsDef>({ panels: [] });
    const popupParent = ref<HTMLElement | null>(document.body);
    const getChartToolbarItems = ref<GetChartToolbarItems>(() => []);
    const rowData = ref<any[]>(null);

    function onFirstDataRendered(event: FirstDataRenderedEvent) {
      createGroupedBarChart(event, "#chart1", ["country", "gold", "silver"]);
      createPieChart(event, "#chart2", ["group", "gold"]);
      createPieChart(event, "#chart3", ["group", "silver"]);
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
      chartToolPanelsDef,
      popupParent,
      getChartToolbarItems,
      rowData,
      onGridReady,
      onFirstDataRendered,
    };
  },
});

createApp(VueExample).mount("#app");
