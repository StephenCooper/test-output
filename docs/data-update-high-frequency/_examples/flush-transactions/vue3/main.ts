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
  AsyncTransactionsFlushedEvent,
  CellStyleModule,
  ClientSideRowModelApiModule,
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  GetRowIdFunc,
  GetRowIdParams,
  GridApi,
  GridOptions,
  GridReadyEvent,
  HighlightChangesModule,
  ModuleRegistry,
  ValidationModule,
  ValueFormatterParams,
} from "ag-grid-community";
import { RowGroupingModule, RowGroupingPanelModule } from "ag-grid-enterprise";
import { getData, globalRowData } from "./data";
ModuleRegistry.registerModules([
  ClientSideRowModelApiModule,
  CellStyleModule,
  ClientSideRowModelModule,
  RowGroupingModule,
  RowGroupingPanelModule,
  HighlightChangesModule,
  ValidationModule /* Development Only */,
]);

const UPDATE_COUNT = 20;

function numberCellFormatter(params: ValueFormatterParams) {
  return Math.floor(params.value)
    .toString()
    .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
}

function startFeed(api: GridApi) {
  let count = 1;
  setInterval(() => {
    const thisCount = count++;
    const updatedIndexes: any = {};
    const newItems: any[] = [];
    for (let i = 0; i < UPDATE_COUNT; i++) {
      // pick one index at random
      const index = Math.floor(Math.random() * globalRowData.length);
      // dont do same index twice, otherwise two updates for same row in one transaction
      if (updatedIndexes[index]) {
        continue;
      }
      const itemToUpdate = globalRowData[index];
      const newItem: any = copyObject(itemToUpdate);
      // copy previous to current value
      newItem.previous = newItem.current;
      // then create new current value
      newItem.current = Math.floor(Math.random() * 100000) + 100;
      newItems.push(newItem);
    }
    const resultCallback = () => {
      console.log("transactionApplied() - " + thisCount);
    };
    api.applyTransactionAsync({ update: newItems }, resultCallback);
    console.log("applyTransactionAsync() - " + thisCount);
  }, 500);
}

// makes a copy of the original and merges in the new values
function copyObject(object: any) {
  // start with new object
  const newObject: any = {};
  // copy in the old values
  Object.keys(object).forEach((key) => {
    newObject[key] = object[key];
  });
  return newObject;
}

const VueExample = defineComponent({
  template: `
        <div style="height: 100%">
                <div class="example-wrapper">
      <div style="margin-bottom: 5px">
        <button v-on:click="onFlushTransactions()">Flush Transactions</button>
        <span id="eMessage"></span>
      </div>
      <ag-grid-vue
        style="width: 100%; height: 100%;"
        @grid-ready="onGridReady"
        :columnDefs="columnDefs"
        :suppressAggFuncInHeader="true"
        :rowGroupPanelShow="rowGroupPanelShow"
        :asyncTransactionWaitMillis="asyncTransactionWaitMillis"
        :getRowId="getRowId"
        :defaultColDef="defaultColDef"
        :autoGroupColumnDef="autoGroupColumnDef"
        :rowData="rowData"
        @async-transactions-flushed="onAsyncTransactionsFlushed"></ag-grid-vue>
      </div>
        </div>
    `,
  components: {
    "ag-grid-vue": AgGridVue,
  },
  setup(props) {
    const gridApi = shallowRef<GridApi | null>(null);
    const columnDefs = ref<ColDef[]>([
      // these are the row groups, so they are all hidden (they are show in the group column)
      {
        headerName: "Product",
        field: "product",
        enableRowGroup: true,
        rowGroupIndex: 0,
        hide: true,
      },
      {
        headerName: "Portfolio",
        field: "portfolio",
        enableRowGroup: true,
        rowGroupIndex: 1,
        hide: true,
      },
      {
        headerName: "Book",
        field: "book",
        enableRowGroup: true,
        rowGroupIndex: 2,
        hide: true,
      },
      { headerName: "Trade", field: "trade", width: 100 },
      // all the other columns (visible and not grouped)
      {
        headerName: "Current",
        field: "current",
        width: 200,
        aggFunc: "sum",
        enableValue: true,
        cellClass: "number",
        valueFormatter: numberCellFormatter,
        cellRenderer: "agAnimateShowChangeCellRenderer",
      },
      {
        headerName: "Previous",
        field: "previous",
        width: 200,
        aggFunc: "sum",
        enableValue: true,
        cellClass: "number",
        valueFormatter: numberCellFormatter,
        cellRenderer: "agAnimateShowChangeCellRenderer",
      },
      {
        headerName: "Deal Type",
        field: "dealType",
        enableRowGroup: true,
      },
      {
        headerName: "Bid",
        field: "bidFlag",
        enableRowGroup: true,
        width: 100,
      },
      {
        headerName: "PL 1",
        field: "pl1",
        width: 200,
        aggFunc: "sum",
        enableValue: true,
        cellClass: "number",
        valueFormatter: numberCellFormatter,
        cellRenderer: "agAnimateShowChangeCellRenderer",
      },
      {
        headerName: "PL 2",
        field: "pl2",
        width: 200,
        aggFunc: "sum",
        enableValue: true,
        cellClass: "number",
        valueFormatter: numberCellFormatter,
        cellRenderer: "agAnimateShowChangeCellRenderer",
      },
      {
        headerName: "Gain-DX",
        field: "gainDx",
        width: 200,
        aggFunc: "sum",
        enableValue: true,
        cellClass: "number",
        valueFormatter: numberCellFormatter,
        cellRenderer: "agAnimateShowChangeCellRenderer",
      },
      {
        headerName: "SX / PX",
        field: "sxPx",
        width: 200,
        aggFunc: "sum",
        enableValue: true,
        cellClass: "number",
        valueFormatter: numberCellFormatter,
        cellRenderer: "agAnimateShowChangeCellRenderer",
      },
      {
        headerName: "99 Out",
        field: "_99Out",
        width: 200,
        aggFunc: "sum",
        enableValue: true,
        cellClass: "number",
        valueFormatter: numberCellFormatter,
        cellRenderer: "agAnimateShowChangeCellRenderer",
      },
      {
        headerName: "Submitter ID",
        field: "submitterID",
        width: 200,
        aggFunc: "sum",
        enableValue: true,
        cellClass: "number",
        valueFormatter: numberCellFormatter,
        cellRenderer: "agAnimateShowChangeCellRenderer",
      },
      {
        headerName: "Submitted Deal ID",
        field: "submitterDealID",
        width: 200,
        aggFunc: "sum",
        enableValue: true,
        cellClass: "number",
        valueFormatter: numberCellFormatter,
        cellRenderer: "agAnimateShowChangeCellRenderer",
      },
    ]);
    const rowGroupPanelShow = ref<"always" | "onlyWhenGrouping" | "never">(
      "always",
    );
    const asyncTransactionWaitMillis = ref(4000);
    const getRowId = ref<GetRowIdFunc>((params: GetRowIdParams) =>
      String(params.data.trade),
    );
    const defaultColDef = ref<ColDef>({
      width: 120,
    });
    const autoGroupColumnDef = ref<ColDef>({
      width: 250,
    });
    const rowData = ref<any[]>(null);

    function onAsyncTransactionsFlushed(e: AsyncTransactionsFlushedEvent) {
      console.log(
        "========== onAsyncTransactionsFlushed: applied " +
          e.results.length +
          " transactions",
      );
    }
    function onFlushTransactions() {
      gridApi.value!.flushAsyncTransactions();
    }
    const onGridReady = (params: GridReadyEvent) => {
      gridApi.value = params.api;

      getData();
      params.api.setGridOption("rowData", globalRowData);
      startFeed(params.api);
    };

    return {
      gridApi,
      columnDefs,
      rowGroupPanelShow,
      asyncTransactionWaitMillis,
      getRowId,
      defaultColDef,
      autoGroupColumnDef,
      rowData,
      onGridReady,
      onAsyncTransactionsFlushed,
      onFlushTransactions,
    };
  },
});

createApp(VueExample).mount("#app");
