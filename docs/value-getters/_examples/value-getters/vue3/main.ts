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
  ValueGetterParams,
} from "ag-grid-community";
ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  ValidationModule /* Development Only */,
]);

function hashValueGetter(params: ValueGetterParams) {
  return params.node ? Number(params.node.id) : null;
}

function abValueGetter(params: ValueGetterParams) {
  return params.data.a + params.data.b;
}

function a1000ValueGetter(params: ValueGetterParams) {
  return params.data.a * 1000;
}

function b137ValueGetter(params: ValueGetterParams) {
  return params.data.b * 137;
}

function randomValueGetter() {
  return Math.floor(Math.random() * 1000);
}

function chainValueGetter(params: ValueGetterParams) {
  return params.getValue("a&b") * 1000;
}

function constValueGetter() {
  return 99999;
}

function createRowData() {
  const rowData = [];
  for (let i = 0; i < 100; i++) {
    rowData.push({
      a: Math.floor(i % 4),
      b: Math.floor(i % 7),
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
      {
        headerName: "ID #",
        maxWidth: 100,
        valueGetter: hashValueGetter,
      },
      { field: "a" },
      { field: "b" },
      {
        headerName: "A + B",
        colId: "a&b",
        valueGetter: abValueGetter,
      },
      {
        headerName: "A * 1000",
        minWidth: 95,
        valueGetter: a1000ValueGetter,
      },
      {
        headerName: "B * 137",
        minWidth: 90,
        valueGetter: b137ValueGetter,
      },
      {
        headerName: "Random",
        minWidth: 90,
        valueGetter: randomValueGetter,
      },
      {
        headerName: "Chain",
        valueGetter: chainValueGetter,
      },
      {
        headerName: "Const",
        minWidth: 85,
        valueGetter: constValueGetter,
      },
    ]);
    const defaultColDef = ref<ColDef>({
      flex: 1,
      minWidth: 75,
      // cellClass: 'number-cell'
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
