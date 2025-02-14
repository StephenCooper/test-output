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
  ValidationModule,
  createGrid,
} from "ag-grid-community";
ModuleRegistry.registerModules([
  RowApiModule,
  CellStyleModule,
  ClientSideRowModelModule,
  HighlightChangesModule,
  ValidationModule /* Development Only */,
]);

function formatNumber(number: number) {
  return Math.floor(number).toLocaleString();
}

function createRowData() {
  const rowData = [];
  for (let i = 0; i < 20; i++) {
    rowData.push({
      a: Math.floor(((i + 323) * 145045) % 10000),
      b: Math.floor(((i + 323) * 543020) % 10000),
      c: Math.floor(((i + 323) * 305920) % 10000),
      d: Math.floor(((i + 323) * 204950) % 10000),
      e: Math.floor(((i + 323) * 103059) % 10000),
      f: Math.floor(((i + 323) * 468276) % 10000),
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
      :rowData="rowData"></ag-grid-vue>
        </div>
    `,
  components: {
    "ag-grid-vue": AgGridVue,
  },
  setup(props) {
    const gridApi = shallowRef<GridApi | null>(null);
    const columnDefs = ref<ColDef[]>([
      { field: "a", enableCellChangeFlash: true },
      { field: "b", enableCellChangeFlash: true },
      { field: "c", cellRenderer: "agAnimateShowChangeCellRenderer" },
      { field: "d", cellRenderer: "agAnimateShowChangeCellRenderer" },
      { field: "e", cellRenderer: "agAnimateSlideCellRenderer" },
      { field: "f", cellRenderer: "agAnimateSlideCellRenderer" },
    ]);
    const defaultColDef = ref<ColDef>({
      flex: 1,
      cellClass: "align-right",
      valueFormatter: (params) => {
        return formatNumber(params.value);
      },
    });
    const rowData = ref<any[] | null>(createRowData());

    const onGridReady = (params: GridReadyEvent) => {
      gridApi.value = params.api;

      const updateValues = () => {
        const rowCount = params.api!.getDisplayedRowCount();
        // pick 2 cells at random to update
        for (let i = 0; i < 2; i++) {
          const row = Math.floor(Math.random() * rowCount);
          const rowNode = params.api!.getDisplayedRowAtIndex(row)!;
          const col = ["a", "b", "c", "d", "e", "f"][
            Math.floor(Math.random() * 6)
          ];
          rowNode.setDataValue(col, Math.floor(Math.random() * 10000));
        }
      };
      setInterval(updateValues, 250);
    };

    return {
      gridApi,
      columnDefs,
      defaultColDef,
      rowData,
      onGridReady,
    };
  },
});

createApp(VueExample).mount("#app");
