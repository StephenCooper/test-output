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
  NumberEditorModule,
  NumberFilterModule,
  RowModelType,
  TextEditorModule,
  TextFilterModule,
  ValidationModule,
  createGrid,
} from "ag-grid-community";
import { ServerSideRowModelModule } from "ag-grid-enterprise";
import CustomLoadingCellRenderer from "./customLoadingCellRendererVue";
import { IOlympicData } from "./interfaces";
ModuleRegistry.registerModules([
  NumberEditorModule,
  TextEditorModule,
  TextFilterModule,
  NumberFilterModule,
  ServerSideRowModelModule,
  ValidationModule /* Development Only */,
]);

function getServerSideDatasource(server: any): IServerSideDatasource {
  return {
    getRows: (params) => {
      // adding delay to simulate real server call
      setTimeout(() => {
        // Fail loading to display failed loading cell renderer
        params.fail();
      }, 4000);
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
      // if on or after the last page, work out the last row.
      const lastRow =
        allData.length <= (request.endRow || 0) ? allData.length : -1;
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
                <div style="height: 100%; padding-top: 25px; box-sizing: border-box">
      <ag-grid-vue
        style="width: 100%; height: 100%;"
        @grid-ready="onGridReady"
        :columnDefs="columnDefs"
        :defaultColDef="defaultColDef"
        :loadingCellRenderer="loadingCellRenderer"
        :loadingCellRendererParams="loadingCellRendererParams"
        :rowModelType="rowModelType"
        :cacheBlockSize="cacheBlockSize"
        :serverSideInitialRowCount="serverSideInitialRowCount"
        :rowData="rowData"></ag-grid-vue>
      </div>
        </div>
    `,
  components: {
    "ag-grid-vue": AgGridVue,
    CustomLoadingCellRenderer,
  },
  setup(props) {
    const gridApi = shallowRef<GridApi<IOlympicData> | null>(null);
    const columnDefs = ref<ColDef[]>([
      { field: "id" },
      { field: "athlete", width: 150 },
      { field: "age" },
      { field: "country" },
      { field: "year" },
      { field: "sport" },
      { field: "gold" },
      { field: "silver" },
      { field: "bronze" },
    ]);
    const defaultColDef = ref<ColDef>({
      editable: true,
      flex: 1,
      minWidth: 100,
      filter: true,
    });
    const loadingCellRenderer = ref("CustomLoadingCellRenderer");
    const loadingCellRendererParams = ref({
      loadingMessage: "One moment please...",
    });
    const rowModelType = ref<RowModelType>("serverSide");
    const cacheBlockSize = ref(10);
    const serverSideInitialRowCount = ref(10);
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
      loadingCellRenderer,
      loadingCellRendererParams,
      rowModelType,
      cacheBlockSize,
      serverSideInitialRowCount,
      rowData,
      onGridReady,
    };
  },
});

createApp(VueExample).mount("#app");
