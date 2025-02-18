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
  AgChartThemeOverrides,
  CellSelectionOptions,
  ChartCreatedEvent,
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  CreateRangeChartParams,
  FirstDataRenderedEvent,
  GetChartImageDataUrlParams,
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

let chartId: string | undefined;

const VueExample = defineComponent({
  template: `
        <div style="height: 100%">
                <div class="wrapper">
      <div id="buttons">
        <button v-on:click="downloadChartImage('image/png')">Download Chart Image (PNG)</button>
        <button v-on:click="downloadChart({ width: 800, height: 500 })">Download Chart Image (JPG 800x500)</button>
        <button v-on:click="openChartImage('image/jpeg')">Open Chart Image (JPG)</button>
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
        :chartThemeOverrides="chartThemeOverrides"
        :rowData="rowData"
        @first-data-rendered="onFirstDataRendered"
        @chart-created="onChartCreated"></ag-grid-vue>
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
    const chartThemeOverrides = ref<AgChartThemeOverrides>({
      bar: {
        axes: {
          category: {
            label: {
              rotation: 335,
            },
          },
        },
      },
    });
    const rowData = ref<any[]>(null);

    function onFirstDataRendered(params: FirstDataRenderedEvent) {
      const createRangeChartParams: CreateRangeChartParams = {
        cellRange: {
          columns: ["country", "sugar", "fat", "weight"],
        },
        chartType: "groupedColumn",
        chartContainer: document.querySelector("#myChart") as any,
      };
      params.api.createRangeChart(createRangeChartParams);
    }
    function onChartCreated(event: ChartCreatedEvent) {
      chartId = event.chartId;
    }
    function downloadChart(dimensions: { width: number; height: number }) {
      if (!chartId) return;
      gridApi.value!.downloadChart({
        fileName: "resizedImage",
        fileFormat: "image/jpeg",
        chartId,
        dimensions,
      });
    }
    function downloadChartImage(fileFormat: string) {
      if (!chartId) return;
      const params: GetChartImageDataUrlParams = { fileFormat, chartId };
      const imageDataURL = gridApi.value!.getChartImageDataURL(params);
      if (imageDataURL) {
        const a = document.createElement("a");
        a.href = imageDataURL;
        a.download = "image";
        a.style.display = "none";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
    }
    function openChartImage(fileFormat: string) {
      if (!chartId) return;
      const params: GetChartImageDataUrlParams = { fileFormat, chartId };
      const imageDataURL = gridApi.value!.getChartImageDataURL(params);
      if (imageDataURL) {
        const image = new Image();
        image.src = imageDataURL;
        const w = window.open("")!;
        w.document.write(image.outerHTML);
        w.document.close();
      }
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
      onChartCreated,
      downloadChart,
      downloadChartImage,
      openChartImage,
    };
  },
});

createApp(VueExample).mount("#app");
