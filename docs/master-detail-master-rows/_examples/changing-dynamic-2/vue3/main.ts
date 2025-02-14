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
  ClientSideRowModelApiModule,
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
  IsRowMaster,
  ModuleRegistry,
  RowApiModule,
  ValidationModule,
} from "ag-grid-community";
import {
  ColumnMenuModule,
  ColumnsToolPanelModule,
  ContextMenuModule,
  MasterDetailModule,
} from "ag-grid-enterprise";
import CallsCellRenderer from "./callsCellRendererVue";
ModuleRegistry.registerModules([
  RowApiModule,
  ClientSideRowModelModule,
  ClientSideRowModelApiModule,
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
      :isRowMaster="isRowMaster"
      :columnDefs="columnDefs"
      :defaultColDef="defaultColDef"
      :getRowId="getRowId"
      :detailCellRendererParams="detailCellRendererParams"
      :rowData="rowData"
      @first-data-rendered="onFirstDataRendered"></ag-grid-vue>
        </div>
    `,
  components: {
    "ag-grid-vue": AgGridVue,
    CallsCellRenderer,
  },
  setup(props) {
    const gridApi = shallowRef<GridApi | null>(null);
    const isRowMaster = ref<IsRowMaster>((dataItem: any) => {
      return dataItem ? dataItem.callRecords.length > 0 : false;
    });
    const columnDefs = ref<ColDef[]>([
      // group cell renderer needed for expand / collapse icons
      { field: "name", cellRenderer: "agGroupCellRenderer" },
      { field: "account" },
      { field: "calls", cellRenderer: "CallsCellRenderer" },
      { field: "minutes", valueFormatter: "x.toLocaleString() + 'm'" },
    ]);
    const defaultColDef = ref<ColDef>({
      flex: 1,
    });
    const getRowId = ref<GetRowIdFunc>((params: GetRowIdParams) =>
      String(params.data.account),
    );
    const detailCellRendererParams = ref<any>({
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
    const rowData = ref<any[]>(null);

    function onFirstDataRendered(params: FirstDataRenderedEvent) {
      // arbitrarily expand a row for presentational purposes
      setTimeout(() => {
        params.api.getDisplayedRowAtIndex(1)!.setExpanded(true);
      }, 0);
    }
    const onGridReady = (params: GridReadyEvent) => {
      gridApi.value = params.api;

      const updateData = (data) => {
        rowData.value = data;
      };

      fetch(
        "https://www.ag-grid.com/example-assets/master-detail-dynamic-data.json",
      )
        .then((resp) => resp.json())
        .then((data) => updateData(data));
    };

    return {
      gridApi,
      isRowMaster,
      columnDefs,
      defaultColDef,
      getRowId,
      detailCellRendererParams,
      rowData,
      onGridReady,
      onFirstDataRendered,
    };
  },
});

createApp(VueExample).mount("#app");
