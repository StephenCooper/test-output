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
  ISetFilterParams,
  ModuleRegistry,
  SetFilterValuesFuncParams,
  ValidationModule,
} from "ag-grid-community";
import {
  ColumnMenuModule,
  ColumnsToolPanelModule,
  ContextMenuModule,
  FiltersToolPanelModule,
  SetFilterModule,
} from "ag-grid-enterprise";
ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  ColumnsToolPanelModule,
  FiltersToolPanelModule,
  ColumnMenuModule,
  ContextMenuModule,
  SetFilterModule,
  ValidationModule /* Development Only */,
]);

const filterParams: ISetFilterParams = {
  values: (params: SetFilterValuesFuncParams) => {
    setTimeout(() => {
      params.success(["value 1", "value 2"]);
    }, 3000);
  },
};

const VueExample = defineComponent({
  template: `
        <div style="height: 100%">
                <ag-grid-vue
      style="width: 100%; height: 100%;"
      @grid-ready="onGridReady"
      :rowData="rowData"
      :columnDefs="columnDefs"></ag-grid-vue>
        </div>
    `,
  components: {
    "ag-grid-vue": AgGridVue,
  },
  setup(props) {
    const gridApi = shallowRef<GridApi | null>(null);
    const rowData = ref<any[] | null>([
      { value: "value 1" },
      { value: "value 1" },
      { value: "value 1" },
      { value: "value 1" },
      { value: "value 2" },
      { value: "value 2" },
      { value: "value 2" },
      { value: "value 2" },
      { value: "value 2" },
    ]);
    const columnDefs = ref<ColDef[]>([
      {
        headerName: "Set filter column",
        field: "value",
        flex: 1,
        filter: "agSetColumnFilter",
        floatingFilter: true,
        filterParams: filterParams,
      },
    ]);

    const onGridReady = (params: GridReadyEvent) => {
      gridApi.value = params.api;
    };

    return {
      gridApi,
      rowData,
      columnDefs,
      onGridReady,
    };
  },
});

createApp(VueExample).mount("#app");
