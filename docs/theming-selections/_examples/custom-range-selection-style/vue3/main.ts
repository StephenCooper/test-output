import {
  createApp,
  defineComponent,
  onBeforeMount,
  ref,
  shallowRef,
} from "vue";
import { AgGridVue } from "ag-grid-vue3";
import {
  AllCommunityModule,
  CellSelectionOptions,
  ColDef,
  ColGroupDef,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ModuleRegistry,
  Theme,
  createGrid,
  themeQuartz,
} from "ag-grid-community";
import { AllEnterpriseModule } from "ag-grid-enterprise";
import { IOlympicData } from "./interfaces";
ModuleRegistry.registerModules([AllCommunityModule, AllEnterpriseModule]);

const myTheme = themeQuartz.withParams({
  // color and style of border around selection
  rangeSelectionBorderColor: "rgb(193, 0, 97)",
  rangeSelectionBorderStyle: "dashed",
  // background color of selection - you can use a semi-transparent color
  // and it wil overlay on top of the existing cells
  rangeSelectionBackgroundColor: "rgb(255, 0, 128, 0.1)",
  // color used to indicate that data has been copied form the cell range
  rangeSelectionHighlightColor: "rgb(60, 188, 0, 0.3)",
});

const VueExample = defineComponent({
  template: `
        <div style="height: 100%">
                <ag-grid-vue
      style="width: 100%; height: 100%;"
      @grid-ready="onGridReady"
      :theme="theme"
      :columnDefs="columnDefs"
      :defaultColDef="defaultColDef"
      :cellSelection="true"
      :rowData="rowData"></ag-grid-vue>
        </div>
    `,
  components: {
    "ag-grid-vue": AgGridVue,
  },
  setup(props) {
    const gridApi = shallowRef<GridApi<IOlympicData> | null>(null);
    const theme = ref<Theme | "legacy">(myTheme);
    const columnDefs = ref<ColDef[]>([
      { field: "athlete", minWidth: 150 },
      { field: "age", maxWidth: 90 },
      { field: "country", minWidth: 150 },
      { field: "year", maxWidth: 90 },
      { field: "date", minWidth: 150 },
      { field: "sport", minWidth: 150 },
      { field: "gold" },
      { field: "silver" },
      { field: "bronze" },
      { field: "total" },
    ]);
    const defaultColDef = ref<ColDef>({
      flex: 1,
      minWidth: 100,
    });
    const rowData = ref<IOlympicData[]>(null);

    const onGridReady = (params: GridReadyEvent) => {
      gridApi.value = params.api;

      const updateData = (data) => {
        rowData.value = data;
        params.api.addCellRange({
          rowStartIndex: 1,
          rowEndIndex: 5,
          columns: ["age", "country", "year", "date"],
        });
      };

      fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
        .then((resp) => resp.json())
        .then((data) => updateData(data));
    };

    return {
      gridApi,
      theme,
      columnDefs,
      defaultColDef,
      rowData,
      onGridReady,
    };
  },
});

createApp(VueExample).mount("#app");
