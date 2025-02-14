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
  AgChartTheme,
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
} from "ag-grid-community";
import {
  ColumnMenuModule,
  ContextMenuModule,
  IntegratedChartsModule,
  RowGroupingModule,
} from "ag-grid-enterprise";
import { deepMerge, getData } from "./data";
ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  IntegratedChartsModule.with(AgChartsEnterpriseModule),
  ColumnMenuModule,
  ContextMenuModule,
  RowGroupingModule,
  ValidationModule /* Development Only */,
]);

const commonThemeProperties = {
  overrides: {
    common: {
      legend: {
        position: "top",
        spacing: 25,
        item: {
          label: {
            fontStyle: "italic",
            fontWeight: "bold",
            fontSize: 18,
            fontFamily: "Palatino, serif",
          },
          marker: {
            shape: "circle",
            size: 14,
            padding: 8,
            strokeWidth: 2,
          },
        },
      },
    },
    bar: {
      axes: {
        number: {
          line: {
            width: 4,
          },
        },
        category: {
          line: {
            width: 2,
          },
          rotation: 0,
        },
      },
    },
  },
};

const myCustomThemeLight = deepMerge(commonThemeProperties, {
  palette: {
    fills: ["#42a5f5", "#ffa726", "#81c784"],
    strokes: ["#000000", "#424242"],
  },
  overrides: {
    common: {
      background: {
        fill: "#f4f4f4",
      },
      legend: {
        item: {
          label: {
            color: "#333333",
          },
        },
      },
    },
    bar: {
      axes: {
        number: {
          bottom: {
            line: {
              stroke: "#424242",
            },
            label: {
              color: "#555555",
              fontStyle: "italic",
              fontWeight: "bold",
              fontSize: 12,
              spacing: 5,
            },
          },
        },
        category: {
          left: {
            line: {
              stroke: "#424242",
            },
            label: {
              color: "#555555",
              fontStyle: "italic",
              fontWeight: "bold",
              fontSize: 14,
              spacing: 8,
            },
          },
        },
      },
    },
  },
});

const myCustomThemeDark = deepMerge(commonThemeProperties, {
  palette: {
    fills: ["#42a5f5", "#ffa726", "#81c784"],
    strokes: ["#ffffff", "#B0BEC5"],
  },
  overrides: {
    common: {
      background: {
        fill: "#15181c",
      },
      legend: {
        item: {
          label: {
            color: "#ECEFF1",
          },
        },
      },
    },
    bar: {
      axes: {
        number: {
          bottom: {
            line: {
              stroke: "#757575",
            },
            label: {
              color: "#B0BEC5",
              fontStyle: "italic",
              fontWeight: "bold",
              fontSize: 12,
              spacing: 5,
            },
          },
        },
        category: {
          left: {
            line: {
              stroke: "#757575",
            },
            label: {
              color: "#B0BEC5",
              fontStyle: "italic",
              fontWeight: "bold",
              fontSize: 14,
              spacing: 8,
            },
          },
        },
      },
    },
  },
});

const VueExample = defineComponent({
  template: `
        <div style="height: 100%">
                <ag-grid-vue
      style="width: 100%; height: 100%;"
      @grid-ready="onGridReady"
      :columnDefs="columnDefs"
      :defaultColDef="defaultColDef"
      :popupParent="popupParent"
      :cellSelection="true"
      :enableCharts="true"
      :chartThemes="chartThemes"
      :customChartThemes="customChartThemes"
      :rowData="rowData"
      @first-data-rendered="onFirstDataRendered"></ag-grid-vue>
        </div>
    `,
  components: {
    "ag-grid-vue": AgGridVue,
  },
  setup(props) {
    const gridApi = shallowRef<GridApi | null>(null);
    const columnDefs = ref<ColDef[]>([
      { field: "country", width: 150, chartDataType: "category" },
      { field: "gold", chartDataType: "series" },
      { field: "silver", chartDataType: "series" },
      { field: "bronze", chartDataType: "series" },
    ]);
    const defaultColDef = ref<ColDef>({
      flex: 1,
      minWidth: 100,
    });
    const popupParent = ref<HTMLElement | null>(document.body);
    const chartThemes = ref<string[]>([
      "my-custom-theme-light",
      "my-custom-theme-dark",
    ]);
    const customChartThemes = ref<{
      [name: string]: AgChartTheme;
    }>({
      "my-custom-theme-light": myCustomThemeLight,
      "my-custom-theme-dark": myCustomThemeDark,
    });
    const rowData = ref<any[]>(null);

    function onFirstDataRendered(params: FirstDataRenderedEvent) {
      params.api.createRangeChart({
        cellRange: {
          rowStartIndex: 0,
          rowEndIndex: 4,
          columns: ["country", "gold", "silver", "bronze"],
        },
        chartType: "groupedBar",
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
      chartThemes,
      customChartThemes,
      rowData,
      onGridReady,
      onFirstDataRendered,
    };
  },
});

createApp(VueExample).mount("#app");
