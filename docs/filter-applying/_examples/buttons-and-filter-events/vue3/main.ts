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
  FilterChangedEvent,
  FilterModifiedEvent,
  FilterOpenedEvent,
  GridApi,
  GridOptions,
  GridReadyEvent,
  INumberFilterParams,
  IProvidedFilter,
  ITextFilterParams,
  ModuleRegistry,
  NumberFilterModule,
  TextFilterModule,
  ValidationModule,
} from "ag-grid-community";
import { IOlympicData } from "./interfaces";
ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  TextFilterModule,
  NumberFilterModule,
  ValidationModule /* Development Only */,
]);

const VueExample = defineComponent({
  template: `
        <div style="height: 100%">
                <ag-grid-vue
      style="width: 100%; height: 100%;"
      @grid-ready="onGridReady"
      :columnDefs="columnDefs"
      :defaultColDef="defaultColDef"
      :rowData="rowData"
      @filter-opened="onFilterOpened"
      @filter-changed="onFilterChanged"
      @filter-modified="onFilterModified"></ag-grid-vue>
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
        filterParams: {
          buttons: ["reset", "apply"],
        } as ITextFilterParams,
      },
      {
        field: "age",
        maxWidth: 100,
        filter: "agNumberColumnFilter",
        filterParams: {
          buttons: ["apply", "reset"],
          closeOnApply: true,
        } as INumberFilterParams,
      },
      {
        field: "country",
        filter: "agTextColumnFilter",
        filterParams: {
          buttons: ["clear", "apply"],
        } as ITextFilterParams,
      },
      {
        field: "year",
        filter: "agNumberColumnFilter",
        filterParams: {
          buttons: ["apply", "cancel"],
          closeOnApply: true,
        } as INumberFilterParams,
        maxWidth: 100,
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
    const rowData = ref<IOlympicData[]>(null);

    function onFilterOpened(e: FilterOpenedEvent) {
      console.log("onFilterOpened", e);
    }
    function onFilterChanged(e: FilterChangedEvent) {
      console.log("onFilterChanged", e);
      console.log("gridApi.value.getFilterModel() =>", e.api.getFilterModel());
    }
    function onFilterModified(e: FilterModifiedEvent) {
      console.log("onFilterModified", e);
      console.log("filterInstance.getModel() =>", e.filterInstance.getModel());
      console.log(
        "filterInstance.getModelFromUi() =>",
        (e.filterInstance as unknown as IProvidedFilter).getModelFromUi(),
      );
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
      onFilterOpened,
      onFilterChanged,
      onFilterModified,
    };
  },
});

createApp(VueExample).mount("#app");
