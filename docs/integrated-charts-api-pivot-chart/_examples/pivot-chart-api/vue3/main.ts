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
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  FirstDataRenderedEvent,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ModuleRegistry,
  NumberEditorModule,
  NumberFilterModule,
  RowApiModule,
  TextEditorModule,
  TextFilterModule,
  ValidationModule,
} from "ag-grid-community";
import {
  ColumnMenuModule,
  ContextMenuModule,
  IntegratedChartsModule,
  PivotModule,
} from "ag-grid-enterprise";
ModuleRegistry.registerModules([
  NumberEditorModule,
  TextEditorModule,
  TextFilterModule,
  NumberFilterModule,
  RowApiModule,
  ClientSideRowModelModule,
  IntegratedChartsModule.with(AgChartsEnterpriseModule),
  ColumnMenuModule,
  ContextMenuModule,
  PivotModule,
  ValidationModule /* Development Only */,
]);

const VueExample = defineComponent({
  template: `
        <div style="height: 100%">
                <div id="container">
      <ag-grid-vue
        id="myGrid"
        style="width: 100%; height: 100%;"
        @grid-ready="onGridReady"
        :columnDefs="columnDefs"
        :defaultColDef="defaultColDef"
        :autoGroupColumnDef="autoGroupColumnDef"
        :pivotMode="true"
        :popupParent="popupParent"
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
      { field: "country", pivot: true },
      { field: "year", rowGroup: true },
      { field: "sport", rowGroup: true },
      { field: "total", aggFunc: "sum" },
      { field: "gold", aggFunc: "sum" },
    ]);
    const defaultColDef = ref<ColDef>({
      editable: true,
      flex: 1,
      minWidth: 150,
      filter: true,
    });
    const autoGroupColumnDef = ref<ColDef>({
      minWidth: 150,
    });
    const popupParent = ref<HTMLElement | null>(document.body);
    const rowData = ref<any[]>(null);

    function onFirstDataRendered(params: FirstDataRenderedEvent) {
      params.api.createPivotChart({
        chartType: "groupedColumn",
        chartContainer: document.querySelector("#myChart") as HTMLElement,
        chartThemeOverrides: {
          common: {
            navigator: {
              enabled: true,
              height: 10,
            },
          },
        },
      });
      // expand one row for demonstration purposes
      setTimeout(
        () => params.api.getDisplayedRowAtIndex(2)!.setExpanded(true),
        0,
      );
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

      fetch("https://www.ag-grid.com/example-assets/wide-spread-of-sports.json")
        .then((resp) => resp.json())
        .then((data) => updateData(data));
    };

    return {
      gridApi,
      columnDefs,
      defaultColDef,
      autoGroupColumnDef,
      popupParent,
      rowData,
      onGridReady,
      onFirstDataRendered,
    };
  },
});

createApp(VueExample).mount("#app");
