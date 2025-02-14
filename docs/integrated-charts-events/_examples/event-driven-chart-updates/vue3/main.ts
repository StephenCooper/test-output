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
  AgChartThemeOverrides,
  CellSelectionOptions,
  ChartCreatedEvent,
  ChartOptionsChangedEvent,
  ChartRangeSelectionChangedEvent,
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  CreateRangeChartParams,
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
ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  IntegratedChartsModule.with(AgChartsEnterpriseModule),
  ColumnMenuModule,
  ContextMenuModule,
  RowGroupingModule,
  ValidationModule /* Development Only */,
]);

function updateTitle(api: GridApi, chartId: string) {
  const cellRange = api.getCellRanges()![1];
  if (!cellRange) return;
  const columnCount = cellRange.columns.length;
  const rowCount =
    cellRange.endRow!.rowIndex - cellRange.startRow!.rowIndex + 1;
  const subtitle = `Using series data from ${columnCount} column(s) and ${rowCount} row(s)`;
  api!.updateChart({
    type: "rangeChartUpdate",
    chartId: chartId,
    chartThemeOverrides: {
      common: {
        subtitle: { text: subtitle },
      },
    },
  });
}

const VueExample = defineComponent({
  template: `
        <div style="height: 100%">
                <div class="wrapper">
      <ag-grid-vue
        style="width: 100%; height: 100%;"
        class="my-grid"
        @grid-ready="onGridReady"
        :columnDefs="columnDefs"
        :defaultColDef="defaultColDef"
        :cellSelection="true"
        :popupParent="popupParent"
        :enableCharts="true"
        :chartThemeOverrides="chartThemeOverrides"
        :rowData="rowData"
        @first-data-rendered="onFirstDataRendered"
        @chart-created="onChartCreated"
        @chart-range-selection-changed="onChartRangeSelectionChanged"
        @chart-options-changed="onChartOptionsChanged"></ag-grid-vue>
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
      { field: "Month", width: 150, chartDataType: "category" },
      { field: "Sunshine (hours)", chartDataType: "series" },
      { field: "Rainfall (mm)", chartDataType: "series" },
    ]);
    const defaultColDef = ref<ColDef>({ flex: 1 });
    const popupParent = ref<HTMLElement | null>(document.body);
    const chartThemeOverrides = ref<AgChartThemeOverrides>({
      common: {
        title: { enabled: true, text: "Monthly Weather" },
        subtitle: { enabled: true },
        legend: { enabled: true },
      },
    });
    const rowData = ref<any[]>(null);

    function onFirstDataRendered(params: FirstDataRenderedEvent) {
      const createRangeChartParams: CreateRangeChartParams = {
        cellRange: {
          rowStartIndex: 0,
          rowEndIndex: 3,
          columns: ["Month", "Sunshine (hours)"],
        },
        chartType: "stackedColumn",
        chartContainer: document.querySelector("#myChart") as any,
      };
      params.api.createRangeChart(createRangeChartParams);
    }
    function onChartCreated(event: ChartCreatedEvent) {
      console.log("Created chart with ID " + event.chartId);
      updateTitle(gridApi.value!, event.chartId);
    }
    function onChartRangeSelectionChanged(
      event: ChartRangeSelectionChangedEvent,
    ) {
      console.log("Changed range selection of chart with ID " + event.chartId);
      updateTitle(gridApi.value!, event.chartId);
    }
    function onChartOptionsChanged(event: ChartOptionsChangedEvent) {
      console.log("Changed options of chart with ID " + event.chartId);
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

      const updateData = (data) => {
        rowData.value = data;
      };

      fetch("https://www.ag-grid.com/example-assets/weather-se-england.json")
        .then((resp) => resp.json())
        .then((data) => updateData(data));
    };

    return {
      gridApi,
      columnDefs,
      defaultColDef,
      popupParent,
      chartThemeOverrides,
      rowData,
      onGridReady,
      onFirstDataRendered,
      onChartCreated,
      onChartRangeSelectionChanged,
      onChartOptionsChanged,
    };
  },
});

createApp(VueExample).mount("#app");
