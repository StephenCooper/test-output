import {
  createApp,
  defineComponent,
  onBeforeMount,
  ref,
  shallowRef,
} from "vue";
import { AgGridVue } from "ag-grid-vue3";
import "./style.css";
import {
  ColDef,
  ColGroupDef,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ModuleRegistry,
  SideBarDef,
  Theme,
  createGrid,
  themeQuartz,
} from "ag-grid-community";
import { AllEnterpriseModule } from "ag-grid-enterprise";
import {} from "./style.css";
import { IOlympicData } from "./interfaces";
ModuleRegistry.registerModules([AllEnterpriseModule]);

const myTheme = themeQuartz.withParams({
  // the grid will load these fonts for you if loadThemeGoogleFonts=true
  fontFamily: { googleFont: "Delius" },
  headerFontFamily: { googleFont: "Sixtyfour Convergence" },
  cellFontFamily: { googleFont: "Turret Road" },
  // these fonts are awesome, so they should be large too
  fontSize: 20,
  headerFontSize: 25,
});

const VueExample = defineComponent({
  template: `
        <div style="height: 100%">
                <ag-grid-vue
      style="width: 100%; height: 100%;"
      class="ag-theme-quartz"
      @grid-ready="onGridReady"
      :columnDefs="columnDefs"
      :theme="theme"
      :loadThemeGoogleFonts="true"
      :defaultColDef="defaultColDef"
      :sideBar="true"
      :rowData="rowData"></ag-grid-vue>
        </div>
    `,
  components: {
    "ag-grid-vue": AgGridVue,
  },
  setup(props) {
    const gridApi = shallowRef<GridApi<IOlympicData> | null>(null);
    const columnDefs = ref<ColDef[]>([
      { field: "athlete", minWidth: 170 },
      { field: "age" },
      { field: "country" },
      { field: "year" },
      { field: "date" },
    ]);
    const theme = ref<Theme | "legacy">(myTheme);
    const defaultColDef = ref<ColDef>({
      editable: true,
      filter: true,
      enableRowGroup: true,
      enablePivot: true,
      enableValue: true,
    });
    const rowData = ref<IOlympicData[]>(null);

    const onGridReady = (params: GridReadyEvent) => {
      gridApi.value = params.api;

      const updateData = (data) => (rowData.value = data);

      fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
        .then((resp) => resp.json())
        .then((data) => updateData(data));
    };

    return {
      gridApi,
      columnDefs,
      theme,
      defaultColDef,
      rowData,
      onGridReady,
    };
  },
});

createApp(VueExample).mount("#app");
