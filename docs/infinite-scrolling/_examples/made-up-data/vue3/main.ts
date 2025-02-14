import {
  createApp,
  defineComponent,
  onBeforeMount,
  ref,
  shallowRef,
} from "vue";
import { AgGridVue } from "ag-grid-vue3";
import {
  ColDef,
  ColGroupDef,
  ColumnApiModule,
  GetRowIdFunc,
  GetRowIdParams,
  GridApi,
  GridOptions,
  GridReadyEvent,
  IDatasource,
  IGetRowsParams,
  InfiniteRowModelModule,
  ModuleRegistry,
  RowModelType,
  RowSelectionModule,
  RowSelectionOptions,
  ValidationModule,
  createGrid,
} from "ag-grid-community";
ModuleRegistry.registerModules([
  ColumnApiModule,
  RowSelectionModule,
  InfiniteRowModelModule,
  ValidationModule /* Development Only */,
]);

const ALPHABET = "abcdefghijklmnopqrstuvwxyz".split("");

function getColumnDefs() {
  const columnDefs: ColDef[] = [
    { headerName: "#", width: 80, valueGetter: "node.rowIndex" },
  ];
  ALPHABET.forEach((letter) => {
    columnDefs.push({
      headerName: letter.toUpperCase(),
      field: letter,
      width: 150,
    });
  });
  return columnDefs;
}

function getDataSource(count: number) {
  const dataSource: IDatasource = {
    rowCount: count,
    getRows: (params: IGetRowsParams) => {
      const rowsThisPage: any[] = [];
      for (
        var rowIndex = params.startRow;
        rowIndex < params.endRow;
        rowIndex++
      ) {
        var record: Record<string, string> = {};
        ALPHABET.forEach(function (letter, colIndex) {
          const randomNumber = 17 + rowIndex + colIndex;
          const cellKey = letter.toUpperCase() + (rowIndex + 1);
          record[letter] = cellKey + " = " + randomNumber;
        });
        rowsThisPage.push(record);
      }
      // to mimic server call, we reply after a short delay
      setTimeout(() => {
        // no need to pass the second 'rowCount' parameter as we have already provided it
        params.successCallback(rowsThisPage);
      }, 100);
    },
  };
  return dataSource;
}

const VueExample = defineComponent({
  template: `
        <div style="height: 100%">
                <ag-grid-vue
      style="width: 100%; height: 100%;"
      @grid-ready="onGridReady"
      :columnDefs="columnDefs"
      :rowModelType="rowModelType"
      :rowSelection="rowSelection"
      :maxBlocksInCache="maxBlocksInCache"
      :getRowId="getRowId"
      :datasource="datasource"
      :defaultColDef="defaultColDef"
      :rowData="rowData"></ag-grid-vue>
        </div>
    `,
  components: {
    "ag-grid-vue": AgGridVue,
  },
  setup(props) {
    const gridApi = shallowRef<GridApi | null>(null);
    const columnDefs = ref<ColDef[]>(getColumnDefs());
    const rowModelType = ref<RowModelType>("infinite");
    const rowSelection = ref<RowSelectionOptions | "single" | "multiple">({
      mode: "multiRow",
      headerCheckbox: false,
    });
    const maxBlocksInCache = ref(2);
    const getRowId = ref<GetRowIdFunc>((params: GetRowIdParams) => {
      return params.data.a;
    });
    const datasource = ref<IDatasource>(getDataSource(100));
    const defaultColDef = ref<ColDef>({
      sortable: false,
    });
    const rowData = ref<any[]>(null);

    const onGridReady = (params: GridReadyEvent) => {
      gridApi.value = params.api;
    };

    return {
      gridApi,
      columnDefs,
      rowModelType,
      rowSelection,
      maxBlocksInCache,
      getRowId,
      datasource,
      defaultColDef,
      rowData,
      onGridReady,
    };
  },
});

createApp(VueExample).mount("#app");
