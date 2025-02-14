import {
  createApp,
  defineComponent,
  onBeforeMount,
  ref,
  shallowRef,
} from "vue";
import { AgGridVue } from "ag-grid-vue3";
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
import { IAccount } from "./interfaces";
ModuleRegistry.registerModules([
  ClientSideRowModelApiModule,
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
                <div style="display: flex; flex-direction: column; height: 100%">
      <div style="padding-bottom: 4px">
        <button v-on:click="onBtClearMilaCalls()">Clear Mila Calls</button>
        <button v-on:click="onBtSetMilaCalls()">Set Mila Calls</button>
      </div>
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
        </div>
    `,
  components: {
    "ag-grid-vue": AgGridVue,
  },
  setup(props) {
    const gridApi = shallowRef<GridApi<IAccount> | null>(null);
    const isRowMaster = ref<IsRowMaster>((dataItem: any) => {
      return dataItem ? dataItem.callRecords.length > 0 : false;
    });
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
    const getRowId = ref<GetRowIdFunc>((params: GetRowIdParams) =>
      String(params.data.account),
    );
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
      // arbitrarily expand a row for presentational purposes
      setTimeout(() => {
        params.api.getDisplayedRowAtIndex(1)!.setExpanded(true);
      }, 0);
    }
    function onBtClearMilaCalls() {
      const milaSmithRowNode = gridApi.value!.getRowNode("177001")!;
      const milaSmithData = milaSmithRowNode.data!;
      milaSmithData.callRecords = [];
      milaSmithData.calls = milaSmithData.callRecords.length;
      gridApi.value!.applyTransaction({ update: [milaSmithData] });
    }
    function onBtSetMilaCalls() {
      const milaSmithRowNode = gridApi.value!.getRowNode("177001")!;
      const milaSmithData = milaSmithRowNode.data!;
      milaSmithData.callRecords = [
        {
          name: "susan",
          callId: 579,
          duration: 23,
          switchCode: "SW5",
          direction: "Out",
          number: "(02) 47485405",
        },
        {
          name: "susan",
          callId: 580,
          duration: 52,
          switchCode: "SW3",
          direction: "In",
          number: "(02) 32367069",
        },
      ];
      milaSmithData.calls = milaSmithData.callRecords.length;
      gridApi.value!.applyTransaction({ update: [milaSmithData] });
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
      onBtClearMilaCalls,
      onBtSetMilaCalls,
    };
  },
});

createApp(VueExample).mount("#app");
