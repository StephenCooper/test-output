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
  CellValueChangedEvent,
  ClientSideRowModelApiModule,
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
  ValidationModule,
} from "ag-grid-community";
import { RowGroupingModule, SetFilterModule } from "ag-grid-enterprise";
ModuleRegistry.registerModules([
  ClientSideRowModelApiModule,
  CellStyleModule,
  ClientSideRowModelModule,
  RowGroupingModule,
  SetFilterModule,
  HighlightChangesModule,
  NumberFilterModule,
  TextEditorModule,
  ValidationModule /* Development Only */,
]);

function getRowData() {
  const rowData = [];
  for (let i = 1; i <= 10; i++) {
    rowData.push({
      group: i < 5 ? "A" : "B",
      a: (i * 863) % 100,
      b: (i * 811) % 100,
      c: (i * 743) % 100,
      d: (i * 677) % 100,
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
      :autoGroupColumnDef="autoGroupColumnDef"
      :columnTypes="columnTypes"
      :rowData="rowData"
      :groupDefaultExpanded="groupDefaultExpanded"
      :suppressAggFuncInHeader="true"
      @cell-value-changed="onCellValueChanged"></ag-grid-vue>
        </div>
    `,
  components: {
    "ag-grid-vue": AgGridVue,
  },
  setup(props) {
    const gridApi = shallowRef<GridApi | null>(null);
    const columnDefs = ref<ColDef[]>([
      // do NOT hide this column, it's needed for editing
      { field: "group", rowGroup: true, editable: true },
      { field: "a", type: "valueColumn" },
      { field: "b", type: "valueColumn" },
      { field: "c", type: "valueColumn" },
      { field: "d", type: "valueColumn" },
      {
        headerName: "Total",
        type: "totalColumn",
        // we use getValue() instead of data.a so that it gets the aggregated values at the group level
        valueGetter:
          'getValue("a") + getValue("b") + getValue("c") + getValue("d")',
      },
    ]);
    const defaultColDef = ref<ColDef>({
      flex: 1,
      filter: true,
    });
    const autoGroupColumnDef = ref<ColDef>({
      minWidth: 100,
    });
    const columnTypes = ref<{
      [key: string]: ColTypeDef;
    }>({
      valueColumn: {
        minWidth: 90,
        editable: true,
        aggFunc: "sum",
        valueParser: "Number(newValue)",
        cellClass: "number-cell",
        cellRenderer: "agAnimateShowChangeCellRenderer",
        filter: "agNumberColumnFilter",
      },
      totalColumn: {
        cellRenderer: "agAnimateShowChangeCellRenderer",
        cellClass: "number-cell",
      },
    });
    const rowData = ref<any[] | null>(getRowData());
    const groupDefaultExpanded = ref(1);

    function onCellValueChanged(params: CellValueChangedEvent) {
      const changedData = [params.data];
      params.api.applyTransaction({ update: changedData });
    }
    const onGridReady = (params: GridReadyEvent) => {
      gridApi.value = params.api;
    };

    return {
      gridApi,
      columnDefs,
      defaultColDef,
      autoGroupColumnDef,
      columnTypes,
      rowData,
      groupDefaultExpanded,
      onGridReady,
      onCellValueChanged,
    };
  },
});

createApp(VueExample).mount("#app");
