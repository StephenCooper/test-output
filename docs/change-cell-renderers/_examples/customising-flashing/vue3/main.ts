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
  CellStyleModule,
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  GridApi,
  GridOptions,
  GridReadyEvent,
  HighlightChangesModule,
  ModuleRegistry,
  RowApiModule,
  ValidationModule,
} from "ag-grid-community";
ModuleRegistry.registerModules([
  RowApiModule,
  HighlightChangesModule,
  CellStyleModule,
  ClientSideRowModelModule,
  ValidationModule /* Development Only */,
]);

function formatNumber(number: number) {
  return Math.floor(number).toLocaleString();
}

function createRowData() {
  const rowData = [];
  for (let i = 0; i < 20; i++) {
    rowData.push({
      a: Math.floor(((i + 323) * 25435) % 10000),
      b: Math.floor(((i + 323) * 23221) % 10000),
      c: Math.floor(((i + 323) * 468276) % 10000),
      d: 0,
      e: 0,
      f: 0,
    });
  }
  return rowData;
}

const VueExample = defineComponent({
  template: `
        <div style="height: 100%">
                <div style="height: 100%; display: flex; flex-direction: column">
      <div style="margin-bottom: 4px">
        <button v-on:click="onUpdateSomeValues()">Update Some Data</button>
      </div>
      <div style="flex-grow: 1">
        <ag-grid-vue
          style="width: 100%; height: 100%;"
          @grid-ready="onGridReady"
          :columnDefs="columnDefs"
          :defaultColDef="defaultColDef"
          :rowData="rowData"></ag-grid-vue>
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
      { field: "a" },
      { field: "b" },
      { field: "c" },
      { field: "d" },
      { field: "e" },
      { field: "f" },
    ]);
    const defaultColDef = ref<ColDef>({
      flex: 1,
      cellClass: "align-right",
      enableCellChangeFlash: true,
      valueFormatter: (params) => {
        return formatNumber(params.value);
      },
    });
    const rowData = ref<any[] | null>(createRowData());

    function onUpdateSomeValues() {
      const rowCount = gridApi.value!.getDisplayedRowCount();
      // pick 20 cells at random to update
      for (let i = 0; i < 20; i++) {
        const row = Math.floor(Math.random() * rowCount);
        const rowNode = gridApi.value!.getDisplayedRowAtIndex(row)!;
        const col = ["a", "b", "c", "d", "e", "f"][i % 6];
        rowNode.setDataValue(col, Math.floor(Math.random() * 10000));
      }
    }
    const onGridReady = (params: GridReadyEvent) => {
      gridApi.value = params.api;
    };

    return {
      gridApi,
      columnDefs,
      defaultColDef,
      rowData,
      onGridReady,
      onUpdateSomeValues,
    };
  },
});

createApp(VueExample).mount("#app");
