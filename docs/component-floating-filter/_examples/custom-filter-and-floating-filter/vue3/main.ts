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
  CustomFilterModule,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ModuleRegistry,
  NumberFilterModule,
  TextFilterModule,
  ValidationModule,
  createGrid,
} from "ag-grid-community";
import NumberFilterComponent from "./numberFilterComponentVue";
import NumberFloatingFilterComponent from "./numberFloatingFilterComponentVue";
import { IOlympicData } from "./interfaces";
ModuleRegistry.registerModules([
  NumberFilterModule,
  ClientSideRowModelModule,
  TextFilterModule,
  CustomFilterModule,
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
    NumberFilterComponent,
    NumberFloatingFilterComponent,
  },
  setup(props) {
    const gridApi = shallowRef<GridApi<IOlympicData> | null>(null);
    const columnDefs = ref<ColDef[]>([
      { field: "athlete", filter: "agTextColumnFilter" },
      {
        field: "gold",
        floatingFilterComponent: "NumberFloatingFilterComponent",
        filter: "NumberFilterComponent",
        suppressFloatingFilterButton: true,
      },
      {
        field: "silver",
        floatingFilterComponent: "NumberFloatingFilterComponent",
        filter: "NumberFilterComponent",
        suppressFloatingFilterButton: true,
      },
      {
        field: "bronze",
        floatingFilterComponent: "NumberFloatingFilterComponent",
        filter: "NumberFilterComponent",
        suppressFloatingFilterButton: true,
      },
      {
        field: "total",
        floatingFilterComponent: "NumberFloatingFilterComponent",
        filter: "NumberFilterComponent",
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
