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
  IsRowFilterable,
  ModuleRegistry,
  NumberFilterModule,
  ValidationModule,
} from "ag-grid-community";
import {
  ColumnMenuModule,
  ContextMenuModule,
  RowGroupingModule,
  SetFilterModule,
} from "ag-grid-enterprise";
ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  ColumnMenuModule,
  ContextMenuModule,
  RowGroupingModule,
  SetFilterModule,
  NumberFilterModule,
  ValidationModule /* Development Only */,
]);

const VueExample = defineComponent({
  template: `
        <div style="height: 100%">
                <div class="example-wrapper">
      <div class="example-header">
        <label>
          <span>groupAggFiltering:</span>
          <input id="groupAggFiltering" type="checkbox" v-on:change="toggleProperty()">
          </label>
        </div>
        <ag-grid-vue
          style="width: 100%; height: 100%;"
          @grid-ready="onGridReady"
          :columnDefs="columnDefs"
          :defaultColDef="defaultColDef"
          :autoGroupColumnDef="autoGroupColumnDef"
          :groupDefaultExpanded="groupDefaultExpanded"
          :groupAggFiltering="true"
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
      { field: "year" },
      { field: "total", aggFunc: "sum", filter: "agNumberColumnFilter" },
    ]);
    const defaultColDef = ref<ColDef>({
      flex: 1,
      floatingFilter: true,
    });
    const autoGroupColumnDef = ref<ColDef>({
      field: "athlete",
    });
    const groupDefaultExpanded = ref(-1);
    const rowData = ref<any[]>(null);

    function toggleProperty() {
      const enable =
        document.querySelector<HTMLInputElement>("#groupAggFiltering")!.checked;
      gridApi.value.setGridOption("groupAggFiltering", enable);
    }
    const onGridReady = (params: GridReadyEvent) => {
      gridApi.value = params.api;

      document.querySelector<HTMLInputElement>("#groupAggFiltering")!.checked =
        true;
      params.api.setFilterModel({
        total: {
          type: "contains",
          filter: "192",
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
      groupDefaultExpanded,
      rowData,
      onGridReady,
      toggleProperty,
    };
  },
});

createApp(VueExample).mount("#app");
