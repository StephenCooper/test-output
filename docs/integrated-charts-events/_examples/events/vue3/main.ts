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
  ChartCreatedEvent,
  ChartDestroyedEvent,
  ChartOptionsChangedEvent,
  ChartRangeSelectionChangedEvent,
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
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

const VueExample = defineComponent({
  template: `
        <div style="height: 100%">
                <ag-grid-vue
      style="width: 100%; height: 100%;"
      @grid-ready="onGridReady"
      :columnDefs="columnDefs"
      :defaultColDef="defaultColDef"
      :cellSelection="true"
      :popupParent="popupParent"
      :enableCharts="true"
      :rowData="rowData"
      @chart-created="onChartCreated"
      @chart-range-selection-changed="onChartRangeSelectionChanged"
      @chart-options-changed="onChartOptionsChanged"
      @chart-destroyed="onChartDestroyed"></ag-grid-vue>
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
    const defaultColDef = ref<ColDef>({
      flex: 1,
    });
    const popupParent = ref<HTMLElement | null>(document.body);
    const rowData = ref<any[]>(null);

    function onChartCreated(event: ChartCreatedEvent) {
      console.log("Created chart with ID " + event.chartId, event);
    }
    function onChartRangeSelectionChanged(
      event: ChartRangeSelectionChangedEvent,
    ) {
      console.log(
        "Changed range selection of chart with ID " + event.chartId,
        event,
      );
    }
    function onChartOptionsChanged(event: ChartOptionsChangedEvent) {
      console.log("Changed options of chart with ID " + event.chartId, event);
    }
    function onChartDestroyed(event: ChartDestroyedEvent) {
      console.log("Destroyed chart with ID " + event.chartId, event);
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
      rowData,
      onGridReady,
      onChartCreated,
      onChartRangeSelectionChanged,
      onChartOptionsChanged,
      onChartDestroyed,
    };
  },
});

createApp(VueExample).mount("#app");
