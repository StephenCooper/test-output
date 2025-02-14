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
  GridApi,
  GridOptions,
  GridReadyEvent,
  ModuleRegistry,
  PaginationModule,
  QuickFilterModule,
  RowSelectionModule,
  RowSelectionOptions,
  ValidationModule,
  createGrid,
} from "ag-grid-community";
import { IOlympicData } from "./interfaces";
ModuleRegistry.registerModules([
  PaginationModule,
  RowSelectionModule,
  QuickFilterModule,
  ClientSideRowModelModule,
  ValidationModule /* Development Only */,
]);

const VueExample = defineComponent({
  template: `
        <div style="height: 100%">
                <div class="example-wrapper">
      <div style="margin-bottom: 10px">
        <label style="margin-right: 10px">
          <span>Select All Mode: </span>
          <select id="select-all-mode" v-on:change="updateSelectAllMode()">
            <option value="all">all</option>
            <option value="filtered">filtered</option>
            <option value="currentPage">currentPage</option>
          </select>
        </label>
        <label>
          <span>Filter: </span>
          <input type="text" v-on:input="onQuickFilterChanged()" id="quickFilter" placeholder="quick filter...">
          </label>
        </div>
        <ag-grid-vue
          style="width: 100%; height: 100%;"
          @grid-ready="onGridReady"
          :columnDefs="columnDefs"
          :defaultColDef="defaultColDef"
          :pagination="true"
          :paginationAutoPageSize="true"
          :rowSelection="rowSelection"
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
      { headerName: "Athlete", field: "athlete", minWidth: 180 },
      { field: "age" },
      { field: "country", minWidth: 150 },
      { field: "year" },
      { field: "date", minWidth: 150 },
      { field: "sport", minWidth: 150 },
      { field: "gold" },
      { field: "silver" },
      { field: "bronze" },
      { field: "total" },
    ]);
    const defaultColDef = ref<ColDef>({
      flex: 1,
      minWidth: 100,
    });
    const rowSelection = ref<RowSelectionOptions | "single" | "multiple">({
      mode: "multiRow",
      selectAll: "all",
    });
    const rowData = ref<IOlympicData[]>(null);

    function onQuickFilterChanged() {
      gridApi.value!.setGridOption(
        "quickFilterText",
        document.querySelector<HTMLInputElement>("#quickFilter")?.value,
      );
    }
    function updateSelectAllMode() {
      const selectAll =
        document.querySelector<HTMLSelectElement>("#select-all-mode")?.value ??
        "all";
      gridApi.value.setGridOption("rowSelection", {
        mode: "multiRow",
        selectAll: selectAll as "all" | "filtered" | "currentPage",
      });
    }
    const onGridReady = (params: GridReadyEvent) => {
      gridApi.value = params.api;

      const updateData = (data) => (rowData.value = data);

      fetch("https://www.ag-grid.com/example-assets/small-olympic-winners.json")
        .then((resp) => resp.json())
        .then((data) => updateData(data));
    };

    return {
      gridApi,
      columnDefs,
      defaultColDef,
      rowSelection,
      rowData,
      onGridReady,
      onQuickFilterChanged,
      updateSelectAllMode,
    };
  },
});

createApp(VueExample).mount("#app");
