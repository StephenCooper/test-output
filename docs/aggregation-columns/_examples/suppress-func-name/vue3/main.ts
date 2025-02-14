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
  GridApi,
  GridOptions,
  GridReadyEvent,
  ModuleRegistry,
  ValidationModule,
  createGrid,
} from "ag-grid-community";
import {
  ColumnMenuModule,
  ContextMenuModule,
  RowGroupingModule,
} from "ag-grid-enterprise";
import { IOlympicData } from "./interfaces";
ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  ColumnMenuModule,
  ContextMenuModule,
  RowGroupingModule,
  ValidationModule /* Development Only */,
]);

const VueExample = defineComponent({
  template: `
        <div style="height: 100%">
                <div class="example-wrapper">
      <div class="example-header">
        <label>
          <span>suppressAggFuncInHeader:</span>
          <input id="suppressAggFuncInHeader" type="checkbox" v-on:change="toggleProperty()">
          </label>
        </div>
        <ag-grid-vue
          style="width: 100%; height: 100%;"
          @grid-ready="onGridReady"
          :columnDefs="columnDefs"
          :defaultColDef="defaultColDef"
          :autoGroupColumnDef="autoGroupColumnDef"
          :rowData="rowData"></ag-grid-vue>
        </div>
        </div>
    `,
  components: {
    "ag-grid-vue": AgGridVue,
  },
  setup(props) {
    const gridApi = shallowRef<GridApi<IOlympicData> | null>(null);
    const columnDefs = ref<ColDef[]>([
      { field: "country", rowGroup: true, hide: true },
      { field: "bronze", aggFunc: "max" },
      { field: "silver", aggFunc: "max" },
      { field: "gold", aggFunc: "max" },
      { field: "total", aggFunc: "avg" },
    ]);
    const defaultColDef = ref<ColDef>({
      flex: 1,
      minWidth: 140,
    });
    const autoGroupColumnDef = ref<ColDef>({
      minWidth: 200,
    });
    const rowData = ref<IOlympicData[]>(null);

    function toggleProperty() {
      const suppressAggFuncInHeader = document.querySelector<HTMLInputElement>(
        "#suppressAggFuncInHeader",
      )!.checked;
      gridApi.value.setGridOption(
        "suppressAggFuncInHeader",
        suppressAggFuncInHeader,
      );
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
      defaultColDef,
      autoGroupColumnDef,
      rowData,
      onGridReady,
      toggleProperty,
    };
  },
});

createApp(VueExample).mount("#app");
