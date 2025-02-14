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
  ColumnApiModule,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ModuleRegistry,
  ScrollApiModule,
  ValidationModule,
} from "ag-grid-community";
import { IOlympicData } from "./interfaces";
ModuleRegistry.registerModules([
  ColumnApiModule,
  ScrollApiModule,
  ClientSideRowModelModule,
  ValidationModule /* Development Only */,
]);

const VueExample = defineComponent({
  template: `
        <div style="height: 100%">
                <div class="example-wrapper">
      <div class="example-header">
        <div style="padding: 4px">
          <button v-on:click="clearPinned()">Clear Pinned</button>
          <button v-on:click="resetPinned()">Left = #, Athlete, Age; Right = Total</button>
          <button v-on:click="pinCountry()">Left = Country</button>
        </div>
        <div style="padding: 4px">
          Jump to:
          <input placeholder="row" type="text" style="width: 40px" id="row" v-on:input="jumpToRow()">
            <input placeholder="col" type="text" style="width: 40px" id="col" v-on:input="jumpToCol()">
            </div>
          </div>
          <ag-grid-vue
            style="width: 100%; height: 100%;"
            @grid-ready="onGridReady"
            :columnDefs="columnDefs"
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
      {
        headerName: "#",
        colId: "rowNum",
        valueGetter: "node.id",
        width: 80,
        pinned: "left",
      },
      { field: "athlete", width: 150, pinned: "left" },
      { field: "age", width: 90, pinned: "left" },
      { field: "country", width: 150 },
      { field: "year", width: 90 },
      { field: "date", width: 110 },
      { field: "sport", width: 150 },
      { field: "gold", width: 100 },
      { field: "silver", width: 100 },
      { field: "bronze", width: 100 },
      { field: "total", width: 100, pinned: "right" },
    ]);
    const rowData = ref<IOlympicData[]>(null);

    function clearPinned() {
      gridApi.value!.applyColumnState({ defaultState: { pinned: null } });
    }
    function resetPinned() {
      gridApi.value!.applyColumnState({
        state: [
          { colId: "rowNum", pinned: "left" },
          { colId: "athlete", pinned: "left" },
          { colId: "age", pinned: "left" },
          { colId: "total", pinned: "right" },
        ],
        defaultState: { pinned: null },
      });
    }
    function pinCountry() {
      gridApi.value!.applyColumnState({
        state: [{ colId: "country", pinned: "left" }],
        defaultState: { pinned: null },
      });
    }
    function jumpToCol() {
      const value = (document.getElementById("col") as HTMLInputElement).value;
      if (typeof value !== "string" || value === "") {
        return;
      }
      const index = Number(value);
      if (typeof index !== "number" || isNaN(index)) {
        return;
      }
      // it's actually a column the api needs, so look the column up
      const allColumns = gridApi.value!.getColumns();
      if (allColumns) {
        const column = allColumns[index];
        if (column) {
          gridApi.value!.ensureColumnVisible(column);
        }
      }
    }
    function jumpToRow() {
      const value = (document.getElementById("row") as HTMLInputElement).value;
      const index = Number(value);
      if (typeof index === "number" && !isNaN(index)) {
        gridApi.value!.ensureIndexVisible(index);
      }
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
      rowData,
      onGridReady,
      clearPinned,
      resetPinned,
      pinCountry,
      jumpToCol,
      jumpToRow,
    };
  },
});

createApp(VueExample).mount("#app");
