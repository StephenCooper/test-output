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
  IDetailCellRendererParams,
  ModuleRegistry,
  RowApiModule,
  RowSelectionModule,
  RowSelectionOptions,
  ValidationModule,
} from "ag-grid-community";
import {
  ColumnMenuModule,
  ContextMenuModule,
  MasterDetailModule,
} from "ag-grid-enterprise";
import { IAccount } from "./interfaces";
ModuleRegistry.registerModules([
  RowApiModule,
  ClientSideRowModelModule,
  RowSelectionModule,
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
      :columnDefs="columnDefs"
      :defaultColDef="defaultColDef"
      :masterDetail="true"
      :detailCellRendererParams="detailCellRendererParams"
      :rowSelection="rowSelection"
      :rowData="rowData"
      @first-data-rendered="onFirstDataRendered"></ag-grid-vue>
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
        rowSelection: {
          mode: "multiRow",
        },
      },
      getDetailRowData: (params) => {
        params.successCallback(params.data.callRecords);
      },
    } as IDetailCellRendererParams<IAccount, ICallRecord>);
    const rowSelection = ref<RowSelectionOptions | "single" | "multiple">({
      mode: "multiRow",
      masterSelects: "detail",
    });
    const rowData = ref<IAccount[]>(null);

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

      fetch("https://www.ag-grid.com/example-assets/master-detail-data.json")
        .then((resp) => resp.json())
        .then((data) => updateData(data));
    };

    return {
      gridApi,
      columnDefs,
      defaultColDef,
      detailCellRendererParams,
      rowSelection,
      rowData,
      onGridReady,
      onFirstDataRendered,
    };
  },
});

createApp(VueExample).mount("#app");
