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
  IDetailCellRendererParams,
  IServerSideDatasource,
  IServerSideGetRowsRequest,
  ModuleRegistry,
  RowApiModule,
  RowModelType,
  ValidationModule,
} from "ag-grid-community";
import {
  ColumnMenuModule,
  ColumnsToolPanelModule,
  ContextMenuModule,
  MasterDetailModule,
  ServerSideRowModelModule,
} from "ag-grid-enterprise";
ModuleRegistry.registerModules([
  RowApiModule,
  ClientSideRowModelModule,
  ColumnsToolPanelModule,
  MasterDetailModule,
  ColumnMenuModule,
  ContextMenuModule,
  ServerSideRowModelModule,
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
      }, 500);
    },
  };
}

function getFakeServer(allData: any) {
  return {
    getResponse: (request: IServerSideGetRowsRequest) => {
      console.log(
        "asking for rows: " + request.startRow + " to " + request.endRow,
      );
      // take a slice of the total rows
      const rowsThisPage = allData.slice(request.startRow, request.endRow);
      // if row count is known, it's possible to skip over blocks
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
                <div style="height: 100%; box-sizing: border-box">
      <ag-grid-vue
        style="width: 100%; height: 100%;"
        @grid-ready="onGridReady"
        :columnDefs="columnDefs"
        :defaultColDef="defaultColDef"
        :rowModelType="rowModelType"
        :masterDetail="true"
        :detailCellRendererParams="detailCellRendererParams"
        :rowData="rowData"></ag-grid-vue>
      </div>
        </div>
    `,
  components: {
    "ag-grid-vue": AgGridVue,
  },
  setup(props) {
    const gridApi = shallowRef<GridApi | null>(null);
    const columnDefs = ref<ColDef[]>([
      // group cell renderer needed for expand / collapse icons
      { field: "accountId", cellRenderer: "agGroupCellRenderer" },
      { field: "name" },
      { field: "country" },
      { field: "calls" },
      { field: "totalDuration" },
    ]);
    const defaultColDef = ref<ColDef>({
      flex: 1,
      sortable: false,
    });
    const rowModelType = ref<RowModelType>("serverSide");
    const detailCellRendererParams = ref<any>({
      detailGridOptions: {
        columnDefs: [
          { field: "callId" },
          { field: "direction" },
          { field: "duration", valueFormatter: "x.toLocaleString() + 's'" },
          { field: "switchCode", minWidth: 150 },
          { field: "number", minWidth: 180 },
        ],
        defaultColDef: {
          flex: 1,
        },
      },
      getDetailRowData: (params) => {
        // supply details records to detail cell renderer (i.e. detail grid)
        params.successCallback(params.data.callRecords);
      },
    } as IDetailCellRendererParams<IAccount, ICallRecord>);
    const rowData = ref<any[]>(null);

    const onGridReady = (params: GridReadyEvent) => {
      gridApi.value = params.api;

      setTimeout(() => {
        // expand some master row
        const someRow = params.api.getRowNode("1");
        if (someRow) {
          someRow.setExpanded(true);
        }
      }, 1000);

      const updateData = (data) => {
        const server = getFakeServer(data);
        const datasource = getServerSideDatasource(server);
        params.api!.setGridOption("serverSideDatasource", datasource);
      };

      fetch("https://www.ag-grid.com/example-assets/call-data.json")
        .then((resp) => resp.json())
        .then((data) => updateData(data));
    };

    return {
      gridApi,
      columnDefs,
      defaultColDef,
      rowModelType,
      detailCellRendererParams,
      rowData,
      onGridReady,
    };
  },
});

createApp(VueExample).mount("#app");
