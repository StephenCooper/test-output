import {
  createApp,
  defineComponent,
  onBeforeMount,
  ref,
  shallowRef,
} from "vue";
import { AgGridVue } from "ag-grid-vue3";
import {
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  GridApi,
  GridOptions,
  GridReadyEvent,
  IRowNode,
  ModuleRegistry,
  RowApiModule,
  RowSelectionModule,
  RowSelectionOptions,
  SelectionColumnDef,
  ValidationModule,
} from "ag-grid-community";
import {
  ColumnMenuModule,
  ColumnsToolPanelModule,
  ContextMenuModule,
  RowGroupingModule,
} from "ag-grid-enterprise";
import { IOlympicData } from "./interfaces";
ModuleRegistry.registerModules([
  RowSelectionModule,
  RowApiModule,
  ClientSideRowModelModule,
  ColumnsToolPanelModule,
  ColumnMenuModule,
  ContextMenuModule,
  RowGroupingModule,
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
      :selectionColumnDef="selectionColumnDef"
      :rowData="rowData"
      @first-data-rendered="onFirstDataRendered"></ag-grid-vue>
        </div>
    `,
  components: {
    "ag-grid-vue": AgGridVue,
  },
  setup(props) {
    const gridApi = shallowRef<GridApi<IOlympicData> | null>(null);
    const columnDefs = ref<ColDef[]>([
      { field: "athlete", minWidth: 300 },
      { field: "country", minWidth: 200 },
      { field: "sport", minWidth: 200 },
      { field: "year" },
      { field: "date", minWidth: 200 },
    ]);
    const defaultColDef = ref<ColDef>({
      flex: 1,
      minWidth: 100,
    });
    const rowSelection = ref<RowSelectionOptions | "single" | "multiple">({
      mode: "multiRow",
    });
    const selectionColumnDef = ref<SelectionColumnDef>({
      sortable: true,
      resizable: true,
      width: 120,
      suppressHeaderMenuButton: false,
      pinned: "left",
    });
    const rowData = ref<IOlympicData[]>(null);

    function onFirstDataRendered(params) {
      const nodesToSelect: IRowNode[] = [];
      params.api.forEachNode((node) => {
        if (node.rowIndex && node.rowIndex >= 3 && node.rowIndex <= 8) {
          nodesToSelect.push(node);
        }
      });
      params.api.setNodesSelected({ nodes: nodesToSelect, newValue: true });
    }
    const onGridReady = (params: GridReadyEvent) => {
      gridApi.value = params.api;

      const updateData = (data) => (rowData.value = data);

      fetch("https://www.ag-grid.com/example-assets/small-olympic-winners.json")
        .then((resp) => resp.json())
        .then((data) => updateData(data));
    };

    return {
      gridApi,
      columnDefs,
      defaultColDef,
      rowSelection,
      selectionColumnDef,
      rowData,
      onGridReady,
      onFirstDataRendered,
    };
  },
});

createApp(VueExample).mount("#app");
