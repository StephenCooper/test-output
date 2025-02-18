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
  GridApi,
  GridOptions,
  GridReadyEvent,
  IServerSideDatasource,
  ModuleRegistry,
  NumberFilterModule,
  RowModelType,
  TextFilterModule,
  ValidationModule,
} from "ag-grid-community";
import {
  RowGroupingModule,
  ServerSideRowModelModule,
} from "ag-grid-enterprise";
import { FakeServer } from "./fakeServer";
import { IOlympicData } from "./interfaces";
ModuleRegistry.registerModules([
  TextFilterModule,
  RowGroupingModule,
  ServerSideRowModelModule,
  NumberFilterModule,
  ValidationModule /* Development Only */,
]);

function getServerSideDatasource(server: any): IServerSideDatasource {
  return {
    getRows: (params) => {
      console.log("[Datasource] - rows requested by grid: ", params.request);
      const response = server.getData(params.request);
      // adding delay to simulate real server call
      setTimeout(() => {
        if (response.success) {
          // call the success callback
          params.success({
            rowData: response.rows,
            rowCount: response.lastRow,
          });
        } else {
          // inform the grid request failed
          params.fail();
        }
      }, 1000);
    },
  };
}

const VueExample = defineComponent({
  template: `
        <div style="height: 100%">
                <ag-grid-vue
      style="width: 100%; height: 100%;"
      @grid-ready="onGridReady"
      :columnDefs="columnDefs"
      :defaultColDef="defaultColDef"
      :autoGroupColumnDef="autoGroupColumnDef"
      :serverSideOnlyRefreshFilteredGroups="true"
      :rowModelType="rowModelType"
      :cacheBlockSize="cacheBlockSize"
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
      { field: "sport", rowGroup: true, hide: true },
      {
        field: "year",
        minWidth: 100,
        filter: "agNumberColumnFilter",
        floatingFilter: true,
      },
      {
        field: "gold",
        aggFunc: "sum",
        filter: "agNumberColumnFilter",
        floatingFilter: true,
        enableValue: true,
      },
      {
        field: "silver",
        aggFunc: "sum",
        filter: "agNumberColumnFilter",
        floatingFilter: true,
        enableValue: true,
      },
      {
        field: "bronze",
        aggFunc: "sum",
        filter: "agNumberColumnFilter",
        floatingFilter: true,
        enableValue: true,
      },
    ]);
    const defaultColDef = ref<ColDef>({
      flex: 1,
      minWidth: 120,
    });
    const autoGroupColumnDef = ref<ColDef>({
      flex: 1,
      minWidth: 280,
      field: "athlete",
    });
    const rowModelType = ref<RowModelType>("serverSide");
    const cacheBlockSize = ref(5);
    const rowData = ref<IOlympicData[]>(null);

    const onGridReady = (params: GridReadyEvent) => {
      gridApi.value = params.api;

      const updateData = (data) => {
        // setup the fake server with entire dataset
        const fakeServer = new FakeServer(data);
        // create datasource with a reference to the fake server
        const datasource = getServerSideDatasource(fakeServer);
        // register the datasource with the grid
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
      cacheBlockSize,
      rowData,
      onGridReady,
    };
  },
});

createApp(VueExample).mount("#app");
