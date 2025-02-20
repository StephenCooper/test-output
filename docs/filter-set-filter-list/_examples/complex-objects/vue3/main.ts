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
  ISetFilterParams,
  KeyCreatorParams,
  ModuleRegistry,
  SideBarDef,
  ValidationModule,
  ValueFormatterParams,
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
  ValidationModule /* Development Only */,
]);

function countryCodeKeyCreator(params: KeyCreatorParams) {
  const countryObject = params.value;
  return countryObject.code;
}

function countryValueFormatter(params: ValueFormatterParams) {
  return params.value.name;
}

const VueExample = defineComponent({
  template: `
        <div style="height: 100%">
                <div class="example-wrapper">
      <div style="margin-bottom: 5px">
        <button v-on:click="printFilterModel()">Print Filter Model</button>
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
        headerName: "Country",
        field: "country",
        valueFormatter: countryValueFormatter,
        filter: "agSetColumnFilter",
        filterParams: {
          valueFormatter: countryValueFormatter,
          keyCreator: countryCodeKeyCreator,
        } as ISetFilterParams,
      },
    ]);
    const defaultColDef = ref<ColDef>({
      flex: 1,
      floatingFilter: true,
      cellDataType: false,
    });
    const sideBar = ref<SideBarDef | string | string[] | boolean | null>(
      "filters",
    );
    const rowData = ref<IOlympicData[]>(null);

    function onFirstDataRendered(params: FirstDataRenderedEvent) {
      params.api.getToolPanelInstance("filters")!.expandFilters();
    }
    function printFilterModel() {
      const filterModel = gridApi.value!.getFilterModel();
      console.log(filterModel);
    }
    const onGridReady = (params: GridReadyEvent) => {
      gridApi.value = params.api;

      const updateData = (data) => {
        // hack the data, replace each country with an object of country name and code.
        // also make country codes unique
        const uniqueCountryCodes: Map<string, string> = new Map();
        const newData: any[] = [];
        data.forEach(function (row: any) {
          const countryName = row.country;
          const countryCode = countryName.substring(0, 2).toUpperCase();
          const uniqueCountryName = uniqueCountryCodes.get(countryCode);
          if (!uniqueCountryName || uniqueCountryName === countryName) {
            uniqueCountryCodes.set(countryCode, countryName);
            row.country = {
              name: countryName,
              code: countryCode,
            };
            newData.push(row);
          }
        });
        params.api!.setGridOption("rowData", newData);
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
      printFilterModel,
    };
  },
});

createApp(VueExample).mount("#app");
