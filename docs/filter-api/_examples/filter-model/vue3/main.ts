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
  DateFilterModule,
  GridApi,
  GridOptions,
  GridReadyEvent,
  IDateFilterParams,
  ModuleRegistry,
  NumberFilterModule,
  SideBarDef,
  TextFilterModule,
  ValidationModule,
} from "ag-grid-community";
import {
  ColumnMenuModule,
  ColumnsToolPanelModule,
  ContextMenuModule,
  FiltersToolPanelModule,
  SetFilterModule,
} from "ag-grid-enterprise";
import { IOlympicData } from "./interfaces";
ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  ColumnsToolPanelModule,
  FiltersToolPanelModule,
  ColumnMenuModule,
  ContextMenuModule,
  SetFilterModule,
  TextFilterModule,
  NumberFilterModule,
  DateFilterModule,
  ValidationModule /* Development Only */,
]);

const filterParams: IDateFilterParams = {
  comparator: (filterLocalDateAtMidnight: Date, cellValue: string) => {
    const dateAsString = cellValue;
    if (dateAsString == null) return -1;
    const dateParts = dateAsString.split("/");
    const cellDate = new Date(
      Number(dateParts[2]),
      Number(dateParts[1]) - 1,
      Number(dateParts[0]),
    );
    if (filterLocalDateAtMidnight.getTime() === cellDate.getTime()) {
      return 0;
    }
    if (cellDate < filterLocalDateAtMidnight) {
      return -1;
    }
    if (cellDate > filterLocalDateAtMidnight) {
      return 1;
    }
    return 0;
  },
};

let savedFilterModel: any = null;

const VueExample = defineComponent({
  template: `
        <div style="height: 100%">
                <div class="example-wrapper">
      <div>
        <div class="button-group">
          <button v-on:click="saveFilterModel()">Save Filter Model</button>
          <button v-on:click="restoreFilterModel()">Restore Saved Filter Model</button>
          <button v-on:click="restoreFromHardCoded()" title="Name = 'Mich%', Country = ['Ireland', 'United States'], Age < 30, Date < 01/01/2010">
          Set Custom Filter Model
        </button>
        <button v-on:click="clearFilters()">Reset Filters</button>
        <button v-on:click="destroyFilter()">Destroy Filter</button>
      </div>
    </div>
    <div>
      <div class="button-group">Saved Filters: <span id="savedFilters">(none)</span></div>
    </div>
    <ag-grid-vue
      style="width: 100%; height: 100%;"
      @grid-ready="onGridReady"
      :columnDefs="columnDefs"
      :defaultColDef="defaultColDef"
      :sideBar="sideBar"
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
      { field: "athlete", filter: "agTextColumnFilter" },
      { field: "age", filter: "agNumberColumnFilter", maxWidth: 100 },
      { field: "country" },
      { field: "year", maxWidth: 100 },
      {
        field: "date",
        filter: "agDateColumnFilter",
        filterParams: filterParams,
      },
      { field: "sport" },
      { field: "gold", filter: "agNumberColumnFilter" },
      { field: "silver", filter: "agNumberColumnFilter" },
      { field: "bronze", filter: "agNumberColumnFilter" },
      { field: "total", filter: "agNumberColumnFilter" },
    ]);
    const defaultColDef = ref<ColDef>({
      flex: 1,
      minWidth: 150,
      filter: true,
    });
    const sideBar = ref<SideBarDef | string | string[] | boolean | null>(
      "filters",
    );
    const rowData = ref<IOlympicData[]>(null);

    function clearFilters() {
      gridApi.value!.setFilterModel(null);
    }
    function saveFilterModel() {
      savedFilterModel = gridApi.value!.getFilterModel();
      const keys = Object.keys(savedFilterModel);
      const savedFilters: string = keys.length > 0 ? keys.join(", ") : "(none)";
      (document.querySelector("#savedFilters") as any).textContent =
        savedFilters;
    }
    function restoreFilterModel() {
      gridApi.value!.setFilterModel(savedFilterModel);
    }
    function restoreFromHardCoded() {
      const hardcodedFilter = {
        country: {
          type: "set",
          values: ["Ireland", "United States"],
        },
        age: { type: "lessThan", filter: "30" },
        athlete: { type: "startsWith", filter: "Mich" },
        date: { type: "lessThan", dateFrom: "2010-01-01" },
      };
      gridApi.value!.setFilterModel(hardcodedFilter);
    }
    function destroyFilter() {
      gridApi.value!.destroyFilter("athlete");
    }
    const onGridReady = (params: GridReadyEvent) => {
      gridApi.value = params.api;

      params.api.getToolPanelInstance("filters")!.expandFilters();

      const updateData = (data) => (rowData.value = data);

      fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
        .then((resp) => resp.json())
        .then((data) => updateData(data));
    };

    return {
      gridApi,
      columnDefs,
      defaultColDef,
      sideBar,
      rowData,
      onGridReady,
      clearFilters,
      saveFilterModel,
      restoreFilterModel,
      restoreFromHardCoded,
      destroyFilter,
    };
  },
});

createApp(VueExample).mount("#app");
