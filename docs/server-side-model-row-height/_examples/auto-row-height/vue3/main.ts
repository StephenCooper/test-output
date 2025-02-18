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
  RowAutoHeightModule,
  RowModelType,
  ValidationModule,
} from "ag-grid-community";
import {
  RowGroupingModule,
  ServerSideRowModelModule,
} from "ag-grid-enterprise";
import { getData } from "./data";
import { FakeServer } from "./fakeServer";
ModuleRegistry.registerModules([
  RowAutoHeightModule,
  RowGroupingModule,
  ServerSideRowModelModule,
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
      }, 200);
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
      :rowModelType="rowModelType"
      :suppressAggFuncInHeader="true"
      :rowData="rowData"></ag-grid-vue>
        </div>
    `,
  components: {
    "ag-grid-vue": AgGridVue,
  },
  setup(props) {
    const gridApi = shallowRef<GridApi | null>(null);
    const columnDefs = ref<ColDef[]>([
      {
        headerName: "Group",
        field: "name",
        rowGroup: true,
        hide: true,
      },
      {
        field: "autoA",
        wrapText: true,
        autoHeight: true,
        aggFunc: "last",
      },
      {
        field: "autoB",
        wrapText: true,
        autoHeight: true,
        aggFunc: "last",
      },
    ]);
    const defaultColDef = ref<ColDef>({
      flex: 1,
    });
    const autoGroupColumnDef = ref<ColDef>({
      flex: 1,
      maxWidth: 200,
    });
    const rowModelType = ref<RowModelType>("serverSide");
    const rowData = ref<any[]>(null);

    const onGridReady = (params: GridReadyEvent) => {
      gridApi.value = params.api;

      // generate data for example
      const data = getData();
      // setup the fake server with entire dataset
      const fakeServer = new FakeServer(data);
      // create datasource with a reference to the fake server
      const datasource = getServerSideDatasource(fakeServer);
      // register the datasource with the grid
      params.api.setGridOption("serverSideDatasource", datasource);
    };

    return {
      gridApi,
      columnDefs,
      defaultColDef,
      autoGroupColumnDef,
      rowModelType,
      rowData,
      onGridReady,
    };
  },
});

createApp(VueExample).mount("#app");
