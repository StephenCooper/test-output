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
  NumberFilterModule,
  TextFilterModule,
  ValidationModule,
} from "ag-grid-community";
import { IOlympicData } from "./interfaces";
ModuleRegistry.registerModules([
  TextFilterModule,
  NumberFilterModule,
  ClientSideRowModelModule,
  ColumnApiModule,
  ValidationModule /* Development Only */,
]);

let savedSort: any;

const VueExample = defineComponent({
  template: `
        <div style="height: 100%">
                <div class="example-wrapper">
      <div style="margin-bottom: 1rem">
        <div>
          <button v-on:click="sortByAthleteAsc()">Athlete Ascending</button>
          <button v-on:click="sortByAthleteDesc()">Athlete Descending</button>
          <button v-on:click="sortByCountryThenSport()">Country, then Sport</button>
          <button v-on:click="sortBySportThenCountry()">Sport, then Country</button>
        </div>
        <div style="margin-top: 0.25rem">
          <button v-on:click="clearSort()">Clear Sort</button>
          <button v-on:click="saveSort()">Save Sort</button>
          <button v-on:click="restoreFromSave()">Restore from Save</button>
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
      { field: "athlete" },
      { field: "age", width: 90 },
      { field: "country" },
      { field: "year", width: 90 },
      { field: "date" },
      { field: "sport" },
      { field: "gold" },
      { field: "silver" },
      { field: "bronze" },
      { field: "total" },
    ]);
    const rowData = ref<IOlympicData[]>(null);

    function sortByAthleteAsc() {
      gridApi.value!.applyColumnState({
        state: [{ colId: "athlete", sort: "asc" }],
        defaultState: { sort: null },
      });
    }
    function sortByAthleteDesc() {
      gridApi.value!.applyColumnState({
        state: [{ colId: "athlete", sort: "desc" }],
        defaultState: { sort: null },
      });
    }
    function sortByCountryThenSport() {
      gridApi.value!.applyColumnState({
        state: [
          { colId: "country", sort: "asc", sortIndex: 0 },
          { colId: "sport", sort: "asc", sortIndex: 1 },
        ],
        defaultState: { sort: null },
      });
    }
    function sortBySportThenCountry() {
      gridApi.value!.applyColumnState({
        state: [
          { colId: "country", sort: "asc", sortIndex: 1 },
          { colId: "sport", sort: "asc", sortIndex: 0 },
        ],
        defaultState: { sort: null },
      });
    }
    function clearSort() {
      gridApi.value!.applyColumnState({
        defaultState: { sort: null },
      });
    }
    function saveSort() {
      const colState = gridApi.value!.getColumnState();
      const sortState = colState
        .filter(function (s) {
          return s.sort != null;
        })
        .map(function (s) {
          return { colId: s.colId, sort: s.sort, sortIndex: s.sortIndex };
        });
      savedSort = sortState;
      console.log("saved sort", sortState);
    }
    function restoreFromSave() {
      gridApi.value!.applyColumnState({
        state: savedSort,
        defaultState: { sort: null },
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
      rowData,
      onGridReady,
      sortByAthleteAsc,
      sortByAthleteDesc,
      sortByCountryThenSport,
      sortBySportThenCountry,
      clearSort,
      saveSort,
      restoreFromSave,
    };
  },
});

createApp(VueExample).mount("#app");
