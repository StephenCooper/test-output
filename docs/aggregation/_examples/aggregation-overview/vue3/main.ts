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
  UseGroupTotalRow,
  ValidationModule,
} from "ag-grid-community";
import { ColumnMenuModule, RowGroupingModule } from "ag-grid-enterprise";
import { IOlympicData } from "./interfaces";
ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  ColumnMenuModule,
  RowGroupingModule,
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
      :grandTotalRow="grandTotalRow"
      :groupTotalRow="groupTotalRow"
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
      { field: "bronze", aggFunc: "sum" },
      { field: "silver", aggFunc: "2x+1" },
      { field: "gold", aggFunc: "avg" },
    ]);
    const defaultColDef = ref<ColDef>({
      flex: 1,
      minWidth: 100,
    });
    const autoGroupColumnDef = ref<ColDef>({
      minWidth: 200,
    });
    const grandTotalRow = ref<"top" | "bottom">("bottom");
    const groupTotalRow = ref<"top" | "bottom" | UseGroupTotalRow>("bottom");
    const aggFuncs = ref<{
      [key: string]: IAggFunc;
    }>({
      "2x+1": (params) => {
        const value = params.values[0];
        return 2 * value + 1;
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
      grandTotalRow,
      groupTotalRow,
      aggFuncs,
      rowData,
      onGridReady,
    };
  },
});

createApp(VueExample).mount("#app");
