import {
  createApp,
  defineComponent,
  onBeforeMount,
  ref,
  shallowRef,
} from "vue";
import { AgGridVue } from "ag-grid-vue3";
import {
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ISetFilterParams,
  ModuleRegistry,
  NumberFilterModule,
  ValidationModule,
} from "ag-grid-community";
import {
  ColumnMenuModule,
  ColumnsToolPanelModule,
  ContextMenuModule,
  SetFilterModule,
} from "ag-grid-enterprise";
import { IOlympicData } from "./interfaces";
ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  ColumnsToolPanelModule,
  ColumnMenuModule,
  ContextMenuModule,
  SetFilterModule,
  NumberFilterModule,
  ValidationModule /* Development Only */,
]);

function replaceAccents(value: string) {
  return value
    .replace(new RegExp("[àáâãäå]", "g"), "a")
    .replace(new RegExp("æ", "g"), "ae")
    .replace(new RegExp("ç", "g"), "c")
    .replace(new RegExp("[èéêë]", "g"), "e")
    .replace(new RegExp("[ìíîï]", "g"), "i")
    .replace(new RegExp("ñ", "g"), "n")
    .replace(new RegExp("[òóôõøö]", "g"), "o")
    .replace(new RegExp("œ", "g"), "oe")
    .replace(new RegExp("[ùúûü]", "g"), "u")
    .replace(new RegExp("[ýÿ]", "g"), "y")
    .replace(new RegExp("\\W", "g"), "");
}

const filterParams: ISetFilterParams = {
  textFormatter: replaceAccents,
};

const VueExample = defineComponent({
  template: `
        <div style="height: 100%">
                <ag-grid-vue
      style="width: 100%; height: 100%;"
      @grid-ready="onGridReady"
      :columnDefs="columnDefs"
      :defaultColDef="defaultColDef"
      :rowData="rowData"></ag-grid-vue>
        </div>
    `,
  components: {
    "ag-grid-vue": AgGridVue,
  },
  setup(props) {
    const gridApi = shallowRef<GridApi<IOlympicData> | null>(null);
    const columnDefs = ref<ColDef[]>([
      // set filter
      {
        field: "athlete",
        filter: "agSetColumnFilter",
        filterParams: filterParams,
      },
      // number filters
      { field: "gold", filter: "agNumberColumnFilter" },
      { field: "silver", filter: "agNumberColumnFilter" },
      { field: "bronze", filter: "agNumberColumnFilter" },
    ]);
    const defaultColDef = ref<ColDef>({
      flex: 1,
      minWidth: 200,
      floatingFilter: true,
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
      defaultColDef,
      rowData,
      onGridReady,
    };
  },
});

createApp(VueExample).mount("#app");
