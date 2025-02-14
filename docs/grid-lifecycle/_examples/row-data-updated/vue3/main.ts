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
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  FirstDataRenderedEvent,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ModuleRegistry,
  RowDataUpdatedEvent,
  ValidationModule,
  createGrid,
} from "ag-grid-community";
import { TAthlete } from "./data";
import { fetchDataAsync } from "./data";
ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  ValidationModule /* Development Only */,
]);

const updateRowCount = (id: string) => {
  const element = document.querySelector(`#${id} > .value`);
  element!.textContent = `${new Date().toLocaleTimeString()}`;
};

const setBtnReloadDataDisabled = (disabled: boolean) => {
  (document.getElementById("btnReloadData") as HTMLButtonElement).disabled =
    disabled;
};

const VueExample = defineComponent({
  template: `
        <div style="height: 100%">
                <div class="test-container">
      <div class="test-header">
        <div id="firstDataRendered">First Data Rendered: <span class="value">-</span></div>
        <div id="rowDataUpdated">Row Data Updated: <span class="value">-</span></div>
        <div>
          <button id="btnReloadData" v-on:click="onBtnReloadData()">Reload Data</button>
        </div>
      </div>
      <ag-grid-vue
        style="width: 100%; height: 100%;"
        @grid-ready="onGridReady"
        :columnDefs="columnDefs"
        :loading="true"
        :rowData="rowData"
        @first-data-rendered="onFirstDataRendered"
        @row-data-updated="onRowDataUpdated"></ag-grid-vue>
      </div>
        </div>
    `,
  components: {
    "ag-grid-vue": AgGridVue,
  },
  setup(props) {
    const gridApi = shallowRef<GridApi | null>(null);
    const columnDefs = ref<ColDef[]>([
      { field: "name", headerName: "Athlete" },
      { field: "person.age", headerName: "Age" },
      { field: "medals.gold", headerName: "Gold Medals" },
    ]);
    const rowData = ref<any[]>(null);

    function onFirstDataRendered(event: FirstDataRenderedEvent) {
      updateRowCount("firstDataRendered");
      console.log("First Data Rendered");
    }
    function onRowDataUpdated(event: RowDataUpdatedEvent<TAthlete>) {
      updateRowCount("rowDataUpdated");
      console.log("Row Data Updated");
    }
    function onBtnReloadData() {
      console.log("Reloading Data ...");
      setBtnReloadDataDisabled(true);
      gridApi.value!.setGridOption("loading", true);
      fetchDataAsync()
        .then((data) => {
          console.log("Data Reloaded");
          gridApi.value!.setGridOption("rowData", data);
        })
        .catch((error) => {
          console.error("Failed to reload data", error);
        })
        .finally(() => {
          gridApi.value!.setGridOption("loading", false);
          setBtnReloadDataDisabled(false);
        });
    }
    const onGridReady = (params: GridReadyEvent) => {
      gridApi.value = params.api;

      console.log("Loading Data ...");
      fetchDataAsync()
        .then((data) => {
          console.log("Data Loaded");
          params.api!.setGridOption("rowData", data);
        })
        .catch((error) => {
          console.error("Failed to load data", error);
        })
        .finally(() => {
          params.api!.setGridOption("loading", false);
          setBtnReloadDataDisabled(false);
        });
    };

    return {
      gridApi,
      columnDefs,
      rowData,
      onGridReady,
      onFirstDataRendered,
      onRowDataUpdated,
      onBtnReloadData,
    };
  },
});

createApp(VueExample).mount("#app");
