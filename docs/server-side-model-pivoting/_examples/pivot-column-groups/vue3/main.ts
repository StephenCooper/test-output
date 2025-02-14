import {
  createApp,
  defineComponent,
  onBeforeMount,
  ref,
  shallowRef,
} from "vue";
import { AgGridVue } from "ag-grid-vue3";
import "./styles.css";
import {
  ColDef,
  ColGroupDef,
  GridApi,
  GridOptions,
  GridReadyEvent,
  IServerSideDatasource,
  ModuleRegistry,
  RowModelType,
  ValidationModule,
} from "ag-grid-community";
import {
  ColumnMenuModule,
  ColumnsToolPanelModule,
  ContextMenuModule,
  RowGroupingModule,
  ServerSideRowModelModule,
} from "ag-grid-enterprise";
import { FakeServer } from "./fakeServer";
import { IOlympicData } from "./interfaces";
ModuleRegistry.registerModules([
  ColumnsToolPanelModule,
  ColumnMenuModule,
  ContextMenuModule,
  RowGroupingModule,
  ServerSideRowModelModule,
  ValidationModule /* Development Only */,
]);

function getServerSideDatasource(server: any): IServerSideDatasource {
  return {
    getRows: (params) => {
      const request = params.request;
      console.log("[Datasource] - rows requested by grid: ", params.request);
      const response = server.getData(request);
      // simulating real server call with a 500ms delay
      setTimeout(() => {
        if (response.success) {
          // supply data to grid
          params.success({
            rowData: response.rows,
            rowCount: response.lastRow,
            pivotResultFields: response.pivotFields,
          });
        } else {
          params.fail();
        }
      }, 500);
    },
  };
}

const VueExample = defineComponent({
  template: `
        <div style="height: 100%">
                <div class="example-wrapper">
      <div style="margin-bottom: 5px">
        <button v-on:click="expand('2000', true)">Expand 2000</button>
        <button v-on:click="expand('2000')">Collapse 2000</button>
        <button v-on:click="expand(undefined, true)">Expand All</button>
        <button v-on:click="expand(undefined)">Collapse All</button>
      </div>
      <ag-grid-vue
        style="width: 100%; height: 100%;"
        @grid-ready="onGridReady"
        :columnDefs="columnDefs"
        :defaultColDef="defaultColDef"
        :autoGroupColumnDef="autoGroupColumnDef"
        :rowModelType="rowModelType"
        :pivotMode="true"
        :processPivotResultColDef="processPivotResultColDef"
        :rowData="rowData"></ag-grid-vue>
      </div>
        </div>
    `,
  components: {
    "ag-grid-vue": AgGridVue,
  },
  setup(props) {
    const gridApi = shallowRef<GridApi<IOlympicData> | null>(null);
    const columnDefs = ref<ColDef[]>([
      { field: "country", rowGroup: true },
      { field: "sport", rowGroup: true },
      { field: "year", pivot: true },
      { field: "total", aggFunc: "sum" },
      { field: "gold", aggFunc: "sum" },
      { field: "silver", aggFunc: "sum" },
      { field: "bronze", aggFunc: "sum" },
    ]);
    const defaultColDef = ref<ColDef>({
      width: 150,
    });
    const autoGroupColumnDef = ref<ColDef>({
      minWidth: 200,
    });
    const rowModelType = ref<RowModelType>("serverSide");
    const processPivotResultColDef = ref<(colDef: ColDef) => void>(
      (colDef: ColDef) => {
        const pivotValueColumn = colDef.pivotValueColumn;
        if (!pivotValueColumn) return;
        // if column is not the total column, it should only be shown when expanded.
        // this will enable expandable column groups.
        if (pivotValueColumn.getColId() !== "total") {
          colDef.columnGroupShow = "open";
        }
      },
    );
    const rowData = ref<IOlympicData[]>(null);

    function expand(key?: string, open = false) {
      if (key) {
        gridApi.value!.setColumnGroupState([{ groupId: key, open: open }]);
        return;
      }
      const existingState = gridApi.value!.getColumnGroupState();
      const expandedState = existingState.map(
        (s: { groupId: string; open: boolean }) => ({
          groupId: s.groupId,
          open: open,
        }),
      );
      gridApi.value!.setColumnGroupState(expandedState);
    }
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
      processPivotResultColDef,
      rowData,
      onGridReady,
      expand,
    };
  },
});

createApp(VueExample).mount("#app");
