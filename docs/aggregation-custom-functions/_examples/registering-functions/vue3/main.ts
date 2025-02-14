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
  IAggFunc,
  IAggFuncParams,
  ModuleRegistry,
  ValidationModule,
  ValueFormatterParams,
  ValueGetterParams,
} from "ag-grid-community";
import {
  ColumnMenuModule,
  ColumnsToolPanelModule,
  ContextMenuModule,
  FiltersToolPanelModule,
  RowGroupingModule,
  SetFilterModule,
} from "ag-grid-enterprise";
import { IOlympicData } from "./interfaces";
ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  ColumnsToolPanelModule,
  FiltersToolPanelModule,
  ColumnMenuModule,
  ContextMenuModule,
  RowGroupingModule,
  SetFilterModule,
  ValidationModule /* Development Only */,
]);

function ratioValueGetter(params: ValueGetterParams<IOlympicData>) {
  if (!(params.node && params.node.group)) {
    // no need to handle group levels - calculated in the 'ratioAggFunc'
    return createValueObject(params.data!.gold, params.data!.silver);
  }
}

function ratioAggFunc(params: IAggFuncParams) {
  let goldSum = 0;
  let silverSum = 0;
  params.values.forEach((value) => {
    if (value && value.gold) {
      goldSum += value.gold;
    }
    if (value && value.silver) {
      silverSum += value.silver;
    }
  });
  return createValueObject(goldSum, silverSum);
}

function createValueObject(gold: number, silver: number) {
  return {
    gold: gold,
    silver: silver,
    toString: () => `${gold && silver ? gold / silver : 0}`,
  };
}

function ratioFormatter(params: ValueFormatterParams) {
  if (!params.value || params.value === 0) return "";
  return "" + Math.round(params.value * 100) / 100;
}

const VueExample = defineComponent({
  template: `
        <div style="height: 100%">
                <ag-grid-vue
      style="width: 100%; height: 100%;"
      @grid-ready="onGridReady"
      :columnDefs="columnDefs"
      :aggFuncs="aggFuncs"
      :defaultColDef="defaultColDef"
      :autoGroupColumnDef="autoGroupColumnDef"
      :rowData="rowData"></ag-grid-vue>
        </div>
    `,
  components: {
    "ag-grid-vue": AgGridVue,
  },
  setup(props) {
    const gridApi = shallowRef<GridApi<IOlympicData> | null>(null);
    const columnDefs = ref<ColDef[]>([
      { field: "country", rowGroup: true, hide: true },
      { field: "total", aggFunc: "range" },
      {
        headerName: "Gold to Silver",
        colId: "goldSilverRatio",
        aggFunc: "ratio",
        valueGetter: ratioValueGetter,
        valueFormatter: ratioFormatter,
      },
    ]);
    const aggFuncs = ref<{
      [key: string]: IAggFunc;
    }>({
      range: (params) => {
        const values = params.values;
        return values.length > 0
          ? Math.max(...values) - Math.min(...values)
          : null;
      },
      ratio: ratioAggFunc,
    });
    const defaultColDef = ref<ColDef>({
      flex: 1,
      minWidth: 150,
    });
    const autoGroupColumnDef = ref<ColDef>({
      minWidth: 220,
    });
    const rowData = ref<IOlympicData[]>(null);

    const onGridReady = (params: GridReadyEvent) => {
      gridApi.value = params.api;

      const updateData = (data) => (rowData.value = data);

      fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
        .then((resp) => resp.json())
        .then((data) => updateData(data));
    };

    return {
      gridApi,
      columnDefs,
      aggFuncs,
      defaultColDef,
      autoGroupColumnDef,
      rowData,
      onGridReady,
    };
  },
});

createApp(VueExample).mount("#app");
