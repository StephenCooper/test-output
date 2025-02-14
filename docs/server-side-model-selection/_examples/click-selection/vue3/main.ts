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
  GetRowIdFunc,
  GridApi,
  GridOptions,
  GridReadyEvent,
  IServerSideDatasource,
  ModuleRegistry,
  NumberFilterModule,
  RowModelType,
  RowSelectionOptions,
  TextFilterModule,
  ValidationModule,
} from "ag-grid-community";
import {
  RowGroupingModule,
  ServerSideRowModelModule,
} from "ag-grid-enterprise";
import { FakeServer } from "./fakeServer";
import { IOlympicDataWithId } from "./interfaces";
ModuleRegistry.registerModules([
  RowGroupingModule,
  ServerSideRowModelModule,
  TextFilterModule,
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
      :getRowId="getRowId"
      :rowModelType="rowModelType"
      :rowSelection="rowSelection"
      :suppressAggFuncInHeader="true"
      :rowData="rowData"></ag-grid-vue>
        </div>
    `,
  components: {
    "ag-grid-vue": AgGridVue,
  },
  setup(props) {
    const gridApi = shallowRef<GridApi<IOlympicDataWithId> | null>(null);
    const columnDefs = ref<ColDef[]>([
      { field: "athlete", filter: "agTextColumnFilter" },
      { field: "country", filter: "agTextColumnFilter" },
      { field: "sport", filter: "agTextColumnFilter" },
      { field: "gold", aggFunc: "sum", filter: "agNumberColumnFilter" },
      { field: "silver", aggFunc: "sum", filter: "agNumberColumnFilter" },
      { field: "bronze", aggFunc: "sum", filter: "agNumberColumnFilter" },
    ]);
    const defaultColDef = ref<ColDef>({
      floatingFilter: true,
      flex: 1,
      minWidth: 120,
    });
    const autoGroupColumnDef = ref<ColDef>({
      flex: 1,
      minWidth: 180,
    });
    const getRowId = ref<GetRowIdFunc>((params) => {
      if (params.data.id != null) {
        return "leaf-" + params.data.id;
      }
      const rowGroupCols = params.api.getRowGroupColumns();
      const rowGroupColIds = rowGroupCols.map((col) => col.getId()).join("-");
      const thisGroupCol = rowGroupCols[params.level];
      return (
        "group-" +
        rowGroupColIds +
        "-" +
        (params.parentKeys || []).join("-") +
        params.data[thisGroupCol.getColDef().field as keyof IOlympicDataWithId]
      );
    });
    const rowModelType = ref<RowModelType>("serverSide");
    const rowSelection = ref<RowSelectionOptions | "single" | "multiple">({
      mode: "multiRow",
    });
    const rowData = ref<IOlympicDataWithId[]>(null);

    const onGridReady = (params: GridReadyEvent) => {
      gridApi.value = params.api;

      const updateData = (data) => {
        // assign a unique ID to each data item
        data.forEach(function (item: any, index: number) {
          item.id = index;
        });
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
      getRowId,
      rowModelType,
      rowSelection,
      rowData,
      onGridReady,
    };
  },
});

createApp(VueExample).mount("#app");
