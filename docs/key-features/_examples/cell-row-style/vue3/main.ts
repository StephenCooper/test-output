import {
  createApp,
  defineComponent,
  onBeforeMount,
  ref,
  shallowRef,
} from "vue";
import { AgGridVue } from "ag-grid-vue3";
import "./styles.css";
import {
  AllCommunityModule,
  CellClassRules,
  ColDef,
  ColGroupDef,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ModuleRegistry,
  RowClassRules,
  RowSelectionOptions,
} from "ag-grid-community";
ModuleRegistry.registerModules([AllCommunityModule]);

const ragCellClassRules: CellClassRules = {
  // apply green to electric cars
  "rag-green": (params) => params.value === true,
};

const VueExample = defineComponent({
  template: `
        <div style="height: 100%">
                <ag-grid-vue
      style="width: 100%; height: 100%;"
      @grid-ready="onGridReady"
      :rowData="rowData"
      :columnDefs="columnDefs"
      :defaultColDef="defaultColDef"
      :rowClassRules="rowClassRules"
      :rowSelection="rowSelection"></ag-grid-vue>
        </div>
    `,
  components: {
    "ag-grid-vue": AgGridVue,
  },
  setup(props) {
    const gridApi = shallowRef<GridApi | null>(null);
    const rowData = ref<any[] | null>([
      { make: "Tesla", model: "Model Y", price: 64950, electric: true },
      { make: "Ford", model: "F-Series", price: 33850, electric: false },
      { make: "Toyota", model: "Corolla", price: 29600, electric: false },
      { make: "Mercedes", model: "EQA", price: 48890, electric: true },
      { make: "Fiat", model: "500", price: 15774, electric: false },
      { make: "Nissan", model: "Juke", price: 20675, electric: false },
      { make: "Vauxhall", model: "Corsa", price: 18460, electric: false },
      { make: "Volvo", model: "EX30", price: 33795, electric: true },
      { make: "Mercedes", model: "Maybach", price: 175720, electric: false },
      { make: "Vauxhall", model: "Astra", price: 25795, electric: false },
      { make: "Fiat", model: "Panda", price: 13724, electric: false },
      { make: "Jaguar", model: "I-PACE", price: 69425, electric: true },
    ]);
    const columnDefs = ref<ColDef[]>([
      {
        field: "make",
      },
      { field: "model" },
      { field: "price", filter: "agNumberColumnFilter" },
      {
        field: "electric",
        cellClassRules: ragCellClassRules,
      },
    ]);
    const defaultColDef = ref<ColDef>({
      filter: "agTextColumnFilter",
      floatingFilter: true,
      flex: 1,
    });
    const rowClassRules = ref<RowClassRules>({
      // apply red to Ford cars
      "rag-red": (params) => params.data.make === "Ford",
    });
    const rowSelection = ref<RowSelectionOptions | "single" | "multiple">({
      mode: "multiRow",
      headerCheckbox: false,
    });

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
      rowData,
      columnDefs,
      defaultColDef,
      rowClassRules,
      rowSelection,
      onGridReady,
    };
  },
});

createApp(VueExample).mount("#app");
