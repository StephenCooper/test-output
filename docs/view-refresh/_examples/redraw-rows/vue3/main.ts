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
  RowApiModule,
  RowClassParams,
  RowStyle,
  RowStyleModule,
  ValidationModule,
  createGrid,
} from "ag-grid-community";
ModuleRegistry.registerModules([
  RowApiModule,
  RowStyleModule,
  ClientSideRowModelModule,
  ValidationModule /* Development Only */,
]);

let colorIndex = 0;

const colors = ["#99999944", "#CC333344", "#33CC3344", "#2244CC44"];

function createData(count: number) {
  const result = [];
  for (let i = 1; i <= count; i++) {
    result.push({
      a: (i * 863) % 100,
      b: (i * 811) % 100,
      c: (i * 743) % 100,
      d: (i * 677) % 100,
      e: (i * 619) % 100,
      f: (i * 571) % 100,
    });
  }
  return result;
}

function progressColor() {
  colorIndex++;
  if (colorIndex === colors.length) {
    colorIndex = 0;
  }
}

const VueExample = defineComponent({
  template: `
        <div style="height: 100%">
                <div class="example-wrapper">
      <div style="margin-bottom: 5px">
        <button v-on:click="redrawAllRows()">Redraw All Rows</button>
        <button v-on:click="redrawTopRows()">Redraw Top Rows</button>
      </div>
      <ag-grid-vue
        style="width: 100%; height: 100%;"
        @grid-ready="onGridReady"
        :columnDefs="columnDefs"
        :defaultColDef="defaultColDef"
        :rowData="rowData"
        :getRowStyle="getRowStyle"></ag-grid-vue>
      </div>
        </div>
    `,
  components: {
    "ag-grid-vue": AgGridVue,
  },
  setup(props) {
    const gridApi = shallowRef<GridApi | null>(null);
    const columnDefs = ref<ColDef[]>([
      { headerName: "A", field: "a" },
      { headerName: "B", field: "b" },
      { headerName: "C", field: "c" },
      { headerName: "D", field: "d" },
      { headerName: "E", field: "e" },
      { headerName: "F", field: "f" },
    ]);
    const defaultColDef = ref<ColDef>({
      flex: 1,
    });
    const rowData = ref<any[] | null>(createData(12));
    const getRowStyle = ref<(params: RowClassParams) => RowStyle | undefined>(
      (params: RowClassParams): RowStyle | undefined => {
        return {
          backgroundColor: colors[colorIndex],
        };
      },
    );

    function redrawAllRows() {
      progressColor();
      gridApi.value!.redrawRows();
    }
    function redrawTopRows() {
      progressColor();
      const rows = [];
      for (let i = 0; i < 6; i++) {
        const row = gridApi.value!.getDisplayedRowAtIndex(i)!;
        rows.push(row);
      }
      gridApi.value!.redrawRows({ rowNodes: rows });
    }
    const onGridReady = (params: GridReadyEvent) => {
      gridApi.value = params.api;
    };

    return {
      gridApi,
      columnDefs,
      defaultColDef,
      rowData,
      getRowStyle,
      onGridReady,
      redrawAllRows,
      redrawTopRows,
    };
  },
});

createApp(VueExample).mount("#app");
