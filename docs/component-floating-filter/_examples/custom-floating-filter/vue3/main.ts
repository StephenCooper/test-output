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
  ModuleRegistry,
  NumberFilterModule,
  TextFilterModule,
  ValidationModule,
  createGrid,
} from "ag-grid-community";
import NumberFloatingFilterComponent from "./numberFloatingFilterComponentVue";
import { IOlympicData } from "./interfaces";
ModuleRegistry.registerModules([
  TextFilterModule,
  ClientSideRowModelModule,
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
      :rowData="rowData"></ag-grid-vue>
        </div>
    `,
  components: {
    "ag-grid-vue": AgGridVue,
    NumberFloatingFilterComponent,
  },
  setup(props) {
    const gridApi = shallowRef<GridApi<IOlympicData> | null>(null);
    const columnDefs = ref<ColDef[]>([
      { field: "athlete", filter: false },
      {
        field: "gold",
        filter: "agNumberColumnFilter",
        suppressHeaderFilterButton: true,
        floatingFilterComponent: "NumberFloatingFilterComponent",
        floatingFilterComponentParams: {
          color: "gold",
        },
        suppressFloatingFilterButton: true,
      },
      {
        field: "silver",
        filter: "agNumberColumnFilter",
        suppressHeaderFilterButton: true,
        floatingFilterComponent: "NumberFloatingFilterComponent",
        floatingFilterComponentParams: {
          color: "silver",
        },
        suppressFloatingFilterButton: true,
      },
      {
        field: "bronze",
        filter: "agNumberColumnFilter",
        suppressHeaderFilterButton: true,
        floatingFilterComponent: "NumberFloatingFilterComponent",
        floatingFilterComponentParams: {
          color: "#CD7F32",
        },
        suppressFloatingFilterButton: true,
      },
      {
        field: "total",
        filter: "agNumberColumnFilter",
        suppressHeaderFilterButton: true,
        floatingFilterComponent: "NumberFloatingFilterComponent",
        floatingFilterComponentParams: {
          color: "unset",
        },
        suppressFloatingFilterButton: true,
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
