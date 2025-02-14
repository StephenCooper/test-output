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
  IServerSideGetRowsRequest,
  ModuleRegistry,
  RowModelType,
  ValidationModule,
  createGrid,
} from "ag-grid-community";
import { ServerSideRowModelModule } from "ag-grid-enterprise";
import { IOlympicDataWithId } from "./interfaces";
ModuleRegistry.registerModules([
  ServerSideRowModelModule,
  ValidationModule /* Development Only */,
]);

function createServerSideDatasource(server: any): IServerSideDatasource {
  return {
    getRows: (params) => {
      console.log("[Datasource] - rows requested by grid: ", params.request);
      // get data for request from our fake server
      const response = server.getData(params.request);
      // simulating real server call with a 500ms delay
      setTimeout(() => {
        if (response.success) {
          // supply rows for requested block to grid
          params.success({
            rowData: response.rows,
            rowCount: response.lastRow,
          });
        } else {
          params.fail();
        }
      }, 500);
    },
  };
}

function createFakeServer(allData: any[]) {
  return {
    getData: (request: IServerSideGetRowsRequest) => {
      // take a slice of the total rows for requested block
      const rowsForBlock = allData.slice(request.startRow, request.endRow);
      // here we are pretending we don't know the last row until we reach it!
      const lastRow = getLastRowIndex(request, rowsForBlock);
      return {
        success: true,
        rows: rowsForBlock,
        lastRow: lastRow,
      };
    },
  };
}

function getLastRowIndex(request: IServerSideGetRowsRequest, results: any[]) {
  if (!results) return undefined;
  const currentLastRow = (request.startRow || 0) + results.length;
  // if on or after the last block, work out the last row, otherwise return 'undefined'
  return currentLastRow < (request.endRow || 0) ? currentLastRow : undefined;
}

const VueExample = defineComponent({
  template: `
        <div style="height: 100%">
                <ag-grid-vue
      style="width: 100%; height: 100%;"
      @grid-ready="onGridReady"
      :columnDefs="columnDefs"
      :defaultColDef="defaultColDef"
      :rowBuffer="rowBuffer"
      :rowModelType="rowModelType"
      :cacheBlockSize="cacheBlockSize"
      :maxBlocksInCache="maxBlocksInCache"
      :rowData="rowData"></ag-grid-vue>
        </div>
    `,
  components: {
    "ag-grid-vue": AgGridVue,
  },
  setup(props) {
    const gridApi = shallowRef<GridApi<IOlympicDataWithId> | null>(null);
    const columnDefs = ref<ColDef[]>([
      { field: "id", maxWidth: 80 },
      { field: "athlete", minWidth: 220 },
      { field: "country", minWidth: 200 },
      { field: "year" },
      { field: "sport", minWidth: 200 },
      { field: "gold" },
      { field: "silver" },
      { field: "bronze" },
    ]);
    const defaultColDef = ref<ColDef>({
      flex: 1,
      minWidth: 100,
      sortable: false,
    });
    const rowBuffer = ref(0);
    const rowModelType = ref<RowModelType>("serverSide");
    const cacheBlockSize = ref(50);
    const maxBlocksInCache = ref(2);
    const rowData = ref<IOlympicDataWithId[]>(null);

    const onGridReady = (params: GridReadyEvent) => {
      gridApi.value = params.api;

      const updateData = (data) => {
        // adding row id to data
        let idSequence = 0;
        data.forEach(function (item: any) {
          item.id = idSequence++;
        });
        // setup the fake server with entire dataset
        const fakeServer = createFakeServer(data);
        // create datasource with a reference to the fake server
        const datasource = createServerSideDatasource(fakeServer);
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
      rowBuffer,
      rowModelType,
      cacheBlockSize,
      maxBlocksInCache,
      rowData,
      onGridReady,
    };
  },
});

createApp(VueExample).mount("#app");
