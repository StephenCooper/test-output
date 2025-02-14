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
  FirstDataRenderedEvent,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ModuleRegistry,
  RowApiModule,
  ValidationModule,
  createGrid,
} from "ag-grid-community";
import {
  ColumnMenuModule,
  ColumnsToolPanelModule,
  ContextMenuModule,
  MasterDetailModule,
} from "ag-grid-enterprise";
import DetailCellRenderer from "./detailCellRendererVue";
import { IAccount } from "./interfaces";
ModuleRegistry.registerModules([
  RowApiModule,
  ClientSideRowModelModule,
  ColumnsToolPanelModule,
  MasterDetailModule,
  ColumnMenuModule,
  ContextMenuModule,
  ValidationModule /* Development Only */,
]);

const VueExample = defineComponent({
  template: `
        <div style="height: 100%">
                <ag-grid-vue
      style="width: 100%; height: 100%;"
      @grid-ready="onGridReady"
      :masterDetail="true"
      :detailCellRenderer="detailCellRenderer"
      :columnDefs="columnDefs"
      :defaultColDef="defaultColDef"
      :rowData="rowData"
      @first-data-rendered="onFirstDataRendered"></ag-grid-vue>
        </div>
    `,
  components: {
    "ag-grid-vue": AgGridVue,
    DetailCellRenderer,
  },
  setup(props) {
    const gridApi = shallowRef<GridApi<IAccount> | null>(null);
    const detailCellRenderer = ref("DetailCellRenderer");
    const columnDefs = ref<ColDef[]>([
      // group cell renderer needed for expand / collapse icons
      { field: "name", cellRenderer: "agGroupCellRenderer" },
      { field: "account" },
      { field: "calls" },
      { field: "minutes", valueFormatter: "x.toLocaleString() + 'm'" },
    ]);
    const defaultColDef = ref<ColDef>({
      flex: 1,
    });
    const rowData = ref<IAccount[]>(null);

    function onFirstDataRendered(params: FirstDataRenderedEvent) {
      params.api.forEachNode(function (node) {
        node.setExpanded(node.id === "1");
      });
    }
    const onGridReady = (params: GridReadyEvent) => {
      gridApi.value = params.api;

      const updateData = (data) => {
        rowData.value = data;
      };

      fetch("https://www.ag-grid.com/example-assets/master-detail-data.json")
        .then((resp) => resp.json())
        .then((data) => updateData(data));
    };

    return {
      gridApi,
      detailCellRenderer,
      columnDefs,
      defaultColDef,
      rowData,
      onGridReady,
      onFirstDataRendered,
    };
  },
});

createApp(VueExample).mount("#app");
