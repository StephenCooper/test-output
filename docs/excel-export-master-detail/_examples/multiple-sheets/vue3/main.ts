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
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  FirstDataRenderedEvent,
  GetRowIdFunc,
  GetRowIdParams,
  GridApi,
  GridOptions,
  GridReadyEvent,
  IDetailCellRendererParams,
  ModuleRegistry,
  RowApiModule,
  ValidationModule,
} from "ag-grid-community";
import {
  ClipboardModule,
  ColumnMenuModule,
  ColumnsToolPanelModule,
  ContextMenuModule,
  ExcelExportModule,
  MasterDetailModule,
} from "ag-grid-enterprise";
import { IAccount } from "./interfaces";
ModuleRegistry.registerModules([
  RowApiModule,
  ClientSideRowModelModule,
  ClipboardModule,
  ColumnsToolPanelModule,
  ExcelExportModule,
  MasterDetailModule,
  ColumnMenuModule,
  ContextMenuModule,
  ValidationModule /* Development Only */,
]);

const VueExample = defineComponent({
  template: `
        <div style="height: 100%">
                <div class="container">
      <div>
        <button v-on:click="onBtExport()" style="margin-bottom: 5px; font-weight: bold">Export to Excel</button>
      </div>
      <div class="grid-wrapper">
        <ag-grid-vue
          style="width: 100%; height: 100%;"
          @grid-ready="onGridReady"
          :columnDefs="columnDefs"
          :defaultColDef="defaultColDef"
          :getRowId="getRowId"
          :groupDefaultExpanded="groupDefaultExpanded"
          :rowBuffer="rowBuffer"
          :masterDetail="true"
          :detailCellRendererParams="detailCellRendererParams"
          :rowData="rowData"
          @first-data-rendered="onFirstDataRendered"></ag-grid-vue>
        </div>
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
    const defaultColDef = ref<ColDef>({
      flex: 1,
    });
    const getRowId = ref<GetRowIdFunc>((params: GetRowIdParams) => {
      return params.data.name;
    });
    const groupDefaultExpanded = ref(1);
    const rowBuffer = ref(100);
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
        },
      },
      getDetailRowData: (params) => {
        params.successCallback(params.data.callRecords);
      },
    } as IDetailCellRendererParams<IAccount, ICallRecord>);
    const rowData = ref<IAccount[]>(null);

    function onFirstDataRendered(params: FirstDataRenderedEvent) {
      params.api.forEachNode(function (node) {
        node.setExpanded(true);
      });
    }
    function onBtExport() {
      const spreadsheets = [];
      const mainSheet = gridApi.value!.getSheetDataForExcel();
      if (mainSheet) {
        spreadsheets.push(mainSheet);
      }
      gridApi.value!.forEachDetailGridInfo(function (node) {
        const sheet = node.api!.getSheetDataForExcel({
          sheetName: node.id.replace("detail_", ""),
        });
        if (sheet) {
          spreadsheets.push(sheet);
        }
      });
      gridApi.value!.exportMultipleSheetsAsExcel({
        data: spreadsheets,
        fileName: "ag-grid.xlsx",
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
      defaultColDef,
      getRowId,
      groupDefaultExpanded,
      rowBuffer,
      detailCellRendererParams,
      rowData,
      onGridReady,
      onFirstDataRendered,
      onBtExport,
    };
  },
});

createApp(VueExample).mount("#app");
