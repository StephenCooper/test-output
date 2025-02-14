import {
  createApp,
  defineComponent,
  onBeforeMount,
  ref,
  shallowRef,
} from "vue";
import { AgGridVue } from "ag-grid-vue3";
import {
  CellSelectionOptions,
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ModuleRegistry,
  TextEditorModule,
  ValidationModule,
  ValueFormatterParams,
  ValueParserParams,
} from "ag-grid-community";
import { CellSelectionModule, ClipboardModule } from "ag-grid-enterprise";
ModuleRegistry.registerModules([
  TextEditorModule,
  ClientSideRowModelModule,
  ClipboardModule,
  CellSelectionModule,
  ValidationModule /* Development Only */,
]);

function currencyFormatter(params: ValueFormatterParams) {
  return params.value == null ? "" : "£" + params.value;
}

function currencyParser(params: ValueParserParams) {
  let value = params.newValue;
  if (value == null || value === "") {
    return null;
  }
  value = String(value);
  if (value.startsWith("£")) {
    value = value.slice(1);
  }
  return parseFloat(value);
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
      :rowData="rowData"
      :cellSelection="cellSelection"></ag-grid-vue>
        </div>
    `,
  components: {
    "ag-grid-vue": AgGridVue,
  },
  setup(props) {
    const gridApi = shallowRef<GridApi | null>(null);
    const columnDefs = ref<ColDef[]>([
      {
        headerName: "£A",
        field: "a",
        valueFormatter: currencyFormatter,
        valueParser: currencyParser,
      },
      {
        headerName: "£B",
        field: "b",
        valueFormatter: currencyFormatter,
        valueParser: currencyParser,
      },
    ]);
    const defaultColDef = ref<ColDef>({
      cellDataType: false,
      editable: true,
    });
    const rowData = ref<any[] | null>(createRowData());
    const cellSelection = ref<boolean | CellSelectionOptions>({
      handle: {
        mode: "fill",
      },
    });

    const onGridReady = (params: GridReadyEvent) => {
      gridApi.value = params.api;
    };

    return {
      gridApi,
      columnDefs,
      defaultColDef,
      rowData,
      cellSelection,
      onGridReady,
    };
  },
});

createApp(VueExample).mount("#app");
