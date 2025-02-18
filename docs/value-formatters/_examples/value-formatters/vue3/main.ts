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
  CellStyleModule,
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ModuleRegistry,
  ValidationModule,
  ValueFormatterParams,
} from "ag-grid-community";
ModuleRegistry.registerModules([
  CellStyleModule,
  ClientSideRowModelModule,
  ValidationModule /* Development Only */,
]);

function bracketsFormatter(params: ValueFormatterParams) {
  return "(" + params.value + ")";
}

function currencyFormatter(params: ValueFormatterParams) {
  return "£" + formatNumber(params.value);
}

function formatNumber(number: number) {
  return Math.floor(number).toLocaleString();
}

function createRowData() {
  const rowData = [];
  for (let i = 0; i < 100; i++) {
    rowData.push({
      a: Math.floor(((i + 2) * 173456) % 10000),
      b: Math.floor(((i + 7) * 373456) % 10000),
    });
  }
  return rowData;
}

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
    const gridApi = shallowRef<GridApi | null>(null);
    const columnDefs = ref<ColDef[]>([
      { headerName: "A", field: "a" },
      { headerName: "B", field: "b" },
      { headerName: "£A", field: "a", valueFormatter: currencyFormatter },
      { headerName: "£B", field: "b", valueFormatter: currencyFormatter },
      { headerName: "(A)", field: "a", valueFormatter: bracketsFormatter },
      { headerName: "(B)", field: "b", valueFormatter: bracketsFormatter },
    ]);
    const defaultColDef = ref<ColDef>({
      flex: 1,
      cellClass: "number-cell",
    });
    const rowData = ref<any[] | null>(createRowData());

    const onGridReady = (params: GridReadyEvent) => {
      gridApi.value = params.api;
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
