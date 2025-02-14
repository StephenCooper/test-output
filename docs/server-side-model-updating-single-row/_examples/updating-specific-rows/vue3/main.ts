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
  HighlightChangesModule,
  IServerSideDatasource,
  ModuleRegistry,
  RowApiModule,
  RowModelType,
  ValidationModule,
  createGrid,
} from "ag-grid-community";
import {
  RowGroupingModule,
  ServerSideRowModelModule,
} from "ag-grid-enterprise";
import { FakeServer } from "./fakeServer";
ModuleRegistry.registerModules([
  RowApiModule,
  HighlightChangesModule,
  RowGroupingModule,
  ServerSideRowModelModule,
  ValidationModule /* Development Only */,
]);

let versionCounter: number = 0;

const getServerSideDatasource = (server: any): IServerSideDatasource => {
  return {
    getRows: (params) => {
      console.log("[Datasource] - rows requested by grid: ", params.request);
      const response = server.getData(params.request);
      const dataWithVersion = response.rows.map((rowData: any) => {
        return {
          ...rowData,
          version:
            versionCounter + " - " + versionCounter + " - " + versionCounter,
        };
      });
      // adding delay to simulate real server call
      setTimeout(() => {
        if (response.success) {
          // call the success callback
          params.success({
            rowData: dataWithVersion,
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
        <button v-on:click="updateRows('Michael Phelps')">Update All Michael Phelps Records</button>
        <button v-on:click="updateRows('Michael Phelps', '29/08/2004')">Update Michael Phelps, 29/08/2004</button>
        <button v-on:click="updateRows('Aleksey Nemov', '01/10/2000')">Update Aleksey Nemov, 01/10/2000</button>
        <button v-on:click="updateRows(undefined, '12/08/2012')">Update All Records Dated 12/08/2012</button>
      </div>
      <ag-grid-vue
        style="width: 100%; height: 100%;"
        @grid-ready="onGridReady"
        :columnDefs="columnDefs"
        :defaultColDef="defaultColDef"
        :rowModelType="rowModelType"
        :cacheBlockSize="cacheBlockSize"
        :getRowId="getRowId"
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
      { field: "athlete" },
      { field: "date" },
      { field: "country" },
      { field: "version" },
    ]);
    const defaultColDef = ref<ColDef>({
      flex: 1,
      sortable: false,
      enableCellChangeFlash: true,
    });
    const rowModelType = ref<RowModelType>("serverSide");
    const cacheBlockSize = ref(75);
    const getRowId = ref<GetRowIdFunc>(
      (params) => `${params.data.athlete}-${params.data.date}`,
    );
    const rowData = ref<any[]>(null);

    function updateRows(athlete?: string, date?: string) {
      versionCounter += 1;
      gridApi.value!.forEachNode((rowNode) => {
        if (athlete != null && rowNode.data.athlete !== athlete) {
          return;
        }
        if (date != null && rowNode.data.date !== date) {
          return;
        }
        // arbitrarily update some data
        const updated = rowNode.data;
        updated.version =
          versionCounter + " - " + versionCounter + " - " + versionCounter;
        // directly update data in rowNode
        rowNode.updateData(updated);
      });
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
      rowModelType,
      cacheBlockSize,
      getRowId,
      rowData,
      onGridReady,
      updateRows,
    };
  },
});

createApp(VueExample).mount("#app");
