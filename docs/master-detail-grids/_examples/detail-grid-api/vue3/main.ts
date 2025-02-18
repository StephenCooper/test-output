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
  GetRowIdFunc,
  GetRowIdParams,
  GridApi,
  GridOptions,
  GridReadyEvent,
  HighlightChangesModule,
  IDetailCellRendererParams,
  ModuleRegistry,
  NumberEditorModule,
  RowApiModule,
  TextEditorModule,
  ValidationModule,
} from "ag-grid-community";
import {
  ColumnMenuModule,
  ColumnsToolPanelModule,
  ContextMenuModule,
  MasterDetailModule,
} from "ag-grid-enterprise";
import { IAccount } from "./interfaces";
ModuleRegistry.registerModules([
  TextEditorModule,
  NumberEditorModule,
  RowApiModule,
  ClientSideRowModelModule,
  ColumnsToolPanelModule,
  MasterDetailModule,
  ColumnMenuModule,
  ContextMenuModule,
  HighlightChangesModule,
  ValidationModule /* Development Only */,
]);

const VueExample = defineComponent({
  template: `
        <div style="height: 100%">
                <div style="display: flex; flex-direction: column; height: 100%">
      <div style="padding-bottom: 4px">
        <button v-on:click="flashMilaSmithOnly()">Flash Mila Smith</button>
        <button v-on:click="flashAll()">Flash All</button>
      </div>
      <ag-grid-vue
        style="width: 100%; height: 100%;"
        @grid-ready="onGridReady"
        :columnDefs="columnDefs"
        :masterDetail="true"
        :detailRowHeight="detailRowHeight"
        :detailCellRendererParams="detailCellRendererParams"
        :getRowId="getRowId"
        :defaultColDef="defaultColDef"
        :rowData="rowData"
        @first-data-rendered="onFirstDataRendered"></ag-grid-vue>
      </div>
        </div>
    `,
  components: {
    "ag-grid-vue": AgGridVue,
  },
  setup(props) {
    const gridApi = shallowRef<GridApi<IAccount> | null>(null);
    const columnDefs = ref<ColDef[]>([
      // group cell renderer needed for expand / collapse icons
      { field: "name", cellRenderer: "agGroupCellRenderer" },
      { field: "account" },
      { field: "calls" },
      { field: "minutes", valueFormatter: "x.toLocaleString() + 'm'" },
    ]);
    const detailRowHeight = ref(200);
    const detailCellRendererParams = ref({
      detailGridOptions: {
        columnDefs: [
          { field: "callId" },
          { field: "direction" },
          { field: "number", minWidth: 150 },
          { field: "duration", valueFormatter: "x.toLocaleString() + 's'" },
          { field: "switchCode", minWidth: 150 },
        ],
        defaultColDef: {
          flex: 1,
          editable: true,
        },
      },
      getDetailRowData: (params) => {
        params.successCallback(params.data.callRecords);
      },
    } as IDetailCellRendererParams<IAccount, ICallRecord>);
    const getRowId = ref<GetRowIdFunc>((params: GetRowIdParams) => {
      // use 'account' as the row ID
      return String(params.data.account);
    });
    const defaultColDef = ref<ColDef>({
      flex: 1,
      editable: true,
    });
    const rowData = ref<IAccount[]>(null);

    function onFirstDataRendered(params: FirstDataRenderedEvent) {
      setTimeout(() => {
        params.api.forEachNode(function (node) {
          node.setExpanded(true);
        });
      }, 0);
    }
    function flashMilaSmithOnly() {
      // flash Mila Smith - we know her account is 177001 and we use the account for the row ID
      const detailGrid = gridApi.value!.getDetailGridInfo("detail_177001");
      if (detailGrid) {
        detailGrid.api!.flashCells();
      }
    }
    function flashAll() {
      gridApi.value!.forEachDetailGridInfo(function (detailGridApi) {
        detailGridApi.api!.flashCells();
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
      columnDefs,
      detailRowHeight,
      detailCellRendererParams,
      getRowId,
      defaultColDef,
      rowData,
      onGridReady,
      onFirstDataRendered,
      flashMilaSmithOnly,
      flashAll,
    };
  },
});

createApp(VueExample).mount("#app");
