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
  QuickFilterModule,
  ValidationModule,
} from "ag-grid-community";
import { PivotModule } from "ag-grid-enterprise";
ModuleRegistry.registerModules([
  QuickFilterModule,
  ClientSideRowModelModule,
  PivotModule,
  ValidationModule /* Development Only */,
]);

let applyBeforePivotOrAgg = false;

const VueExample = defineComponent({
  template: `
        <div style="height: 100%">
                <div class="example-wrapper">
      <div class="example-header">
        <input type="text" id="filter-text-box" placeholder="Filter..." v-on:input="onFilterTextBoxChanged()">
          <button id="applyBeforePivotOrAgg" style="margin-left: 20px" v-on:click="onApplyBeforePivotOrAgg()">
            Apply Before Pivot/Aggregation
          </button>
        </div>
        <ag-grid-vue
          style="width: 100%; height: 100%;"
          @grid-ready="onGridReady"
          :columnDefs="columnDefs"
          :defaultColDef="defaultColDef"
          :autoGroupColumnDef="autoGroupColumnDef"
          :pivotMode="true"
          :rowData="rowData"></ag-grid-vue>
        </div>
        </div>
    `,
  components: {
    "ag-grid-vue": AgGridVue,
  },
  setup(props) {
    const gridApi = shallowRef<GridApi | null>(null);
    const columnDefs = ref<ColDef[]>([
      { field: "athlete" },
      { field: "country", rowGroup: true },
      { field: "sport" },
      { field: "year", pivot: true },
      { field: "age" },
      { field: "gold", aggFunc: "sum" },
      { field: "silver", aggFunc: "sum" },
      { field: "bronze", aggFunc: "sum" },
    ]);
    const defaultColDef = ref<ColDef>({
      flex: 1,
      minWidth: 150,
    });
    const autoGroupColumnDef = ref<ColDef>({
      minWidth: 250,
    });
    const rowData = ref<any[]>(null);

    function onApplyBeforePivotOrAgg() {
      applyBeforePivotOrAgg = !applyBeforePivotOrAgg;
      gridApi.value!.setGridOption(
        "applyQuickFilterBeforePivotOrAgg",
        applyBeforePivotOrAgg,
      );
      document.querySelector("#applyBeforePivotOrAgg")!.textContent =
        `Apply ${applyBeforePivotOrAgg ? "After" : "Before"} Pivot/Aggregation`;
    }
    function onFilterTextBoxChanged() {
      gridApi.value!.setGridOption(
        "quickFilterText",
        (document.getElementById("filter-text-box") as HTMLInputElement).value,
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
      autoGroupColumnDef,
      rowData,
      onGridReady,
      onApplyBeforePivotOrAgg,
      onFilterTextBoxChanged,
    };
  },
});

createApp(VueExample).mount("#app");
