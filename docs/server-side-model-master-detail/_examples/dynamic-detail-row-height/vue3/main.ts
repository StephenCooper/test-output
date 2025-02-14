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
  GetDetailRowDataParams,
  GridApi,
  GridOptions,
  GridReadyEvent,
  IDetailCellRendererParams,
  IServerSideDatasource,
  ModuleRegistry,
  RenderApiModule,
  RowApiModule,
  RowHeightParams,
  RowModelType,
  ValidationModule,
  createGrid,
} from "ag-grid-community";
import {
  ColumnMenuModule,
  ColumnsToolPanelModule,
  ContextMenuModule,
  MasterDetailModule,
  ServerSideRowModelModule,
} from "ag-grid-enterprise";
import { FakeServer } from "./fakeServer";
ModuleRegistry.registerModules([
  RenderApiModule,
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
                <div style="height: 100%; box-sizing: border-box">
      <ag-grid-vue
        style="width: 100%; height: 100%;"
        @grid-ready="onGridReady"
        :columnDefs="columnDefs"
        :defaultColDef="defaultColDef"
        :rowModelType="rowModelType"
        :masterDetail="true"
        :detailCellRendererParams="detailCellRendererParams"
        :getRowHeight="getRowHeight"
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
      {
        field: "accountId",
        maxWidth: 200,
        cellRenderer: "agGroupCellRenderer",
      },
      { field: "name" },
      { field: "country" },
      { field: "calls" },
      { field: "totalDuration" },
    ]);
    const defaultColDef = ref<ColDef>({
      flex: 1,
    });
    const rowModelType = ref<RowModelType>("serverSide");
    const detailCellRendererParams = ref<any>({
      detailGridOptions: {
        columnDefs: [
          { field: "callId" },
          { field: "direction" },
          { field: "duration", valueFormatter: "x.toLocaleString() + 's'" },
          { field: "switchCode" },
          { field: "number" },
        ],
        domLayout: "autoHeight",
        defaultColDef: {
          flex: 1,
        },
      },
      getDetailRowData: (params: GetDetailRowDataParams) => {
        // supply details records to detail cell renderer (i.e. detail grid)
        params.successCallback(params.data.callRecords);
      },
    } as IDetailCellRendererParams<IAccount, ICallRecord>);
    const getRowHeight = ref<
      (params: RowHeightParams) => number | undefined | null
    >((params: RowHeightParams) => {
      if (params.node && params.node.detail) {
        const offset = 60;
        const sizes = params.api.getSizesForCurrentTheme() || {};
        const allDetailRowHeight =
          params.data.callRecords.length * sizes.rowHeight;
        return allDetailRowHeight + (sizes.headerHeight || 0) + offset;
      }
    });
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
        // setup the fake server with entire dataset
        const fakeServer = new FakeServer(data);
        // create datasource with a reference to the fake server
        const datasource = getServerSideDatasource(fakeServer);
        // register the datasource with the grid
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
      getRowHeight,
      rowData,
      onGridReady,
    };
  },
});

createApp(VueExample).mount("#app");
