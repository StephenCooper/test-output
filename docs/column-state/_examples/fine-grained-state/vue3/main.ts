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
  SideBarDef,
  ValidationModule,
} from "ag-grid-community";
import {
  ColumnsToolPanelModule,
  PivotModule,
  RowGroupingPanelModule,
} from "ag-grid-enterprise";
import { IOlympicData } from "./interfaces";
ModuleRegistry.registerModules([
  ColumnApiModule,
  ClientSideRowModelModule,
  ColumnsToolPanelModule,
  PivotModule,
  RowGroupingPanelModule,
  ValidationModule /* Development Only */,
]);

const VueExample = defineComponent({
  template: `
        <div style="height: 100%">
                <div class="test-container">
      <div class="test-header">
        <table>
          <tbody><tr>
            <td>Sort:</td>
            <td>
              <button v-on:click="onBtSortAthlete()">Sort Athlete</button>
              <button v-on:click="onBtSortCountryThenSportClearOthers()">
                Sort Country, then Sport - Clear Others
              </button>
              <button v-on:click="onBtClearAllSorting()">Clear All Sorting</button>
            </td>
          </tr>
          <tr>
            <td>Column Order:</td>
            <td>
              <button v-on:click="onBtOrderColsMedalsFirst()">Show Medals First</button>
              <button v-on:click="onBtOrderColsMedalsLast()">Show Medals Last</button>
            </td>
          </tr>
          <tr>
            <td>Column Visibility:</td>
            <td>
              <button v-on:click="onBtHideMedals()">Hide Medals</button>
              <button v-on:click="onBtShowMedals()">Show Medals</button>
            </td>
          </tr>
          <tr>
            <td>Row Group:</td>
            <td>
              <button v-on:click="onBtRowGroupCountryThenSport()">Group Country then Sport</button>
              <button v-on:click="onBtRemoveCountryRowGroup()">Remove Country</button>
              <button v-on:click="onBtClearAllRowGroups()">Clear All Groups</button>
            </td>
          </tr>
          </tbody></table>
        </div>
        <ag-grid-vue
          style="width: 100%; height: 100%;"
          @grid-ready="onGridReady"
          :columnDefs="columnDefs"
          :defaultColDef="defaultColDef"
          :autoGroupColumnDef="autoGroupColumnDef"
          :sideBar="sideBar"
          :rowGroupPanelShow="rowGroupPanelShow"
          :pivotPanelShow="pivotPanelShow"
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
      { field: "age" },
      { field: "country" },
      { field: "sport" },
      { field: "year" },
      { field: "date" },
      { field: "gold" },
      { field: "silver" },
      { field: "bronze" },
      { field: "total" },
    ]);
    const defaultColDef = ref<ColDef>({
      width: 150,
      enableRowGroup: true,
      enablePivot: true,
      enableValue: true,
    });
    const autoGroupColumnDef = ref<ColDef>({
      minWidth: 200,
    });
    const sideBar = ref<SideBarDef | string | string[] | boolean | null>({
      toolPanels: ["columns"],
    });
    const rowGroupPanelShow = ref<"always" | "onlyWhenGrouping" | "never">(
      "always",
    );
    const pivotPanelShow = ref<"always" | "onlyWhenPivoting" | "never">(
      "always",
    );
    const rowData = ref<IOlympicData[]>(null);

    function onBtSortAthlete() {
      gridApi.value!.applyColumnState({
        state: [{ colId: "athlete", sort: "asc" }],
      });
    }
    function onBtSortCountryThenSportClearOthers() {
      gridApi.value!.applyColumnState({
        state: [
          { colId: "country", sort: "asc", sortIndex: 0 },
          { colId: "sport", sort: "asc", sortIndex: 1 },
        ],
        defaultState: { sort: null },
      });
    }
    function onBtClearAllSorting() {
      gridApi.value!.applyColumnState({
        defaultState: { sort: null },
      });
    }
    function onBtRowGroupCountryThenSport() {
      gridApi.value!.applyColumnState({
        state: [
          { colId: "country", rowGroupIndex: 0 },
          { colId: "sport", rowGroupIndex: 1 },
        ],
        defaultState: { rowGroup: false },
      });
    }
    function onBtRemoveCountryRowGroup() {
      gridApi.value!.applyColumnState({
        state: [{ colId: "country", rowGroup: false }],
      });
    }
    function onBtClearAllRowGroups() {
      gridApi.value!.applyColumnState({
        defaultState: { rowGroup: false },
      });
    }
    function onBtOrderColsMedalsFirst() {
      gridApi.value!.applyColumnState({
        state: [
          { colId: "gold" },
          { colId: "silver" },
          { colId: "bronze" },
          { colId: "total" },
          { colId: "athlete" },
          { colId: "age" },
          { colId: "country" },
          { colId: "sport" },
          { colId: "year" },
          { colId: "date" },
        ],
        applyOrder: true,
      });
    }
    function onBtOrderColsMedalsLast() {
      gridApi.value!.applyColumnState({
        state: [
          { colId: "athlete" },
          { colId: "age" },
          { colId: "country" },
          { colId: "sport" },
          { colId: "year" },
          { colId: "date" },
          { colId: "gold" },
          { colId: "silver" },
          { colId: "bronze" },
          { colId: "total" },
        ],
        applyOrder: true,
      });
    }
    function onBtHideMedals() {
      gridApi.value!.applyColumnState({
        state: [
          { colId: "gold", hide: true },
          { colId: "silver", hide: true },
          { colId: "bronze", hide: true },
          { colId: "total", hide: true },
        ],
      });
    }
    function onBtShowMedals() {
      gridApi.value!.applyColumnState({
        state: [
          { colId: "gold", hide: false },
          { colId: "silver", hide: false },
          { colId: "bronze", hide: false },
          { colId: "total", hide: false },
        ],
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
      autoGroupColumnDef,
      sideBar,
      rowGroupPanelShow,
      pivotPanelShow,
      rowData,
      onGridReady,
      onBtSortAthlete,
      onBtSortCountryThenSportClearOthers,
      onBtClearAllSorting,
      onBtRowGroupCountryThenSport,
      onBtRemoveCountryRowGroup,
      onBtClearAllRowGroups,
      onBtOrderColsMedalsFirst,
      onBtOrderColsMedalsLast,
      onBtHideMedals,
      onBtShowMedals,
    };
  },
});

createApp(VueExample).mount("#app");
