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
  ColTypeDef,
  GridApi,
  GridOptions,
  GridReadyEvent,
  HighlightChangesModule,
  ModuleRegistry,
  NumberFilterModule,
  TextEditorModule,
  TextFilterModule,
  ValidationModule,
} from "ag-grid-community";
ModuleRegistry.registerModules([
  TextEditorModule,
  TextFilterModule,
  HighlightChangesModule,
  CellStyleModule,
  ClientSideRowModelModule,
  NumberFilterModule,
  ValidationModule /* Development Only */,
]);

function getRowData() {
  const rowData = [];
  for (let i = 1; i <= 20; i++) {
    rowData.push({
      group: i < 5 ? "A" : "B",
      a: (i * 863) % 100,
      b: (i * 811) % 100,
      c: (i * 743) % 100,
      d: (i * 677) % 100,
      e: (i * 619) % 100,
      f: (i * 571) % 100,
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
      :columnTypes="columnTypes"
      :rowData="rowData"
      :groupDefaultExpanded="groupDefaultExpanded"
      :suppressAggFuncInHeader="true"></ag-grid-vue>
        </div>
    `,
  components: {
    "ag-grid-vue": AgGridVue,
  },
  setup(props) {
    const gridApi = shallowRef<GridApi | null>(null);
    const columnDefs = ref<ColDef[]>([
      { field: "a", type: "valueColumn" },
      { field: "b", type: "valueColumn" },
      { field: "c", type: "valueColumn" },
      { field: "d", type: "valueColumn" },
      { field: "e", type: "valueColumn" },
      { field: "f", type: "valueColumn" },
      {
        headerName: "Total",
        valueGetter: "data.a + data.b + data.c + data.d + data.e + data.f",
        editable: false,
        cellClass: "total-col",
      },
    ]);
    const defaultColDef = ref<ColDef>({
      flex: 1,
      enableCellChangeFlash: true,
    });
    const columnTypes = ref<{
      [key: string]: ColTypeDef;
    }>({
      valueColumn: {
        minWidth: 90,
        editable: true,
        valueParser: "Number(newValue)",
        filter: "agNumberColumnFilter",
      },
    });
    const rowData = ref<any[] | null>(getRowData());
    const groupDefaultExpanded = ref(1);

    const onGridReady = (params: GridReadyEvent) => {
      gridApi.value = params.api;
    };

    return {
      gridApi,
      columnDefs,
      defaultColDef,
      columnTypes,
      rowData,
      groupDefaultExpanded,
      onGridReady,
    };
  },
});

createApp(VueExample).mount("#app");
