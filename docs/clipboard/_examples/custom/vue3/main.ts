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
  NumberEditorModule,
  RowSelectionModule,
  RowSelectionOptions,
  SendToClipboardParams,
  TextEditorModule,
  ValidationModule,
} from "ag-grid-community";
import {
  CellSelectionModule,
  ClipboardModule,
  ColumnMenuModule,
  ContextMenuModule,
} from "ag-grid-enterprise";
import { IOlympicData } from "./interfaces";
ModuleRegistry.registerModules([
  NumberEditorModule,
  TextEditorModule,
  RowSelectionModule,
  ClientSideRowModelModule,
  ClipboardModule,
  ColumnMenuModule,
  ContextMenuModule,
  CellSelectionModule,
  ValidationModule /* Development Only */,
]);

const VueExample = defineComponent({
  template: `
        <div style="height: 100%">
                <div style="display: flex; height: 100%; flex-direction: column">
      <div style="padding-bottom: 5px">
        <button v-on:click="onBtCopyRows()">Copy Selected Rows to Clipboard</button>
        <button v-on:click="onBtCopyRange()">Copy Selected Range to Clipboard</button>
      </div>
      <ag-grid-vue
        style="width: 100%; height: 100%;"
        @grid-ready="onGridReady"
        :columnDefs="columnDefs"
        :defaultColDef="defaultColDef"
        :cellSelection="true"
        :rowSelection="rowSelection"
        :sendToClipboard="sendToClipboard"
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
      { field: "athlete", minWidth: 200 },
      { field: "age" },
      { field: "country", minWidth: 150 },
      { field: "year" },
      { field: "date", minWidth: 150 },
      { field: "sport", minWidth: 150 },
      { field: "gold" },
      { field: "silver" },
      { field: "bronze" },
      { field: "total" },
    ]);
    const defaultColDef = ref<ColDef>({
      editable: true,
      flex: 1,
      minWidth: 100,
    });
    const rowSelection = ref<RowSelectionOptions | "single" | "multiple">({
      mode: "multiRow",
    });
    const rowData = ref<IOlympicData[]>(null);

    function onBtCopyRows() {
      gridApi.value!.copySelectedRowsToClipboard();
    }
    function onBtCopyRange() {
      gridApi.value!.copySelectedRangeToClipboard();
    }
    const onGridReady = (params: GridReadyEvent) => {
      gridApi.value = params.api;

      const updateData = (data) => (rowData.value = data);

      fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
        .then((resp) => resp.json())
        .then((data) => updateData(data));
    };
    function sendToClipboard(params: SendToClipboardParams) {
      console.log("send to clipboard called with data:");
      console.log(params.data);
    }

    return {
      gridApi,
      columnDefs,
      defaultColDef,
      rowSelection,
      sendToClipboard,
      rowData,
      onGridReady,
      onBtCopyRows,
      onBtCopyRange,
    };
  },
});

createApp(VueExample).mount("#app");
