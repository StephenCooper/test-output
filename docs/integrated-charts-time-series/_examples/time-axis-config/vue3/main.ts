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
  ChartToolPanelsDef,
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

function formatTime(date: Date | number) {
  return Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(new Date(date));
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
        :chartToolPanelsDef="chartToolPanelsDef"
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
      { field: "timestamp", chartDataType: "time" },
      { field: "cpuUsage" },
    ]);
    const defaultColDef = ref<ColDef>({ flex: 1 });
    const popupParent = ref<HTMLElement | null>(document.body);
    const chartThemeOverrides = ref<AgChartThemeOverrides>({
      area: {
        title: {
          enabled: true,
          text: "CPU Usage",
        },
        navigator: {
          enabled: true,
          height: 20,
          spacing: 25,
        },
        axes: {
          time: {
            label: {
              rotation: 315,
              format: "%H:%M",
            },
          },
          number: {
            label: {
              formatter: (params: any) => {
                // charts typings
                return params.value + "%";
              },
            },
          },
        },
        series: {
          tooltip: {
            renderer: ({ datum, xKey, yKey }) => {
              return {
                content: `${formatTime(datum[xKey])}: ${datum[yKey]}%`,
              };
            },
          },
        },
      },
    });
    const chartToolPanelsDef = ref<ChartToolPanelsDef>({
      panels: ["data", "format"],
    });
    const rowData = ref<any[]>(null);

    function onFirstDataRendered(params: FirstDataRenderedEvent) {
      params.api.createRangeChart({
        chartContainer: document.querySelector("#myChart") as HTMLElement,
        cellRange: {
          columns: ["timestamp", "cpuUsage"],
        },
        suppressChartRanges: true,
        chartType: "area",
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
      chartThemeOverrides,
      chartToolPanelsDef,
      rowData,
      onGridReady,
      onFirstDataRendered,
    };
  },
});

createApp(VueExample).mount("#app");
