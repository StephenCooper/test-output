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
  HighlightChangesModule,
  ModuleRegistry,
  RowApiModule,
  TextEditorModule,
  ValidationModule,
  ValueParserParams,
} from "ag-grid-community";
ModuleRegistry.registerModules([
  TextEditorModule,
  RowApiModule,
  CellStyleModule,
  ClientSideRowModelModule,
  HighlightChangesModule,
  ValidationModule /* Development Only */,
]);

function numberValueParser(params: ValueParserParams) {
  return Number(params.newValue);
}

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
    });
  }
  return rowData;
}

const VueExample = defineComponent({
  template: `
        <div style="height: 100%">
                <div class="example-wrapper">
      <div style="margin-bottom: 5px">
        <button v-on:click="onUpdateSomeValues()">Update Some C &amp; D Values</button>
      </div>
      <ag-grid-vue
        style="width: 100%; height: 100%;"
        @grid-ready="onGridReady"
        :columnDefs="columnDefs"
        :defaultColDef="defaultColDef"
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
      {
        headerName: "Editable A",
        field: "a",
        editable: true,
        valueParser: numberValueParser,
      },
      {
        headerName: "Editable B",
        field: "b",
        editable: true,
        valueParser: numberValueParser,
      },
      {
        headerName: "API C",
        field: "c",
        minWidth: 135,
        valueParser: numberValueParser,
        cellRenderer: "agAnimateSlideCellRenderer",
      },
      {
        headerName: "API D",
        field: "d",
        minWidth: 135,
        valueParser: numberValueParser,
        cellRenderer: "agAnimateSlideCellRenderer",
      },
      {
        headerName: "Total",
        valueGetter: "data.a + data.b + data.c + data.d",
        minWidth: 135,
        cellRenderer: "agAnimateSlideCellRenderer",
      },
      {
        headerName: "Average",
        valueGetter: "(data.a + data.b + data.c + data.d) / 4",
        minWidth: 135,
        cellRenderer: "agAnimateSlideCellRenderer",
      },
    ]);
    const defaultColDef = ref<ColDef>({
      minWidth: 105,
      flex: 1,
      cellClass: "align-right",
      valueFormatter: (params) => {
        return formatNumber(params.value);
      },
    });
    const rowData = ref<any[] | null>(createRowData());

    function onUpdateSomeValues() {
      const rowCount = gridApi.value!.getDisplayedRowCount();
      for (let i = 0; i < 10; i++) {
        const row = Math.floor(Math.random() * rowCount);
        const rowNode = gridApi.value!.getDisplayedRowAtIndex(row)!;
        rowNode.setDataValue("c", Math.floor(Math.random() * 10000));
        rowNode.setDataValue("d", Math.floor(Math.random() * 10000));
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
