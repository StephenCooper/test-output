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
  ClientSideRowModelApiModule,
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  GetRowIdFunc,
  GridApi,
  GridOptions,
  GridReadyEvent,
  HighlightChangesModule,
  ModuleRegistry,
  NumberFilterModule,
  RowApiModule,
  TextFilterModule,
  ValidationModule,
  createGrid,
} from "ag-grid-community";
import { RowGroupingModule, SetFilterModule } from "ag-grid-enterprise";
import { createDataItem, getData } from "./data";
ModuleRegistry.registerModules([
  ClientSideRowModelApiModule,
  TextFilterModule,
  SetFilterModule,
  RowApiModule,
  HighlightChangesModule,
  ClientSideRowModelModule,
  RowGroupingModule,
  NumberFilterModule,
  ValidationModule /* Development Only */,
]);

const VueExample = defineComponent({
  template: `
        <div style="height: 100%">
                <div class="test-container">
      <div class="test-header">
        <button v-on:click="onBtnApply()">Apply Transaction</button>
        <button v-on:click="onBtnRefreshModel()">Refresh Model</button>
      </div>
      <ag-grid-vue
        style="width: 100%; height: 100%;"
        class="test-grid"
        @grid-ready="onGridReady"
        :getRowId="getRowId"
        :columnDefs="columnDefs"
        :defaultColDef="defaultColDef"
        :suppressModelUpdateAfterUpdateTransaction="true"
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
      { field: "name" },
      { field: "laptop" },
      {
        field: "fixed",
        enableCellChangeFlash: true,
      },
      {
        field: "value",
        enableCellChangeFlash: true,
        sort: "desc",
      },
    ]);
    const defaultColDef = ref<ColDef>({
      flex: 1,
      filter: true,
      floatingFilter: true,
    });
    const rowData = ref<any[]>(null);

    function onBtnApply() {
      const updatedItems: any[] = [];
      gridApi.value.forEachNode((rowNode) => {
        const newValue = Math.floor(Math.random() * 100) + 10;
        const newBoolean = Boolean(Math.round(Math.random()));
        const newItem = createDataItem(
          rowNode.data.name,
          rowNode.data.laptop,
          newBoolean,
          newValue,
          rowNode.data.id,
        );
        updatedItems.push(newItem);
      });
      gridApi.value.applyTransaction({ update: updatedItems });
    }
    function onBtnRefreshModel() {
      gridApi.value.refreshClientSideRowModel("filter");
    }
    const onGridReady = (params: GridReadyEvent) => {
      gridApi.value = params.api;

      params.api
        .setColumnFilterModel("fixed", {
          filterType: "set",
          values: ["true"],
        })
        .then(() => {
          params.api.onFilterChanged();
        });
      params.api.setGridOption("rowData", getData());
    };
    function getRowId(params) {
      return String(params.data.id);
    }

    return {
      gridApi,
      getRowId,
      columnDefs,
      defaultColDef,
      rowData,
      onGridReady,
      onBtnApply,
      onBtnRefreshModel,
    };
  },
});

createApp(VueExample).mount("#app");
