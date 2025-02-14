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
  ColTypeDef,
  GetRowIdFunc,
  GetRowIdParams,
  GridApi,
  GridOptions,
  GridReadyEvent,
  HighlightChangesModule,
  ModuleRegistry,
  NumberEditorModule,
  RenderApiModule,
  RowApiModule,
  TextEditorModule,
  ValidationModule,
  ValueCacheModule,
  ValueFormatterParams,
  ValueGetterParams,
} from "ag-grid-community";
import { RowGroupingModule } from "ag-grid-enterprise";
import { getData } from "./data";
ModuleRegistry.registerModules([
  RowApiModule,
  RenderApiModule,
  NumberEditorModule,
  TextEditorModule,
  ValueCacheModule,
  HighlightChangesModule,
  CellStyleModule,
  ClientSideRowModelModule,
  RowGroupingModule,
  ValidationModule /* Development Only */,
]);

let callCount = 1;

const totalValueGetter = function (params: ValueGetterParams) {
  const q1 = params.getValue("q1");
  const q2 = params.getValue("q2");
  const q3 = params.getValue("q3");
  const q4 = params.getValue("q4");
  const result = q1 + q2 + q3 + q4;
  console.log(
    `Total Value Getter (${callCount}, ${params.column.getId()}): ${[q1, q2, q3, q4].join(", ")} = ${result}`,
  );
  callCount++;
  return result;
};

const total10ValueGetter = function (params: ValueGetterParams) {
  const total = params.getValue("total");
  return total * 10;
};

function formatNumber(params: ValueFormatterParams) {
  const number = params.value;
  return Math.floor(number).toLocaleString();
}

const VueExample = defineComponent({
  template: `
        <div style="height: 100%">
                <div class="example-wrapper">
      <div style="margin-bottom: 5px">
        <button v-on:click="onExpireValueCache()">Invalidate Value Cache</button>
        <button v-on:click="onRefreshCells()">Refresh Cells</button>
        <button v-on:click="onUpdateOneValue()">Update One Value</button>
      </div>
      <ag-grid-vue
        style="width: 100%; height: 100%;"
        @grid-ready="onGridReady"
        :columnDefs="columnDefs"
        :defaultColDef="defaultColDef"
        :autoGroupColumnDef="autoGroupColumnDef"
        :columnTypes="columnTypes"
        :rowData="rowData"
        :suppressAggFuncInHeader="true"
        :groupDefaultExpanded="groupDefaultExpanded"
        :valueCache="true"
        :getRowId="getRowId"
        @cell-value-changed="onCellValueChanged"></ag-grid-vue>
      </div>
        </div>
    `,
  components: {
    "ag-grid-vue": AgGridVue,
  },
  setup(props) {
    const gridApi = shallowRef<GridApi | null>(null);
    const columnDefs = ref<ColDef[]>([
      { field: "q1", type: "quarterFigure" },
      { field: "q2", type: "quarterFigure" },
      { field: "q3", type: "quarterFigure" },
      { field: "q4", type: "quarterFigure" },
      { field: "year", rowGroup: true, hide: true },
      {
        headerName: "Total",
        colId: "total",
        cellClass: ["number-cell", "total-col"],
        aggFunc: "sum",
        valueFormatter: formatNumber,
        valueGetter: totalValueGetter,
      },
      {
        headerName: "Total x 10",
        cellClass: ["number-cell", "total-col"],
        aggFunc: "sum",
        minWidth: 120,
        valueFormatter: formatNumber,
        valueGetter: total10ValueGetter,
      },
    ]);
    const defaultColDef = ref<ColDef>({
      flex: 1,
      enableCellChangeFlash: true,
    });
    const autoGroupColumnDef = ref<ColDef>({
      minWidth: 130,
    });
    const columnTypes = ref<{
      [key: string]: ColTypeDef;
    }>({
      quarterFigure: {
        editable: true,
        cellClass: "number-cell",
        aggFunc: "sum",
        valueFormatter: formatNumber,
        valueParser: function numberParser(params) {
          return Number(params.newValue);
        },
      },
    });
    const rowData = ref<any[] | null>(getData());
    const groupDefaultExpanded = ref(1);
    const getRowId = ref<GetRowIdFunc>((params: GetRowIdParams) => {
      return String(params.data.id);
    });

    function onCellValueChanged() {
      console.log("onCellValueChanged");
    }
    function onExpireValueCache() {
      console.log("onInvalidateValueCache -> start");
      gridApi.value!.expireValueCache();
      console.log("onInvalidateValueCache -> end");
    }
    function onRefreshCells() {
      console.log("onRefreshCells -> start");
      gridApi.value!.refreshCells();
      console.log("onRefreshCells -> end");
    }
    function onUpdateOneValue() {
      const randomId = Math.floor(Math.random() * 10) + "";
      const rowNode = gridApi.value!.getRowNode(randomId);
      if (rowNode) {
        const randomCol = ["q1", "q2", "q3", "q4"][
          Math.floor(Math.random() * 4)
        ];
        const newValue = Math.floor(Math.random() * 1000);
        console.log("onUpdateOneValue -> start");
        rowNode.setDataValue(randomCol, newValue);
        console.log("onUpdateOneValue -> end");
      }
    }
    const onGridReady = (params: GridReadyEvent) => {
      gridApi.value = params.api;
    };

    return {
      gridApi,
      columnDefs,
      defaultColDef,
      autoGroupColumnDef,
      columnTypes,
      rowData,
      groupDefaultExpanded,
      getRowId,
      onGridReady,
      onCellValueChanged,
      onExpireValueCache,
      onRefreshCells,
      onUpdateOneValue,
    };
  },
});

createApp(VueExample).mount("#app");
