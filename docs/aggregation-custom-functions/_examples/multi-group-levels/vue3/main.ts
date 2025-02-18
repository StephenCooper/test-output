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
  ModuleRegistry,
  ValidationModule,
} from "ag-grid-community";
import {
  ColumnMenuModule,
  ColumnsToolPanelModule,
  ContextMenuModule,
  RowGroupingModule,
  SetFilterModule,
} from "ag-grid-enterprise";
import { IOlympicData } from "./interfaces";
ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  ColumnsToolPanelModule,
  ColumnMenuModule,
  ContextMenuModule,
  RowGroupingModule,
  SetFilterModule,
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
      :autoGroupColumnDef="autoGroupColumnDef"
      :aggFuncs="aggFuncs"
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
      { field: "year", rowGroup: true, hide: true },
      { field: "total", aggFunc: "simpleRange" },
      { field: "total", aggFunc: "range" },
    ]);
    const defaultColDef = ref<ColDef>({
      flex: 1,
      minWidth: 150,
    });
    const autoGroupColumnDef = ref<ColDef>({
      minWidth: 220,
    });
    const aggFuncs = ref<{
      [key: string]: IAggFunc;
    }>({
      simpleRange: (params) => {
        const values = params.values;
        const max = Math.max(...values);
        const min = Math.min(...values);
        return max - min;
      },
      range: (params) => {
        const values = params.values;
        if (params.rowNode.leafGroup) {
          const max = Math.max(...values);
          const min = Math.min(...values);
          return {
            max: max,
            min: min,
            value: max - min,
          };
        }
        let max = values[0].max;
        let min = values[0].min;
        values.forEach((value) => {
          max = Math.max(max, value.max);
          min = Math.min(min, value.min);
        });
        return {
          max: max,
          min: min,
          value: max - min,
        };
      },
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
      defaultColDef,
      autoGroupColumnDef,
      aggFuncs,
      rowData,
      onGridReady,
    };
  },
});

createApp(VueExample).mount("#app");
