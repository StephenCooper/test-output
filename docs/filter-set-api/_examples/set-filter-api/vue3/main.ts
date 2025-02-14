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
  ISetFilter,
  ISetFilterParams,
  KeyCreatorParams,
  ModuleRegistry,
  NumberFilterModule,
  SideBarDef,
  ValidationModule,
  ValueFormatterParams,
  createGrid,
} from "ag-grid-community";
import {
  ColumnMenuModule,
  ContextMenuModule,
  FiltersToolPanelModule,
  SetFilterModule,
} from "ag-grid-enterprise";
import { IOlympicData } from "./interfaces";
ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  FiltersToolPanelModule,
  ColumnMenuModule,
  ContextMenuModule,
  SetFilterModule,
  NumberFilterModule,
  ValidationModule /* Development Only */,
]);

function countryKeyCreator(params: KeyCreatorParams) {
  return params.value.name;
}

function patchData(data: any[]) {
  // hack the data, replace each country with an object of country name and code
  data.forEach((row) => {
    const countryName = row.country;
    const countryCode = countryName.substring(0, 2).toUpperCase();
    row.country = {
      name: countryName,
      code: countryCode,
    };
  });
}

const VueExample = defineComponent({
  template: `
        <div style="height: 100%">
                <div class="example-wrapper">
      <div class="example-header">
        <div>
          Athlete:
          <button v-on:click="selectNothing()">API: Filter empty set</button>
          <button v-on:click="selectJohnAndKenny()">API: Filter only John Joe Nevin and Kenny Egan</button>
          <button v-on:click="selectEverything()">API: Remove filter</button>
        </div>
        <div style="padding-top: 10px">
          Country - available filter values
          <button v-on:click="setCountriesToFranceAustralia()">Filter values restricted to France and Australia</button>
          <button v-on:click="setCountriesToAll()">Make all countries available</button>
        </div>
      </div>
      <ag-grid-vue
        style="width: 100%; height: 100%;"
        @grid-ready="onGridReady"
        :columnDefs="columnDefs"
        :defaultColDef="defaultColDef"
        :sideBar="sideBar"
        :rowData="rowData"
        @first-data-rendered="onFirstDataRendered"></ag-grid-vue>
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
        field: "athlete",
        filter: "agSetColumnFilter",
      },
      {
        field: "country",
        valueFormatter: (params: ValueFormatterParams) => {
          return `${params.value.name} (${params.value.code})`;
        },
        keyCreator: countryKeyCreator,
        filterParams: {
          valueFormatter: (params: ValueFormatterParams) => params.value.name,
        } as ISetFilterParams,
      },
      { field: "age", maxWidth: 120, filter: "agNumberColumnFilter" },
      { field: "year", maxWidth: 120 },
      { field: "date" },
      { field: "sport" },
      { field: "gold", filter: "agNumberColumnFilter" },
      { field: "silver", filter: "agNumberColumnFilter" },
      { field: "bronze", filter: "agNumberColumnFilter" },
      { field: "total", filter: "agNumberColumnFilter" },
    ]);
    const defaultColDef = ref<ColDef>({
      flex: 1,
      minWidth: 160,
      filter: true,
    });
    const sideBar = ref<SideBarDef | string | string[] | boolean | null>(
      "filters",
    );
    const rowData = ref<IOlympicData[]>(null);

    function onFirstDataRendered(params: FirstDataRenderedEvent) {
      params.api.getToolPanelInstance("filters")!.expandFilters();
    }
    function selectJohnAndKenny() {
      gridApi
        .value!.setColumnFilterModel("athlete", {
          values: ["John Joe Nevin", "Kenny Egan"],
        })
        .then(() => {
          gridApi.value!.onFilterChanged();
        });
    }
    function selectEverything() {
      gridApi.value!.setColumnFilterModel("athlete", null).then(() => {
        gridApi.value!.onFilterChanged();
      });
    }
    function selectNothing() {
      gridApi
        .value!.setColumnFilterModel("athlete", { values: [] })
        .then(() => {
          gridApi.value!.onFilterChanged();
        });
    }
    function setCountriesToFranceAustralia() {
      gridApi
        .value!.getColumnFilterInstance<
          ISetFilter<{
            name: string;
            code: string;
          }>
        >("country")
        .then((instance) => {
          instance!.setFilterValues([
            {
              name: "France",
              code: "FR",
            },
            {
              name: "Australia",
              code: "AU",
            },
          ]);
          instance!.applyModel();
          gridApi.value!.onFilterChanged();
        });
    }
    function setCountriesToAll() {
      gridApi
        .value!.getColumnFilterInstance<
          ISetFilter<{
            name: string;
            code: string;
          }>
        >("country")
        .then((instance) => {
          instance!.resetFilterValues();
          instance!.applyModel();
          gridApi.value!.onFilterChanged();
        });
    }
    const onGridReady = (params: GridReadyEvent) => {
      gridApi.value = params.api;

      const updateData = (data) => {
        patchData(data);
        rowData.value = data;
      };

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
      onFirstDataRendered,
      selectJohnAndKenny,
      selectEverything,
      selectNothing,
      setCountriesToFranceAustralia,
      setCountriesToAll,
    };
  },
});

createApp(VueExample).mount("#app");
