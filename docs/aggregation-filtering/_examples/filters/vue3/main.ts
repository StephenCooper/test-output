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
  NumberFilterModule,
  TextFilterModule,
  UseGroupTotalRow,
  ValidationModule,
} from "ag-grid-community";
import { RowGroupingModule } from "ag-grid-enterprise";
ModuleRegistry.registerModules([
  NumberFilterModule,
  ClientSideRowModelModule,
  RowGroupingModule,
  TextFilterModule,
  ValidationModule /* Development Only */,
]);

const VueExample = defineComponent({
  template: `
        <div style="height: 100%">
                <div class="example-wrapper">
      <div class="example-header">
        <label>
          <span>suppressAggFilteredOnly:</span>
          <input id="suppressAggFilteredOnly" type="checkbox" v-on:change="toggleProperty()">
          </label>
        </div>
        <ag-grid-vue
          style="width: 100%; height: 100%;"
          @grid-ready="onGridReady"
          :columnDefs="columnDefs"
          :defaultColDef="defaultColDef"
          :autoGroupColumnDef="autoGroupColumnDef"
          :groupTotalRow="groupTotalRow"
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
      { field: "country", rowGroup: true, hide: true },
      { field: "year", rowGroup: true, hide: true },
      { field: "sport", filter: "agTextColumnFilter", floatingFilter: true },
      { field: "gold", aggFunc: "sum" },
      { field: "silver", aggFunc: "sum" },
      { field: "bronze", aggFunc: "sum" },
    ]);
    const defaultColDef = ref<ColDef>({
      flex: 1,
      minWidth: 150,
    });
    const autoGroupColumnDef = ref<ColDef>({
      minWidth: 300,
    });
    const groupTotalRow = ref<"top" | "bottom" | UseGroupTotalRow>("bottom");
    const rowData = ref<any[]>(null);

    function toggleProperty() {
      const enable = document.querySelector<HTMLInputElement>(
        "#suppressAggFilteredOnly",
      )!.checked;
      gridApi.value.setGridOption("suppressAggFilteredOnly", enable);
    }
    const onGridReady = (params: GridReadyEvent) => {
      gridApi.value = params.api;

      params.api.setFilterModel({
        sport: {
          type: "contains",
          filter: "Swimming",
        },
      });

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
      groupTotalRow,
      rowData,
      onGridReady,
      toggleProperty,
    };
  },
});

createApp(VueExample).mount("#app");
