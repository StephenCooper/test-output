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
  GridApi,
  GridOptions,
  GridReadyEvent,
  ModuleRegistry,
  ValidationModule,
} from "ag-grid-community";
import { RowGroupingModule } from "ag-grid-enterprise";
import { IOlympicData } from "./interfaces";
ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  RowGroupingModule,
  ValidationModule /* Development Only */,
]);

declare let window: any;

const VueExample = defineComponent({
  template: `
        <div style="height: 100%">
                <div class="test-container">
      <div class="test-header">
        <div class="example-section">
          Column State:
          <button v-on:click="saveState()">Save State</button>
          <button v-on:click="restoreState()">Restore State</button>
          <button v-on:click="resetState()">Reset State</button>
        </div>
      </div>
      <ag-grid-vue
        style="width: 100%; height: 100%;"
        @grid-ready="onGridReady"
        :columnDefs="columnDefs"
        :defaultColDef="defaultColDef"
        :rowData="rowData"></ag-grid-vue>
      </div>
        </div>
    `,
  components: {
    "ag-grid-vue": AgGridVue,
  },
  setup(props) {
    const gridApi = shallowRef<GridApi<IOlympicData> | null>(null);
    const columnDefs = ref<(ColDef | ColGroupDef)[]>([
      {
        headerName: "Athlete",
        children: [
          { field: "athlete" },
          { field: "country", columnGroupShow: "open" },
          { field: "sport", columnGroupShow: "open" },
          { field: "year", columnGroupShow: "open" },
          { field: "date", columnGroupShow: "open" },
        ],
      },
      {
        headerName: "Medals",
        children: [
          { field: "total", columnGroupShow: "closed" },
          { field: "gold", columnGroupShow: "open" },
          { field: "silver", columnGroupShow: "open" },
          { field: "bronze", columnGroupShow: "open" },
        ],
      },
    ]);
    const defaultColDef = ref<ColDef>({
      width: 150,
    });
    const rowData = ref<IOlympicData[]>(null);

    function saveState() {
      window.groupState = gridApi.value!.getColumnGroupState();
      console.log("group state saved", window.groupState);
      console.log("column state saved");
    }
    function restoreState() {
      if (!window.groupState) {
        console.log(
          "no columns state to restore by, you must save state first",
        );
        return;
      }
      gridApi.value!.setColumnGroupState(window.groupState);
      console.log("column state restored");
    }
    function resetState() {
      gridApi.value!.resetColumnGroupState();
      console.log("column state reset");
    }
    const onGridReady = (params: GridReadyEvent) => {
      gridApi.value = params.api;

      const updateData = (data) => (rowData.value = data);

      fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
        .then((resp) => resp.json())
        .then((data) => updateData(data));
    };

    return {
      gridApi,
      columnDefs,
      defaultColDef,
      rowData,
      onGridReady,
      saveState,
      restoreState,
      resetState,
    };
  },
});

createApp(VueExample).mount("#app");
