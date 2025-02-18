import {
  createApp,
  defineComponent,
  onBeforeMount,
  ref,
  shallowRef,
} from "vue";
import { AgGridVue } from "ag-grid-vue3";
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
  HighlightChangesModule,
  RowApiModule,
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
        <button v-on:click="onFlashOneCell()" style="margin-left: 15px">Flash One Cell</button>
        <button v-on:click="onFlashTwoRows()">Flash Two Rows</button>
        <button v-on:click="onFlashTwoColumns()">Flash Two Columns</button>
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
      valueFormatter: (params) => {
        return formatNumber(params.value);
      },
    });
    const rowData = ref<any[] | null>(createRowData());

    function onFlashOneCell() {
      // pick fourth row at random
      const rowNode = gridApi.value!.getDisplayedRowAtIndex(4)!;
      // pick 'c' column
      gridApi.value!.flashCells({ rowNodes: [rowNode], columns: ["c"] });
    }
    function onFlashTwoColumns() {
      // flash whole column, so leave row selection out
      gridApi.value!.flashCells({ columns: ["c", "d"] });
    }
    function onFlashTwoRows() {
      // pick fourth and fifth row at random
      const rowNode1 = gridApi.value!.getDisplayedRowAtIndex(4)!;
      const rowNode2 = gridApi.value!.getDisplayedRowAtIndex(5)!;
      // flash whole row, so leave column selection out
      gridApi.value!.flashCells({ rowNodes: [rowNode1, rowNode2] });
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
      onFlashOneCell,
      onFlashTwoColumns,
      onFlashTwoRows,
    };
  },
});

createApp(VueExample).mount("#app");
