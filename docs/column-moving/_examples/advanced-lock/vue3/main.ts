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
  CellStyleModule,
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  ColumnApiModule,
  ColumnPinnedEvent,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ModuleRegistry,
  NumberFilterModule,
  TextFilterModule,
  ValidationModule,
  createGrid,
} from "ag-grid-community";
import ControlsCellRenderer from "./controlsCellRendererVue";
import { IOlympicData } from "./interfaces";
ModuleRegistry.registerModules([
  ColumnApiModule,
  TextFilterModule,
  NumberFilterModule,
  CellStyleModule,
  ClientSideRowModelModule,
  ValidationModule /* Development Only */,
]);

const VueExample = defineComponent({
  template: `
        <div style="height: 100%">
                <div class="example-wrapper">
      <div class="legend-bar">
        <button v-on:click="onPinAthleteLeft()">Pin Athlete Left</button>
        <button v-on:click="onPinAthleteRight()">Pin Athlete Right</button>
        <button v-on:click="onUnpinAthlete()">Un-Pin Athlete</button>
        &nbsp;&nbsp;&nbsp;&nbsp;
        <span class="locked-col legend-box"></span> Position Locked Column
      </div>
      <ag-grid-vue
        style="width: 100%; height: 100%;"
        @grid-ready="onGridReady"
        :columnDefs="columnDefs"
        :defaultColDef="defaultColDef"
        :suppressDragLeaveHidesColumns="true"
        :rowData="rowData"
        @column-pinned="onColumnPinned"></ag-grid-vue>
      </div>
        </div>
    `,
  components: {
    "ag-grid-vue": AgGridVue,
    ControlsCellRenderer,
  },
  setup(props) {
    const gridApi = shallowRef<GridApi<IOlympicData> | null>(null);
    const columnDefs = ref<ColDef[]>([
      {
        lockPosition: "left",
        cellRenderer: "ControlsCellRenderer",
        cellClass: "locked-col",
        width: 120,
        suppressNavigable: true,
      },
      { field: "athlete" },
      { field: "age" },
      { field: "country" },
      { field: "year" },
      { field: "date" },
      { field: "sport" },
      { field: "gold" },
      { field: "silver" },
      { field: "bronze" },
      { field: "total" },
    ]);
    const defaultColDef = ref<ColDef>({
      width: 150,
    });
    const rowData = ref<IOlympicData[]>(null);

    function onColumnPinned(event: ColumnPinnedEvent) {
      const allCols = event.api.getAllGridColumns();
      if (event.pinned !== "right") {
        const allFixedCols = allCols.filter(
          (col) => col.getColDef().lockPosition,
        );
        event.api.setColumnsPinned(allFixedCols, event.pinned);
      }
    }
    function onPinAthleteLeft() {
      gridApi.value!.applyColumnState({
        state: [{ colId: "athlete", pinned: "left" }],
      });
    }
    function onPinAthleteRight() {
      gridApi.value!.applyColumnState({
        state: [{ colId: "athlete", pinned: "right" }],
      });
    }
    function onUnpinAthlete() {
      gridApi.value!.applyColumnState({
        state: [{ colId: "athlete", pinned: null }],
      });
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
      onColumnPinned,
      onPinAthleteLeft,
      onPinAthleteRight,
      onUnpinAthlete,
    };
  },
});

createApp(VueExample).mount("#app");
