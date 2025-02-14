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
  IMultiFilterParams,
  IProvidedFilterParams,
  ISetFilter,
  ISetFilterParams,
  ITextFilterParams,
  ModuleRegistry,
  NumberFilterModule,
  TextFilterModule,
  ValidationModule,
  createGrid,
} from "ag-grid-community";
import {
  ColumnMenuModule,
  ColumnsToolPanelModule,
  ContextMenuModule,
  MultiFilterModule,
  SetFilterModule,
} from "ag-grid-enterprise";
import { IOlympicData } from "./interfaces";
ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  ColumnsToolPanelModule,
  ColumnMenuModule,
  ContextMenuModule,
  MultiFilterModule,
  SetFilterModule,
  TextFilterModule,
  NumberFilterModule,
  DateFilterModule,
  ValidationModule /* Development Only */,
]);

const defaultFilterParams: IProvidedFilterParams = { readOnly: true };

function dateComparator(filterLocalDateAtMidnight: Date, cellValue: Date) {
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
}

const VueExample = defineComponent({
  template: `
        <div style="height: 100%">
                <div class="example-wrapper">
      <div class="example-header">
        <span class="button-group">
          <button v-on:click="irelandAndUk()">Ireland &amp; UK</button>
          <button v-on:click="endingStan()">Countries Ending 'stan'</button>
          <button v-on:click="printCountryModel()">Print Country</button>
          <button v-on:click="clearCountryFilter()">Clear Country</button>
          <button v-on:click="destroyCountryFilter()">Destroy Country</button>
        </span>
        <span class="button-group">
          <button v-on:click="ageBelow25()">Age Below 25</button>
          <button v-on:click="ageAbove30()">Age Above 30</button>
          <button v-on:click="ageBelow25OrAbove30()">Age Below 25 or Above 30</button>
          <button v-on:click="ageBetween25And30()">Age Between 25 and 30</button>
          <button v-on:click="clearAgeFilter()">Clear Age Filter</button>
        </span>
        <span class="button-group">
          <button v-on:click="after2010()">Date after 01/01/2010</button>
          <button v-on:click="before2012()">Date before 01/01/2012</button>
          <button v-on:click="dateCombined()">Date combined</button>
          <button v-on:click="clearDateFilter()">Clear Date Filter</button>
        </span>
        <span class="button-group">
          <button v-on:click="sportStartsWithS()">Sport starts with S</button>
          <button v-on:click="sportEndsWithG()">Sport ends with G</button>
          <button v-on:click="sportsCombined()">Sport starts with S and ends with G</button>
          <button v-on:click="clearSportFilter()">Clear Sport Filter</button>
        </span>
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
    const columnDefs = ref<ColDef[]>([
      {
        field: "athlete",
        filter: "agTextColumnFilter",
        filterParams: defaultFilterParams,
      },
      {
        field: "age",
        filter: "agNumberColumnFilter",
        filterParams: defaultFilterParams,
      },
      {
        field: "country",
        filter: "agSetColumnFilter",
        filterParams: defaultFilterParams,
      },
      {
        field: "year",
        maxWidth: 120,
        filter: "agNumberColumnFilter",
        filterParams: defaultFilterParams,
      },
      {
        field: "date",
        minWidth: 215,
        filter: "agDateColumnFilter",
        filterParams: {
          readOnly: true,
          comparator: dateComparator,
        } as IDateFilterParams,
        suppressHeaderMenuButton: true,
      },
      {
        field: "sport",
        suppressHeaderMenuButton: true,
        filter: "agMultiColumnFilter",
        filterParams: {
          filters: [
            {
              filter: "agTextColumnFilter",
              filterParams: { readOnly: true } as ITextFilterParams,
            },
            {
              filter: "agSetColumnFilter",
              filterParams: { readOnly: true } as ISetFilterParams,
            },
          ],
          readOnly: true,
        } as IMultiFilterParams,
      },
      { field: "gold", filterParams: defaultFilterParams },
      { field: "silver", filterParams: defaultFilterParams },
      { field: "bronze", filterParams: defaultFilterParams },
      { field: "total", filter: false },
    ]);
    const defaultColDef = ref<ColDef>({
      flex: 1,
      minWidth: 150,
      filter: true,
      floatingFilter: true,
    });
    const rowData = ref<IOlympicData[]>(null);

    function irelandAndUk() {
      gridApi
        .value!.setColumnFilterModel("country", {
          values: ["Ireland", "Great Britain"],
        })
        .then(() => {
          gridApi.value!.onFilterChanged();
        });
    }
    function clearCountryFilter() {
      gridApi.value!.setColumnFilterModel("country", null).then(() => {
        gridApi.value!.onFilterChanged();
      });
    }
    function destroyCountryFilter() {
      gridApi.value!.destroyFilter("country");
    }
    function endingStan() {
      gridApi
        .value!.getColumnFilterInstance<ISetFilter>("country")
        .then((countryFilterComponent) => {
          const countriesEndingWithStan = countryFilterComponent!
            .getFilterKeys()
            .filter(function (value: any) {
              return value.indexOf("stan") === value.length - 4;
            });
          gridApi
            .value!.setColumnFilterModel("country", {
              values: countriesEndingWithStan,
            })
            .then(() => {
              gridApi.value!.onFilterChanged();
            });
        });
    }
    function printCountryModel() {
      const model = gridApi.value!.getColumnFilterModel("country");
      if (model) {
        console.log("Country model is: " + JSON.stringify(model));
      } else {
        console.log("Country model filter is not active");
      }
    }
    function sportStartsWithS() {
      gridApi
        .value!.setColumnFilterModel("sport", {
          filterModels: [
            {
              type: "startsWith",
              filter: "s",
            },
          ],
        })
        .then(() => {
          gridApi.value!.onFilterChanged();
        });
    }
    function sportEndsWithG() {
      gridApi
        .value!.setColumnFilterModel("sport", {
          filterModels: [
            {
              type: "endsWith",
              filter: "g",
            },
          ],
        })
        .then(() => {
          gridApi.value!.onFilterChanged();
        });
    }
    function sportsCombined() {
      gridApi
        .value!.setColumnFilterModel("sport", {
          filterModels: [
            {
              conditions: [
                {
                  type: "endsWith",
                  filter: "g",
                },
                {
                  type: "startsWith",
                  filter: "s",
                },
              ],
              operator: "AND",
            },
          ],
        })
        .then(() => {
          gridApi.value!.onFilterChanged();
        });
    }
    function ageBelow25() {
      gridApi
        .value!.setColumnFilterModel("age", {
          type: "lessThan",
          filter: 25,
          filterTo: null,
        })
        .then(() => {
          gridApi.value!.onFilterChanged();
        });
    }
    function ageAbove30() {
      gridApi
        .value!.setColumnFilterModel("age", {
          type: "greaterThan",
          filter: 30,
          filterTo: null,
        })
        .then(() => {
          gridApi.value!.onFilterChanged();
        });
    }
    function ageBelow25OrAbove30() {
      gridApi
        .value!.setColumnFilterModel("age", {
          conditions: [
            {
              type: "greaterThan",
              filter: 30,
              filterTo: null,
            },
            {
              type: "lessThan",
              filter: 25,
              filterTo: null,
            },
          ],
          operator: "OR",
        })
        .then(() => {
          gridApi.value!.onFilterChanged();
        });
    }
    function ageBetween25And30() {
      gridApi
        .value!.setColumnFilterModel("age", {
          type: "inRange",
          filter: 25,
          filterTo: 30,
        })
        .then(() => {
          gridApi.value!.onFilterChanged();
        });
    }
    function clearAgeFilter() {
      gridApi.value!.setColumnFilterModel("age", null).then(() => {
        gridApi.value!.onFilterChanged();
      });
    }
    function after2010() {
      gridApi
        .value!.setColumnFilterModel("date", {
          type: "greaterThan",
          dateFrom: "2010-01-01",
          dateTo: null,
        })
        .then(() => {
          gridApi.value!.onFilterChanged();
        });
    }
    function before2012() {
      gridApi
        .value!.setColumnFilterModel("date", {
          type: "lessThan",
          dateFrom: "2012-01-01",
          dateTo: null,
        })
        .then(() => {
          gridApi.value!.onFilterChanged();
        });
    }
    function dateCombined() {
      gridApi
        .value!.setColumnFilterModel("date", {
          conditions: [
            {
              type: "lessThan",
              dateFrom: "2012-01-01",
              dateTo: null,
            },
            {
              type: "greaterThan",
              dateFrom: "2010-01-01",
              dateTo: null,
            },
          ],
          operator: "OR",
        })
        .then(() => {
          gridApi.value!.onFilterChanged();
        });
    }
    function clearDateFilter() {
      gridApi.value!.setColumnFilterModel("date", null).then(() => {
        gridApi.value!.onFilterChanged();
      });
    }
    function clearSportFilter() {
      gridApi.value!.setColumnFilterModel("sport", null).then(() => {
        gridApi.value!.onFilterChanged();
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
      irelandAndUk,
      clearCountryFilter,
      destroyCountryFilter,
      endingStan,
      printCountryModel,
      sportStartsWithS,
      sportEndsWithG,
      sportsCombined,
      ageBelow25,
      ageAbove30,
      ageBelow25OrAbove30,
      ageBetween25And30,
      clearAgeFilter,
      after2010,
      before2012,
      dateCombined,
      clearDateFilter,
      clearSportFilter,
    };
  },
});

createApp(VueExample).mount("#app");
