import {
  createApp,
  defineComponent,
  onBeforeMount,
  ref,
  shallowRef,
} from "vue";
import { AgGridVue } from "ag-grid-vue3";
import {
  AgChartsCommunityModule,
  AgSparklineOptions,
} from "ag-charts-community";
import {
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ModuleRegistry,
  ValidationModule,
} from "ag-grid-community";
import { SparklinesModule } from "ag-grid-enterprise";
import { getData } from "./data";
ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  SparklinesModule.with(AgChartsCommunityModule),
  ValidationModule /* Development Only */,
]);

const palette = {
  blue: "rgb(20,94,140)",
  lightBlue: "rgb(182,219,242)",
  green: "rgb(63,141,119)",
  lightGreen: "rgba(75,168,142, 0.2)",
};

function barItemStyler(params: any) {
  const { yValue, highlighted } = params;
  if (highlighted) {
    return;
  }
  return { fill: yValue <= 50 ? palette.lightBlue : palette.blue };
}

function lineItemStyler(params: any) {
  const { first, last, highlighted } = params;
  const color = highlighted
    ? palette.blue
    : last
      ? palette.lightBlue
      : palette.green;
  return {
    size: highlighted || first || last ? 5 : 0,
    fill: color,
    stroke: color,
  };
}

function columnItemStyler(params: any) {
  const { yValue, highlighted } = params;
  if (highlighted) {
    return;
  }
  return { fill: yValue < 0 ? palette.lightBlue : palette.blue };
}

function areaItemStyler(params: any) {
  const { min, highlighted } = params;
  return {
    size: min || highlighted ? 5 : 0,
    fill: palette.green,
    stroke: palette.green,
  };
}

const VueExample = defineComponent({
  template: `
        <div style="height: 100%">
                <ag-grid-vue
      style="width: 100%; height: 100%;"
      @grid-ready="onGridReady"
      :rowHeight="rowHeight"
      :columnDefs="columnDefs"
      :defaultColDef="defaultColDef"
      :rowData="rowData"></ag-grid-vue>
        </div>
    `,
  components: {
    "ag-grid-vue": AgGridVue,
  },
  setup(props) {
    const gridApi = shallowRef<GridApi | null>(null);
    const rowHeight = ref(70);
    const columnDefs = ref<ColDef[]>([
      {
        field: "bar",
        headerName: "Bar Sparkline",
        minWidth: 100,
        cellRenderer: "agSparklineCellRenderer",
        cellRendererParams: {
          sparklineOptions: {
            type: "bar",
            direction: "horizontal",
            min: 0,
            max: 100,
            label: {
              enabled: true,
              color: "#5577CC",
              placement: "outside-end",
              formatter: function (params) {
                return `${params.value}%`;
              },
              fontSize: 8,
              fontWeight: "bold",
              fontFamily: "Arial, Helvetica, sans-serif",
            },
            padding: {
              top: 15,
              bottom: 15,
            },
            itemStyler: barItemStyler,
          } as AgSparklineOptions,
        },
      },
      {
        field: "line",
        headerName: "Line Sparkline",
        minWidth: 100,
        cellRenderer: "agSparklineCellRenderer",
        cellRendererParams: {
          sparklineOptions: {
            type: "line",
            stroke: "rgb(63,141,119)",
            padding: {
              top: 10,
              bottom: 10,
            },
            marker: {
              enabled: true,
              itemStyler: lineItemStyler,
            },
          } as AgSparklineOptions,
        },
      },
      {
        field: "column",
        headerName: "Column Sparkline",
        minWidth: 100,
        cellRenderer: "agSparklineCellRenderer",
        cellRendererParams: {
          sparklineOptions: {
            type: "bar",
            direction: "vertical",
            label: {
              color: "#5577CC",
              enabled: true,
              placement: "outside-end",
              fontSize: 8,
              fontFamily: "Arial, Helvetica, sans-serif",
            },
            padding: {
              top: 15,
              bottom: 15,
            },
            itemStyler: columnItemStyler,
          } as AgSparklineOptions,
        },
      },
      {
        field: "area",
        headerName: "Area Sparkline",
        minWidth: 100,
        cellRenderer: "agSparklineCellRenderer",
        cellRendererParams: {
          sparklineOptions: {
            type: "area",
            fill: "rgba(75,168,142, 0.2)",
            stroke: "rgb(63,141,119)",
            padding: {
              top: 10,
              bottom: 10,
            },
            marker: {
              enabled: true,
              itemStyler: areaItemStyler,
            },
          } as AgSparklineOptions,
        },
      },
    ]);
    const defaultColDef = ref<ColDef>({
      flex: 1,
      minWidth: 100,
    });
    const rowData = ref<any[] | null>(getData());

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
    };

    return {
      gridApi,
      rowHeight,
      columnDefs,
      defaultColDef,
      rowData,
      onGridReady,
    };
  },
});

createApp(VueExample).mount("#app");
