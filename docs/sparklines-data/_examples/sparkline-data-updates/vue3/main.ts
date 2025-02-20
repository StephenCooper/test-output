import {
  createApp,
  defineComponent,
  onBeforeMount,
  ref,
  shallowRef,
} from "vue";
import { AgGridVue } from "ag-grid-vue3";
import { AgChartsCommunityModule } from "ag-charts-community";
import {
  ClientSideRowModelApiModule,
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
  ClientSideRowModelApiModule,
  ClientSideRowModelModule,
  SparklinesModule.with(AgChartsCommunityModule),
  ValidationModule /* Development Only */,
]);

let intervalId: any;

const VueExample = defineComponent({
  template: `
        <div style="height: 100%">
                <div style="height: 100%; display: flex; flex-direction: column">
      <div style="margin-bottom: 4px">
        <button v-on:click="start()">► Start</button>
        <button v-on:click="stop()">■ Stop</button>
      </div>
      <div style="flex-grow: 1">
        <ag-grid-vue
          style="width: 100%; height: 100%;"
          @grid-ready="onGridReady"
          :columnDefs="columnDefs"
          :defaultColDef="defaultColDef"
          :rowData="rowData"
          :rowHeight="rowHeight"></ag-grid-vue>
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
      { field: "symbol", maxWidth: 120 },
      { field: "name", minWidth: 250 },
      {
        field: "change",
        cellRenderer: "agSparklineCellRenderer",
      },
      {
        field: "volume",
        maxWidth: 140,
      },
    ]);
    const defaultColDef = ref<ColDef>({
      flex: 1,
      minWidth: 100,
    });
    const rowData = ref<any[] | null>(getData());
    const rowHeight = ref(50);

    function start() {
      if (intervalId) {
        return;
      }
      const updateData = () => {
        const itemsToUpdate: any[] = [];
        gridApi.value!.forEachNodeAfterFilterAndSort(function (rowNode) {
          const data = rowNode.data;
          if (!data) {
            return;
          }
          const n = data.change.length;
          const v =
            Math.random() > 0.5
              ? Number(Math.random())
              : -Number(Math.random());
          data.change = [...data.change.slice(1, n), v];
          itemsToUpdate.push(data);
        });
        gridApi.value!.applyTransaction({ update: itemsToUpdate });
      };
      intervalId = setInterval(updateData, 300);
    }
    function stop() {
      if (intervalId === undefined) {
        return;
      }
      clearInterval(intervalId);
      intervalId = undefined;
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
    };

    return {
      gridApi,
      columnDefs,
      defaultColDef,
      rowData,
      rowHeight,
      onGridReady,
      start,
      stop,
    };
  },
});

createApp(VueExample).mount("#app");
