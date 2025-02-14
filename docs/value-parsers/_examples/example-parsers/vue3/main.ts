import {
  createApp,
  defineComponent,
  onBeforeMount,
  ref,
  shallowRef,
} from "vue";
import { AgGridVue } from "ag-grid-vue3";
import {
  CellValueChangedEvent,
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ModuleRegistry,
  TextEditorModule,
  ValidationModule,
  ValueParserParams,
  createGrid,
} from "ag-grid-community";
import { getData } from "./data";
ModuleRegistry.registerModules([
  TextEditorModule,
  ClientSideRowModelModule,
  ValidationModule /* Development Only */,
]);

function numberParser(params: ValueParserParams) {
  return Number(params.newValue);
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
      @cell-value-changed="onCellValueChanged"></ag-grid-vue>
        </div>
    `,
  components: {
    "ag-grid-vue": AgGridVue,
  },
  setup(props) {
    const gridApi = shallowRef<GridApi | null>(null);
    const columnDefs = ref<ColDef[]>([
      { headerName: "Name", field: "simple" },
      { headerName: "Bad Number", field: "numberBad" },
      {
        headerName: "Good Number",
        field: "numberGood",
        valueParser: numberParser,
      },
    ]);
    const defaultColDef = ref<ColDef>({
      flex: 1,
      editable: true,
      cellDataType: false,
    });
    const rowData = ref<any[] | null>(getData());

    function onCellValueChanged(event: CellValueChangedEvent) {
      console.log("data after changes is: ", event.data);
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
      onCellValueChanged,
    };
  },
});

createApp(VueExample).mount("#app");
