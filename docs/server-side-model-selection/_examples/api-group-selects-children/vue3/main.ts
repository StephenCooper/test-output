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
  GetRowIdFunc,
  GridApi,
  GridOptions,
  GridReadyEvent,
  IServerSideDatasource,
  IServerSideGroupSelectionState,
  IsServerSideGroupOpenByDefaultParams,
  ModuleRegistry,
  NumberFilterModule,
  RowModelType,
  RowSelectionOptions,
  TextFilterModule,
  ValidationModule,
  createGrid,
} from "ag-grid-community";
import {
  RowGroupingModule,
  RowGroupingPanelModule,
  ServerSideRowModelApiModule,
  ServerSideRowModelModule,
} from "ag-grid-enterprise";
import { FakeServer } from "./fakeServer";
import { IOlympicDataWithId } from "./interfaces";
ModuleRegistry.registerModules([
  RowGroupingModule,
  ServerSideRowModelModule,
  ServerSideRowModelApiModule,
  RowGroupingPanelModule,
  TextFilterModule,
  NumberFilterModule,
  ValidationModule /* Development Only */,
]);

let selectionState: IServerSideGroupSelectionState = {
  selectAllChildren: false,
  toggledNodes: [],
};

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
                <div class="example-wrapper">
      <div style="margin-bottom: 5px">
        <button v-on:click="saveSelectionState()">Save Selection</button>
        <button v-on:click="loadSelectionState()">Load Selection</button>
        <button v-on:click="clearSelectionState()">Clear Selection</button>
      </div>
      <ag-grid-vue
        style="width: 100%; height: 100%;"
        @grid-ready="onGridReady"
        :columnDefs="columnDefs"
        :defaultColDef="defaultColDef"
        :getRowId="getRowId"
        :isServerSideGroupOpenByDefault="isServerSideGroupOpenByDefault"
        :autoGroupColumnDef="autoGroupColumnDef"
        :rowModelType="rowModelType"
        :rowSelection="rowSelection"
        :rowGroupPanelShow="rowGroupPanelShow"
        :suppressAggFuncInHeader="true"
        :rowData="rowData"
        @first-data-rendered="onFirstDataRendered"></ag-grid-vue>
      </div>
        </div>
    `,
  components: {
    "ag-grid-vue": AgGridVue,
  },
  setup(props) {
    const gridApi = shallowRef<GridApi<IOlympicDataWithId> | null>(null);
    const columnDefs = ref<ColDef[]>([
      { field: "country", enableRowGroup: true, rowGroup: true, hide: true },
      { field: "year", enableRowGroup: true, rowGroup: true, hide: true },
      { field: "athlete", hide: true },
      { field: "sport", enableRowGroup: true, filter: "agTextColumnFilter" },
      { field: "gold", aggFunc: "sum", filter: "agNumberColumnFilter" },
      { field: "silver", aggFunc: "sum", filter: "agNumberColumnFilter" },
      { field: "bronze", aggFunc: "sum", filter: "agNumberColumnFilter" },
    ]);
    const defaultColDef = ref<ColDef>({
      floatingFilter: true,
      flex: 1,
      minWidth: 120,
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
    const isServerSideGroupOpenByDefault = ref<
      (params: IsServerSideGroupOpenByDefaultParams) => boolean
    >((params) => {
      return (
        params.rowNode.key === "United States" ||
        String(params.rowNode.key) === "2004"
      );
    });
    const autoGroupColumnDef = ref<ColDef>({
      field: "athlete",
      flex: 1,
      minWidth: 240,
    });
    const rowModelType = ref<RowModelType>("serverSide");
    const rowSelection = ref<RowSelectionOptions | "single" | "multiple">({
      mode: "multiRow",
      groupSelects: "descendants",
    });
    const rowGroupPanelShow = ref<"always" | "onlyWhenGrouping" | "never">(
      "always",
    );
    const rowData = ref<IOlympicDataWithId[]>(null);

    function onFirstDataRendered(params) {
      params.api.setServerSideSelectionState({
        selectAllChildren: true,
        toggledNodes: [
          {
            nodeId: "group-country-year-United States",
            selectAllChildren: false,
            toggledNodes: [
              {
                nodeId: "group-country-year-United States2004",
                selectAllChildren: true,
              },
            ],
          },
        ],
      });
    }
    function saveSelectionState() {
      selectionState =
        gridApi.value!.getServerSideSelectionState() as IServerSideGroupSelectionState;
      console.log(JSON.stringify(selectionState, null, 2));
    }
    function loadSelectionState() {
      gridApi.value!.setServerSideSelectionState(selectionState);
    }
    function clearSelectionState() {
      gridApi.value!.setServerSideSelectionState({
        selectAllChildren: false,
        toggledNodes: [],
      });
    }
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
      getRowId,
      isServerSideGroupOpenByDefault,
      autoGroupColumnDef,
      rowModelType,
      rowSelection,
      rowGroupPanelShow,
      rowData,
      onGridReady,
      onFirstDataRendered,
      saveSelectionState,
      loadSelectionState,
      clearSelectionState,
    };
  },
});

createApp(VueExample).mount("#app");
