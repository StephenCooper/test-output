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
} from "ag-grid-community";
import { MasterDetailModule } from "ag-grid-enterprise";
import DetailCellRenderer from "./detailCellRendererVue";
import { IAccount } from "./interfaces";
ModuleRegistry.registerModules([
  RowApiModule,
  ClientSideRowModelModule,
  MasterDetailModule,
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
      :detailRowHeight="detailRowHeight"
      :columnDefs="columnDefs"
      :defaultColDef="defaultColDef"
      :embedFullWidthRows="true"
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
    const detailRowHeight = ref(150);
    const columnDefs = ref<ColDef[]>([
      // group cell renderer needed for expand / collapse icons
      { field: "name", cellRenderer: "agGroupCellRenderer", pinned: "left" },
      { field: "account" },
      { field: "calls" },
      { field: "minutes", valueFormatter: "x.toLocaleString() + 'm'" },
      { headerName: "Extra Col 1", valueGetter: '"AAA"' },
      { headerName: "Extra Col 2", valueGetter: '"BBB"' },
      { headerName: "Extra Col 3", valueGetter: '"CCC"' },
      { headerName: "Pinned Right", pinned: "right" },
    ]);
    const defaultColDef = ref<ColDef>({});
    const rowData = ref<IAccount[]>(null);

    function onFirstDataRendered(params: FirstDataRenderedEvent) {
      setTimeout(() => {
        params.api.forEachNode(function (node) {
          node.setExpanded(node.id === "1");
        });
      }, 1000);
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
      detailRowHeight,
      columnDefs,
      defaultColDef,
      rowData,
      onGridReady,
      onFirstDataRendered,
    };
  },
});

createApp(VueExample).mount("#app");
