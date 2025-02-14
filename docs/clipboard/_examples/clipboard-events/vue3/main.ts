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
  CellValueChangedEvent,
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  CutEndEvent,
  CutStartEvent,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ModuleRegistry,
  NumberEditorModule,
  PasteEndEvent,
  PasteStartEvent,
  TextEditorModule,
  ValidationModule,
  createGrid,
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
                <ag-grid-vue
      style="width: 100%; height: 100%;"
      @grid-ready="onGridReady"
      :columnDefs="columnDefs"
      :defaultColDef="defaultColDef"
      :cellSelection="true"
      :rowData="rowData"
      @cell-value-changed="onCellValueChanged"
      @cut-start="onCutStart"
      @cut-end="onCutEnd"
      @paste-start="onPasteStart"
      @paste-end="onPasteEnd"></ag-grid-vue>
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
    const rowData = ref<IOlympicData[]>(null);

    function onCellValueChanged(params: CellValueChangedEvent) {
      console.log("Callback onCellValueChanged:", params);
    }
    function onCutStart(params: CutStartEvent) {
      console.log("Callback onCutStart:", params);
    }
    function onCutEnd(params: CutEndEvent) {
      console.log("Callback onCutEnd:", params);
    }
    function onPasteStart(params: PasteStartEvent) {
      console.log("Callback onPasteStart:", params);
    }
    function onPasteEnd(params: PasteEndEvent) {
      console.log("Callback onPasteEnd:", params);
    }
    const onGridReady = (params: GridReadyEvent) => {
      gridApi.value = params.api;

      const updateData = (data) => (rowData.value = data);

      fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
        .then((resp) => resp.json())
        .then((data) => updateData(data));
    };

    return {
      gridApi,
      columnDefs,
      defaultColDef,
      rowData,
      onGridReady,
      onCellValueChanged,
      onCutStart,
      onCutEnd,
      onPasteStart,
      onPasteEnd,
    };
  },
});

createApp(VueExample).mount("#app");
