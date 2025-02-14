import {
  createApp,
  defineComponent,
  onBeforeMount,
  ref,
  shallowRef,
} from "vue";
import { AgGridVue } from "ag-grid-vue3";
import {
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  GridApi,
  GridOptions,
  GridReadyEvent,
  INumberFilterParams,
  ModuleRegistry,
  NumberFilterModule,
  TextFilterModule,
  ValidationModule,
} from "ag-grid-community";
import SliderFloatingFilter from "./sliderFloatingFilterVue";
import { IOlympicData } from "./interfaces";
ModuleRegistry.registerModules([
  TextFilterModule,
  ClientSideRowModelModule,
  NumberFilterModule,
  ValidationModule /* Development Only */,
]);

const filterParams: INumberFilterParams = {
  filterOptions: ["greaterThan"],
  maxNumConditions: 1,
};

const VueExample = defineComponent({
  template: `
        <div style="height: 100%">
                <div style="height: 100%; box-sizing: border-box">
      <ag-grid-vue
        style="width: 100%; height: 100%;"
        @grid-ready="onGridReady"
        :columnDefs="columnDefs"
        :defaultColDef="defaultColDef"
        :alwaysShowVerticalScroll="true"
        :rowData="rowData"></ag-grid-vue>
      </div>
        </div>
    `,
  components: {
    "ag-grid-vue": AgGridVue,
    SliderFloatingFilter,
  },
  setup(props) {
    const gridApi = shallowRef<GridApi<IOlympicData> | null>(null);
    const columnDefs = ref<ColDef[]>([
      { field: "athlete", filter: false },
      {
        field: "gold",
        filter: "agNumberColumnFilter",
        filterParams: filterParams,
        floatingFilterComponent: "SliderFloatingFilter",
        floatingFilterComponentParams: {
          maxValue: 7,
        },
        suppressFloatingFilterButton: true,
        suppressHeaderMenuButton: false,
      },
      {
        field: "silver",
        filter: "agNumberColumnFilter",
        filterParams: filterParams,
        floatingFilterComponent: "SliderFloatingFilter",
        floatingFilterComponentParams: {
          maxValue: 5,
        },
        suppressFloatingFilterButton: true,
        suppressHeaderMenuButton: false,
      },
      {
        field: "bronze",
        filter: "agNumberColumnFilter",
        filterParams: filterParams,
        floatingFilterComponent: "SliderFloatingFilter",
        floatingFilterComponentParams: {
          maxValue: 10,
        },
        suppressFloatingFilterButton: true,
        suppressHeaderMenuButton: false,
      },
    ]);
    const defaultColDef = ref<ColDef>({
      flex: 1,
      minWidth: 100,
      filter: true,
      floatingFilter: true,
    });
    const rowData = ref<IOlympicData[]>(null);

    const onGridReady = (params: GridReadyEvent) => {
      gridApi.value = params.api;

      const updateData = (data) => {
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
      rowData,
      onGridReady,
    };
  },
});

createApp(VueExample).mount("#app");
