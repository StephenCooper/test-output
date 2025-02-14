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
} from "ag-grid-community";
import {
  RowGroupingModule,
  ServerSideRowModelModule,
} from "ag-grid-enterprise";
import CustomLoadingCellRenderer from "./customLoadingCellRendererVue";
import { IOlympicData } from "./interfaces";
ModuleRegistry.registerModules([
  ServerSideRowModelModule,
  RowGroupingModule,
  ValidationModule /* Development Only */,
]);

function getServerSideDatasource(server: any): IServerSideDatasource {
  return {
    getRows: (params) => {
      // adding delay to simulate real server call
      setTimeout(() => {
        const response = server.getResponse(params.request);
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

function getFakeServer(allData: any[]): any {
  return {
    getResponse: (request: IServerSideGetRowsRequest) => {
      console.log(
        "asking for rows: " + request.startRow + " to " + request.endRow,
      );
      // take a slice of the total rows
      const rowsThisPage = allData.slice(request.startRow, request.endRow);
      const lastRow = allData.length;
      return {
        success: true,
        rows: rowsThisPage,
        lastRow: lastRow,
      };
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
      :rowModelType="rowModelType"
      :cacheBlockSize="cacheBlockSize"
      :maxBlocksInCache="maxBlocksInCache"
      :rowBuffer="rowBuffer"
      :maxConcurrentDatasourceRequests="maxConcurrentDatasourceRequests"
      :blockLoadDebounceMillis="blockLoadDebounceMillis"
      :suppressServerSideFullWidthLoadingRow="true"
      :rowData="rowData"></ag-grid-vue>
        </div>
    `,
  components: {
    "ag-grid-vue": AgGridVue,
    CustomLoadingCellRenderer,
  },
  setup(props) {
    const gridApi = shallowRef<GridApi<IOlympicData> | null>(null);
    const columnDefs = ref<ColDef[]>([
      {
        field: "country",
        flex: 4,
        loadingCellRenderer: "CustomLoadingCellRenderer",
      },
      { field: "sport", flex: 4 },
      { field: "year", flex: 3 },
      { field: "gold", aggFunc: "sum", flex: 2 },
      { field: "silver", aggFunc: "sum", flex: 2 },
      { field: "bronze", aggFunc: "sum", flex: 2 },
    ]);
    const defaultColDef = ref<ColDef>({
      loadingCellRenderer: () => "",
      minWidth: 75,
    });
    const rowModelType = ref<RowModelType>("serverSide");
    const cacheBlockSize = ref(5);
    const maxBlocksInCache = ref(0);
    const rowBuffer = ref(0);
    const maxConcurrentDatasourceRequests = ref(1);
    const blockLoadDebounceMillis = ref(200);
    const rowData = ref<IOlympicData[]>(null);

    const onGridReady = (params: GridReadyEvent) => {
      gridApi.value = params.api;

      const updateData = (data) => {
        // add id to data
        let idSequence = 0;
        data.forEach((item: any) => {
          item.id = idSequence++;
        });
        const server: any = getFakeServer(data);
        const datasource: IServerSideDatasource =
          getServerSideDatasource(server);
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
      rowModelType,
      cacheBlockSize,
      maxBlocksInCache,
      rowBuffer,
      maxConcurrentDatasourceRequests,
      blockLoadDebounceMillis,
      rowData,
      onGridReady,
    };
  },
});

createApp(VueExample).mount("#app");
