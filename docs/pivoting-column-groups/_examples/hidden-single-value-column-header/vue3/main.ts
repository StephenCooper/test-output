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
} from "ag-grid-community";
import {
  ColumnMenuModule,
  ColumnsToolPanelModule,
  ContextMenuModule,
  FiltersToolPanelModule,
  PivotModule,
} from "ag-grid-enterprise";
import { IOlympicData } from "./interfaces";
ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  ColumnsToolPanelModule,
  FiltersToolPanelModule,
  ColumnMenuModule,
  ContextMenuModule,
  PivotModule,
  ValidationModule /* Development Only */,
]);

const VueExample = defineComponent({
  template: `
        <div style="height: 100%">
                <div class="example-wrapper">
      <div class="example-header">
        <label>
          <span>removePivotHeaderRowWhenSingleValueColumn:</span>
          <input type="checkbox" id="removePivotHeaderRowWhenSingleValueColumn" v-on:change="togglePivotHeader()" checked="true">
          </label>
        </div>
        <ag-grid-vue
          style="width: 100%; height: 100%;"
          @grid-ready="onGridReady"
          :columnDefs="columnDefs"
          :defaultColDef="defaultColDef"
          :autoGroupColumnDef="autoGroupColumnDef"
          :pivotMode="true"
          :removePivotHeaderRowWhenSingleValueColumn="true"
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
      { field: "country", rowGroup: true },
      { field: "sport", pivot: true },
      { field: "gold", aggFunc: "sum" },
    ]);
    const defaultColDef = ref<ColDef>({
      flex: 1,
      minWidth: 130,
    });
    const autoGroupColumnDef = ref<ColDef>({
      minWidth: 200,
    });
    const rowData = ref<IOlympicData[]>(null);

    function togglePivotHeader() {
      const checkbox = document.querySelector<HTMLInputElement>(
        "#removePivotHeaderRowWhenSingleValueColumn",
      )!;
      gridApi.value.setGridOption(
        "removePivotHeaderRowWhenSingleValueColumn",
        checkbox.checked,
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
      togglePivotHeader,
    };
  },
});

createApp(VueExample).mount("#app");
