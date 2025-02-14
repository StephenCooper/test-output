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
import { IOlympicData } from "./interfaces";
ModuleRegistry.registerModules([
  TextFilterModule,
  NumberFilterModule,
  ClientSideRowModelModule,
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
  },
  setup(props) {
    const gridApi = shallowRef<GridApi<IOlympicData> | null>(null);
    const columnDefs = ref<ColDef[]>([
      {
        headerName: "Athlete Name",
        field: "athlete",
        suppressHeaderFilterButton: true,
      },
      { field: "age", sortable: false },
      { field: "country", suppressHeaderFilterButton: true },
      { field: "year", sortable: false },
      { field: "date", suppressHeaderFilterButton: true, sortable: false },
      { field: "sport", sortable: false },
      { field: "gold" },
      { field: "silver", sortable: false },
      { field: "bronze", suppressHeaderFilterButton: true },
      { field: "total", sortable: false },
    ]);
    const defaultColDef = ref<ColDef>({
      filter: true,
      width: 150,
      headerComponentParams: {
        template: `<div class="ag-cell-label-container" role="presentation">
                    <span data-ref="eMenu" class="ag-header-icon ag-header-cell-menu-button"></span>
                    <span data-ref="eFilterButton" class="ag-header-icon ag-header-cell-filter-button"></span>
                    <div data-ref="eLabel" class="ag-header-cell-label" role="presentation">
                        <span data-ref="eSortOrder" class="ag-header-icon ag-sort-order ag-hidden"></span>
                        <span data-ref="eSortAsc" class="ag-header-icon ag-sort-ascending-icon ag-hidden"></span>
                        <span data-ref="eSortDesc" class="ag-header-icon ag-sort-descending-icon ag-hidden"></span>
                        <span data-ref="eSortMixed" class="ag-header-icon ag-sort-mixed-icon ag-hidden"></span>
                        <span data-ref="eSortNone" class="ag-header-icon ag-sort-none-icon ag-hidden"></span>
                        ** <span data-ref="eText" class="ag-header-cell-text" role="columnheader"></span>
                        <span data-ref="eFilter" class="ag-header-icon ag-filter-icon"></span>
                    </div>
                </div>`,
      },
    });
    const rowData = ref<IOlympicData[]>(null);

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
    };
  },
});

createApp(VueExample).mount("#app");
