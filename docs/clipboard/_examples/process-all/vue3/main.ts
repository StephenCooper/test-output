import {
  createApp,
  defineComponent,
  onBeforeMount,
  ref,
  shallowRef,
} from "vue";
import { AgGridVue } from "ag-grid-vue3";
import "./style.css";
import {
  CellSelectionOptions,
  CellStyleModule,
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ModuleRegistry,
  ProcessDataFromClipboardParams,
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
import { getData } from "./data";
ModuleRegistry.registerModules([
  TextEditorModule,
  CellStyleModule,
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
      :rowData="rowData"
      :cellSelection="true"
      :defaultColDef="defaultColDef"
      :processDataFromClipboard="processDataFromClipboard"></ag-grid-vue>
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
    ]);
    const rowData = ref<any[] | null>(getData());
    const defaultColDef = ref<ColDef>({
      editable: true,
      minWidth: 120,
      flex: 1,
      cellClassRules: {
        "cell-green": 'value.startsWith("Green")',
        "cell-blue": 'value.startsWith("Blue")',
        "cell-red": 'value.startsWith("Red")',
        "cell-yellow": 'value.startsWith("Yellow")',
      },
    });

    const onGridReady = (params: GridReadyEvent) => {
      gridApi.value = params.api;
    };
    const processDataFromClipboard: (
      params: ProcessDataFromClipboardParams,
    ) => string[][] | null = (params: ProcessDataFromClipboardParams) => {
      let containsRed;
      let containsYellow;
      const data = params.data;
      for (let i = 0; i < data.length; i++) {
        const row = data[i];
        for (let j = 0; j < row.length; j++) {
          const value = row[j];
          if (value) {
            if (value.startsWith("Red")) {
              containsRed = true;
            } else if (value.startsWith("Yellow")) {
              containsYellow = true;
            }
          }
        }
      }
      if (containsRed) {
        // replace the paste request with another
        return [
          ["Custom 1", "Custom 2"],
          ["Custom 3", "Custom 4"],
        ];
      }
      if (containsYellow) {
        // cancels the paste
        return null;
      }
      return data;
    };

    return {
      gridApi,
      columnDefs,
      rowData,
      defaultColDef,
      processDataFromClipboard,
      onGridReady,
    };
  },
});

createApp(VueExample).mount("#app");
