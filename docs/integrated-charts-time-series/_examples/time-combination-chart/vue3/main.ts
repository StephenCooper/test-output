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
  AgAxisCaptionFormatterParams,
  AgCartesianSeriesTooltipRendererParams,
  AgCrosshairLabelRendererParams,
} from "ag-charts-types";
import {
  AgChartThemeOverrides,
  CellSelectionOptions,
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  FirstDataRenderedEvent,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ModuleRegistry,
  ValidationModule,
  ValueParserParams,
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

function numberParser(params: ValueParserParams) {
  const value = params.newValue;
  if (value === null || value === undefined || value === "") {
    return null;
  }
  return parseFloat(value);
}

function chartTooltipRenderer({
  datum,
  xKey,
  yKey,
}: AgCartesianSeriesTooltipRendererParams) {
  return {
    content: `${formatDate(datum[xKey])}: ${datum[yKey]}`,
  };
}

function formatDate(date: Date | number) {
  return Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: undefined,
  }).format(new Date(date));
}

const VueExample = defineComponent({
  template: `
        <div style="height: 100%">
                <div class="wrapper">
      <ag-grid-vue
        style="width: 100%; height: 100%;"
        @grid-ready="onGridReady"
        :columnDefs="columnDefs"
        :defaultColDef="defaultColDef"
        :cellSelection="true"
        :popupParent="popupParent"
        :enableCharts="true"
        :chartThemeOverrides="chartThemeOverrides"
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
        field: "date",
        chartDataType: "time",
        valueFormatter: (params) => params.value.toISOString().substring(0, 10),
      },
      { field: "rain", chartDataType: "series", valueParser: numberParser },
      { field: "pressure", chartDataType: "series", valueParser: numberParser },
      { field: "temp", chartDataType: "series", valueParser: numberParser },
    ]);
    const defaultColDef = ref<ColDef>({ flex: 1 });
    const popupParent = ref<HTMLElement | null>(document.body);
    const chartThemeOverrides = ref<AgChartThemeOverrides>({
      common: {
        padding: {
          top: 45,
        },
        axes: {
          number: {
            title: {
              enabled: true,
              formatter: (params: AgAxisCaptionFormatterParams) => {
                return params.boundSeries.map((s) => s.name).join(" / ");
              },
            },
          },
          time: {
            crosshair: {
              label: {
                renderer: (params: AgCrosshairLabelRendererParams) => ({
                  text: formatDate(params.value),
                }),
              },
            },
          },
        },
      },
      bar: {
        series: {
          strokeWidth: 2,
          fillOpacity: 0.8,
          tooltip: {
            renderer: chartTooltipRenderer,
          },
        },
      },
      line: {
        series: {
          strokeWidth: 5,
          strokeOpacity: 0.8,
          tooltip: {
            renderer: chartTooltipRenderer,
          },
        },
      },
    });
    const rowData = ref<any[]>(null);

    function onFirstDataRendered(params: FirstDataRenderedEvent) {
      params.api.createRangeChart({
        chartContainer: document.querySelector("#myChart") as HTMLElement,
        cellRange: {
          columns: ["date", "rain", "pressure", "temp"],
        },
        suppressChartRanges: true,
        seriesChartTypes: [
          { colId: "rain", chartType: "groupedColumn", secondaryAxis: false },
          { colId: "pressure", chartType: "line", secondaryAxis: true },
          { colId: "temp", chartType: "line", secondaryAxis: true },
        ],
        chartType: "customCombo",
        aggFunc: "sum",
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
      rowData,
      onGridReady,
      onFirstDataRendered,
    };
  },
});

createApp(VueExample).mount("#app");
