import {
  createApp,
  defineComponent,
  onBeforeMount,
  ref,
  shallowRef,
} from "vue";
import { AgGridVue } from "ag-grid-vue3";
import {
  ColDef,
  ColGroupDef,
  CustomFilterModule,
  GridApi,
  GridOptions,
  GridReadyEvent,
  IServerSideDatasource,
  ModuleRegistry,
  NumberFilterModule,
  RowModelType,
  SideBarDef,
  ValidationModule,
} from "ag-grid-community";
import {
  ColumnMenuModule,
  ColumnsToolPanelModule,
  ContextMenuModule,
  FiltersToolPanelModule,
  RowGroupingModule,
  RowGroupingPanelModule,
  ServerSideRowModelModule,
  SetFilterModule,
} from "ag-grid-enterprise";
import { getCountries } from "./countries";
import { CustomAgeFilter } from "./customAgeFilter";
import { createFakeServer, createServerSideDatasource } from "./server";
import { IOlympicData } from "./interfaces";
ModuleRegistry.registerModules([
  NumberFilterModule,
  ColumnsToolPanelModule,
  FiltersToolPanelModule,
  ColumnMenuModule,
  ContextMenuModule,
  CustomFilterModule,
  RowGroupingModule,
  ServerSideRowModelModule,
  SetFilterModule,
  RowGroupingPanelModule,
  ValidationModule /* Development Only */,
]);

const countries = getCountries();

const VueExample = defineComponent({
  template: `
        <div style="height: 100%">
                <ag-grid-vue
      style="width: 100%; height: 100%;"
      @grid-ready="onGridReady"
      :columnDefs="columnDefs"
      :defaultColDef="defaultColDef"
      :autoGroupColumnDef="autoGroupColumnDef"
      :rowModelType="rowModelType"
      :rowGroupPanelShow="rowGroupPanelShow"
      :pivotPanelShow="pivotPanelShow"
      :sideBar="true"
      :maxConcurrentDatasourceRequests="maxConcurrentDatasourceRequests"
      :maxBlocksInCache="maxBlocksInCache"
      :purgeClosedRowNodes="true"
      :rowData="rowData"></ag-grid-vue>
        </div>
    `,
  components: {
    "ag-grid-vue": AgGridVue,
  },
  setup(props) {
    const gridApi = shallowRef<GridApi<IOlympicData> | null>(null);
    const columnDefs = ref<ColDef[]>([
      { field: "athlete", enableRowGroup: true, filter: false },
      {
        field: "age",
        enableRowGroup: true,
        enablePivot: true,
        filter: CustomAgeFilter,
      },
      {
        field: "country",
        enableRowGroup: true,
        enablePivot: true,
        rowGroup: true,
        hide: true,
        filter: "agSetColumnFilter",
        filterParams: { values: countries },
      },
      {
        field: "year",
        enableRowGroup: true,
        enablePivot: true,
        rowGroup: true,
        hide: true,
        filter: "agSetColumnFilter",
        filterParams: {
          values: ["2000", "2002", "2004", "2006", "2008", "2010", "2012"],
        },
      },
      {
        field: "sport",
        enableRowGroup: true,
        enablePivot: true,
        filter: false,
      },
      { field: "gold", aggFunc: "sum", filter: false, enableValue: true },
      { field: "silver", aggFunc: "sum", filter: false, enableValue: true },
      { field: "bronze", aggFunc: "sum", filter: false, enableValue: true },
    ]);
    const defaultColDef = ref<ColDef>({
      flex: 1,
      minWidth: 150,
      // restrict what aggregation functions the columns can have,
      // include a custom function 'random' that just returns a
      // random number
      allowedAggFuncs: ["sum", "min", "max", "random"],
      filter: true,
    });
    const autoGroupColumnDef = ref<ColDef>({
      width: 180,
    });
    const rowModelType = ref<RowModelType>("serverSide");
    const rowGroupPanelShow = ref<"always" | "onlyWhenGrouping" | "never">(
      "always",
    );
    const pivotPanelShow = ref<"always" | "onlyWhenPivoting" | "never">(
      "always",
    );
    const maxConcurrentDatasourceRequests = ref(1);
    const maxBlocksInCache = ref(2);
    const rowData = ref<IOlympicData[]>(null);

    const onGridReady = (params: GridReadyEvent) => {
      gridApi.value = params.api;

      const updateData = (data) => {
        const fakeServer = createFakeServer(data);
        const datasource = createServerSideDatasource(fakeServer);
        params.api!.setGridOption("serverSideDatasource", datasource);
      };

      fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
        .then((resp) => resp.json())
        .then((data) => updateData(data));
    };

    return {
      gridApi,
      columnDefs,
      defaultColDef,
      autoGroupColumnDef,
      rowModelType,
      rowGroupPanelShow,
      pivotPanelShow,
      maxConcurrentDatasourceRequests,
      maxBlocksInCache,
      rowData,
      onGridReady,
    };
  },
});

createApp(VueExample).mount("#app");
