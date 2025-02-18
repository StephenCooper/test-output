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
  GetRowIdParams,
  GridApi,
  GridOptions,
  GridReadyEvent,
  HighlightChangesModule,
  IServerSideDatasource,
  IsServerSideGroupOpenByDefaultParams,
  ModuleRegistry,
  RowModelType,
  StoreRefreshedEvent,
  ValidationModule,
} from "ag-grid-community";
import {
  RowGroupingModule,
  ServerSideRowModelApiModule,
  ServerSideRowModelModule,
} from "ag-grid-enterprise";
import { FakeServer } from "./fakeServer";
ModuleRegistry.registerModules([
  HighlightChangesModule,
  RowGroupingModule,
  ServerSideRowModelModule,
  ServerSideRowModelApiModule,
  ValidationModule /* Development Only */,
]);

let allData: any[];

let versionCounter = 1;

const updateChangeIndicator = () => {
  const el = document.querySelector("#version-indicator") as HTMLInputElement;
  el.textContent = `${versionCounter}`;
};

const beginPeriodicallyModifyingData = () => {
  setInterval(() => {
    versionCounter += 1;
    allData = allData.map((data) => ({
      ...data,
      version: versionCounter + " - " + versionCounter + " - " + versionCounter,
    }));
    updateChangeIndicator();
  }, 4000);
};

const getServerSideDatasource = (server: any): IServerSideDatasource => {
  return {
    getRows: (params) => {
      console.log("[Datasource] - rows requested by grid: ", params.request);
      const response = server.getData(params.request);
      const dataWithVersionAndGroupProperties = response.rows.map(
        (rowData: any) => {
          const rowProperties: any = {
            ...rowData,
            version:
              versionCounter + " - " + versionCounter + " - " + versionCounter,
          };
          // for unique-id purposes in the client, we also want to attach
          // the parent group keys
          const groupProperties = Object.fromEntries(
            params.request.groupKeys.map((groupKey, index) => {
              const col = params.request.rowGroupCols[index];
              const field = col.id;
              return [field, groupKey];
            }),
          );
          return {
            ...rowProperties,
            ...groupProperties,
          };
        },
      );
      // adding delay to simulate real server call
      setTimeout(() => {
        if (response.success) {
          // call the success callback
          params.success({
            rowData: dataWithVersionAndGroupProperties,
            rowCount: response.lastRow,
          });
        } else {
          // inform the grid request failed
          params.fail();
        }
      }, 1000);
    },
  };
};

const VueExample = defineComponent({
  template: `
        <div style="height: 100%">
                <div class="example-wrapper">
      <div style="margin-bottom: 5px">
        <div>Version on server: <span id="version-indicator">1</span></div>
        <button v-on:click="refreshCache(undefined)">Refresh Root Level</button>
        <button v-on:click="refreshCache(['Canada'])">Refresh ['Canada'] Group</button>
        <button v-on:click="refreshCache(['Canada', '2002'])">Refresh ['Canada', '2002'] Group</button>
        <label><input type="checkbox" id="purge"> Purge</label>
      </div>
      <ag-grid-vue
        style="width: 100%; height: 100%;"
        @grid-ready="onGridReady"
        :columnDefs="columnDefs"
        :defaultColDef="defaultColDef"
        :autoGroupColumnDef="autoGroupColumnDef"
        :getRowId="getRowId"
        :isServerSideGroupOpenByDefault="isServerSideGroupOpenByDefault"
        :rowModelType="rowModelType"
        :suppressAggFuncInHeader="true"
        :rowData="rowData"
        @store-refreshed="onStoreRefreshed"></ag-grid-vue>
      </div>
        </div>
    `,
  components: {
    "ag-grid-vue": AgGridVue,
  },
  setup(props) {
    const gridApi = shallowRef<GridApi | null>(null);
    const columnDefs = ref<ColDef[]>([
      { field: "country", hide: true, rowGroup: true },
      { field: "year", hide: true, rowGroup: true },
      { field: "version" },
      { field: "gold", aggFunc: "sum" },
      { field: "silver", aggFunc: "sum" },
      { field: "bronze", aggFunc: "sum" },
    ]);
    const defaultColDef = ref<ColDef>({
      flex: 1,
      minWidth: 150,
      enableCellChangeFlash: true,
    });
    const autoGroupColumnDef = ref<ColDef>({
      flex: 1,
      minWidth: 280,
      field: "athlete",
    });
    const getRowId = ref<GetRowIdFunc>((params: GetRowIdParams) => {
      const data = params.data;
      const parts = [];
      if (data.country != null) {
        parts.push(data.country);
      }
      if (data.year != null) {
        parts.push(data.year);
      }
      if (data.id != null) {
        parts.push(data.id);
      }
      return parts.join("-");
    });
    const isServerSideGroupOpenByDefault = ref<
      (params: IsServerSideGroupOpenByDefaultParams) => boolean
    >((params: IsServerSideGroupOpenByDefaultParams) => {
      return (
        params.rowNode.key === "Canada" ||
        params.rowNode.key!.toString() === "2002"
      );
    });
    const rowModelType = ref<RowModelType>("serverSide");
    const rowData = ref<any[]>(null);

    function onStoreRefreshed(event: StoreRefreshedEvent) {
      console.log("Refresh finished for store with route:", event.route);
    }
    function refreshCache(route?: string[]) {
      const purge = !!(document.querySelector("#purge") as HTMLInputElement)
        .checked;
      gridApi.value!.refreshServerSide({ route: route, purge: purge });
    }
    const onGridReady = (params: GridReadyEvent) => {
      gridApi.value = params.api;

      const updateData = (data) => {
        // give each data item an ID
        const dataWithId = data.map((d: any, idx: number) => ({
          ...d,
          id: idx,
        }));
        allData = dataWithId;
        // setup the fake server with entire dataset
        const fakeServer = new FakeServer(allData);
        // create datasource with a reference to the fake server
        const datasource = getServerSideDatasource(fakeServer);
        // register the datasource with the grid
        params.api!.setGridOption("serverSideDatasource", datasource);
        beginPeriodicallyModifyingData();
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
      isServerSideGroupOpenByDefault,
      rowModelType,
      rowData,
      onGridReady,
      onStoreRefreshed,
      refreshCache,
    };
  },
});

createApp(VueExample).mount("#app");
