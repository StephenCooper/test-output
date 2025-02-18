import {
  createApp,
  defineComponent,
  onBeforeMount,
  ref,
  shallowRef,
} from "vue";
import { AgGridVue } from "ag-grid-vue3";
import {
  ClientSideRowModelApiModule,
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  ColumnApiModule,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ModuleRegistry,
  NumberEditorModule,
  ProcessDataFromClipboardParams,
  RowApiModule,
  RowSelectionModule,
  RowSelectionOptions,
  TextEditorModule,
  ValidationModule,
} from "ag-grid-community";
import {
  CellSelectionModule,
  ClipboardModule,
  ColumnMenuModule,
  ContextMenuModule,
} from "ag-grid-enterprise";
ModuleRegistry.registerModules([
  ColumnApiModule,
  RowApiModule,
  ClientSideRowModelApiModule,
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
                <ag-grid-vue
      style="width: 100%; height: 100%;"
      @grid-ready="onGridReady"
      :columnDefs="columnDefs"
      :defaultColDef="defaultColDef"
      :rowSelection="rowSelection"
      :processDataFromClipboard="processDataFromClipboard"
      :rowData="rowData"></ag-grid-vue>
        </div>
    `,
  components: {
    "ag-grid-vue": AgGridVue,
  },
  setup(props) {
    const gridApi = shallowRef<GridApi | null>(null);
    const columnDefs = ref<ColDef[]>([
      { headerName: "Athlete", field: "athlete", width: 150 },
      { headerName: "Age", field: "age", width: 90 },
      { headerName: "Country", field: "country", width: 120 },
      { headerName: "Year", field: "year", width: 90 },
      { headerName: "Date", field: "date", width: 110 },
      { headerName: "Sport", field: "sport", width: 110 },
    ]);
    const defaultColDef = ref<ColDef>({
      editable: true,
    });
    const rowSelection = ref<RowSelectionOptions | "single" | "multiple">({
      mode: "multiRow",
      checkboxes: false,
      headerCheckbox: false,
      enableClickSelection: true,
      copySelectedRows: true,
    });
    const rowData = ref<any[]>(null);

    const onGridReady = (params: GridReadyEvent) => {
      gridApi.value = params.api;

      const updateData = (data) => (rowData.value = data.slice(0, 8));

      fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
        .then((resp) => resp.json())
        .then((data) => updateData(data));
    };
    const processDataFromClipboard: (
      params: ProcessDataFromClipboardParams,
    ) => string[][] | null = (params: ProcessDataFromClipboardParams) => {
      const data = [...params.data];
      const emptyLastRow =
        data[data.length - 1][0] === "" && data[data.length - 1].length === 1;
      if (emptyLastRow) {
        data.splice(data.length - 1, 1);
      }
      const lastIndex = params.api!.getDisplayedRowCount() - 1;
      const focusedCell = params.api!.getFocusedCell();
      const focusedIndex = focusedCell!.rowIndex;
      if (focusedIndex + data.length - 1 > lastIndex) {
        const resultLastIndex = focusedIndex + (data.length - 1);
        const numRowsToAdd = resultLastIndex - lastIndex;
        const rowsToAdd: any[] = [];
        for (let i = 0; i < numRowsToAdd; i++) {
          const index = data.length - 1;
          const row = data.slice(index, index + 1)[0];
          // Create row object
          const rowObject: any = {};
          let currentColumn: any = focusedCell!.column;
          row.forEach((item) => {
            if (!currentColumn) {
              return;
            }
            rowObject[currentColumn.colDef.field] = item;
            currentColumn = params.api!.getDisplayedColAfter(currentColumn);
          });
          rowsToAdd.push(rowObject);
        }
        params.api!.applyTransaction({ add: rowsToAdd });
      }
      return data;
    };

    return {
      gridApi,
      columnDefs,
      defaultColDef,
      rowSelection,
      processDataFromClipboard,
      rowData,
      onGridReady,
    };
  },
});

createApp(VueExample).mount("#app");
