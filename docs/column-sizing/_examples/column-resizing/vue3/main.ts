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
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  ColumnApiModule,
  ColumnAutoSizeModule,
  ColumnResizedEvent,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ModuleRegistry,
  SizeColumnsToContentStrategy,
  SizeColumnsToFitGridStrategy,
  SizeColumnsToFitProvidedWidthStrategy,
  ValidationModule,
} from "ag-grid-community";
import { IOlympicData } from "./interfaces";
ModuleRegistry.registerModules([
  ColumnApiModule,
  ColumnAutoSizeModule,
  ClientSideRowModelModule,
  ValidationModule /* Development Only */,
]);

const VueExample = defineComponent({
  template: `
        <div style="height: 100%">
                <div class="outer-div">
      <div class="button-bar">
        <button v-on:click="autoSizeAll(false)">Resize Columns to Fit Cell Contents</button>
      </div>
      <div class="grid-wrapper">
        <ag-grid-vue
          style="width: 100%; height: 100%;"
          @grid-ready="onGridReady"
          :columnDefs="columnDefs"
          :autoSizeStrategy="autoSizeStrategy"
          :rowData="rowData"
          @column-resized="onColumnResized"></ag-grid-vue>
        </div>
      </div>
        </div>
    `,
  components: {
    "ag-grid-vue": AgGridVue,
  },
  setup(props) {
    const gridApi = shallowRef<GridApi<IOlympicData> | null>(null);
    const columnDefs = ref<ColDef[]>([
      { field: "athlete", width: 150, suppressSizeToFit: true },
      {
        field: "age",
        headerName: "Age of Athlete",
        width: 90,
        minWidth: 50,
        maxWidth: 150,
      },
      { field: "country", width: 120 },
      { field: "year", width: 90 },
      { field: "date", width: 110 },
      { field: "sport", width: 110 },
      { field: "gold", width: 100 },
      { field: "silver", width: 100 },
      { field: "bronze", width: 100 },
      { field: "total", width: 100 },
    ]);
    const autoSizeStrategy = ref<
      | SizeColumnsToFitGridStrategy
      | SizeColumnsToFitProvidedWidthStrategy
      | SizeColumnsToContentStrategy
    >({
      type: "fitCellContents",
    });
    const rowData = ref<IOlympicData[]>(null);

    function onColumnResized(params: ColumnResizedEvent) {
      console.log(params);
    }
    function autoSizeAll(skipHeader: boolean) {
      const allColumnIds: string[] = [];
      gridApi.value!.getColumns()!.forEach((column) => {
        allColumnIds.push(column.getId());
      });
      gridApi.value!.autoSizeColumns(allColumnIds, skipHeader);
    }
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
      autoSizeStrategy,
      rowData,
      onGridReady,
      onColumnResized,
      autoSizeAll,
    };
  },
});

createApp(VueExample).mount("#app");
