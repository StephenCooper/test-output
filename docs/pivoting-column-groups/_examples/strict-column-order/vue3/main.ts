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
  GetRowIdFunc,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ModuleRegistry,
  ValidationModule,
  createGrid,
} from "ag-grid-community";
import { PivotModule } from "ag-grid-enterprise";
import { getData } from "./data";
ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  PivotModule,
  ValidationModule /* Development Only */,
]);

let count = 0;

const VueExample = defineComponent({
  template: `
        <div style="height: 100%">
                <div class="example-wrapper">
      <div class="example-header">
        <label>
          <span>enableStrictPivotColumnOrder:</span>
          <input id="enableStrictPivotColumnOrder" type="checkbox" v-on:change="toggleOption()">
          </label>
        </div>
        <ag-grid-vue
          style="width: 100%; height: 100%;"
          @grid-ready="onGridReady"
          :columnDefs="columnDefs"
          :defaultColDef="defaultColDef"
          :autoGroupColumnDef="autoGroupColumnDef"
          :pivotMode="true"
          :getRowId="getRowId"
          :rowData="rowData"></ag-grid-vue>
        </div>
        </div>
    `,
  components: {
    "ag-grid-vue": AgGridVue,
  },
  setup(props) {
    const gridApi = shallowRef<GridApi | null>(null);
    const columnDefs = ref<ColDef[]>([
      { field: "pivotValue", pivot: true },
      { field: "agg", aggFunc: "sum", rowGroup: true },
    ]);
    const defaultColDef = ref<ColDef>({
      width: 130,
    });
    const autoGroupColumnDef = ref<ColDef>({
      minWidth: 100,
    });
    const getRowId = ref<GetRowIdFunc>((p) => String(p.data.pivotValue));
    const rowData = ref<any[]>(null);

    function toggleOption() {
      const isChecked = document.querySelector<HTMLInputElement>(
        "#enableStrictPivotColumnOrder",
      )!.checked;
      gridApi.value.setGridOption("enableStrictPivotColumnOrder", isChecked);
    }
    const onGridReady = (params: GridReadyEvent) => {
      gridApi.value = params.api;

      setInterval(() => {
        count += 1;
        const rowData = getData();
        params.api.setGridOption(
          "rowData",
          rowData.slice(0, (count % rowData.length) + 1),
        );
      }, 1000);
    };

    return {
      gridApi,
      columnDefs,
      defaultColDef,
      autoGroupColumnDef,
      getRowId,
      rowData,
      onGridReady,
      toggleOption,
    };
  },
});

createApp(VueExample).mount("#app");
