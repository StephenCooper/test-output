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
  ColumnApiModule,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ModuleRegistry,
  SideBarDef,
  ValidationModule,
} from "ag-grid-community";
import {
  ColumnsToolPanelModule,
  PivotModule,
  RowGroupingPanelModule,
} from "ag-grid-enterprise";
import { IOlympicData } from "./interfaces";
ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  ColumnsToolPanelModule,
  PivotModule,
  RowGroupingPanelModule,
  ColumnApiModule,
  ValidationModule /* Development Only */,
]);

declare let window: any;

const VueExample = defineComponent({
  template: `
        <div style="height: 100%">
                <div class="test-container">
      <div class="test-header">
        <div class="example-section">
          <button v-on:click="onBtSaveSortState()">Save Sort</button>
          <button v-on:click="onBtRestoreSortState()">Restore Sort</button>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <button v-on:click="onBtSaveOrderAndVisibilityState()">Save Order &amp; Visibility</button>
          <button v-on:click="onBtRestoreOrderAndVisibilityState()">Restore Order &amp; Visibility</button>
        </div>
      </div>
      <ag-grid-vue
        style="width: 100%; height: 100%;"
        @grid-ready="onGridReady"
        :columnDefs="columnDefs"
        :defaultColDef="defaultColDef"
        :autoGroupColumnDef="autoGroupColumnDef"
        :sideBar="sideBar"
        :rowGroupPanelShow="rowGroupPanelShow"
        :pivotPanelShow="pivotPanelShow"
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
      { field: "athlete" },
      { field: "age" },
      { field: "country" },
      { field: "sport" },
      { field: "year" },
      { field: "date" },
      { field: "gold" },
      { field: "silver" },
      { field: "bronze" },
      { field: "total" },
    ]);
    const defaultColDef = ref<ColDef>({
      width: 100,
      enableRowGroup: true,
      enablePivot: true,
      enableValue: true,
    });
    const autoGroupColumnDef = ref<ColDef>({
      minWidth: 200,
    });
    const sideBar = ref<SideBarDef | string | string[] | boolean | null>({
      toolPanels: ["columns"],
    });
    const rowGroupPanelShow = ref<"always" | "onlyWhenGrouping" | "never">(
      "always",
    );
    const pivotPanelShow = ref<"always" | "onlyWhenPivoting" | "never">(
      "always",
    );
    const rowData = ref<IOlympicData[]>(null);

    function onBtSaveSortState() {
      const allState = gridApi.value!.getColumnState();
      const sortState = allState.map((state) => ({
        colId: state.colId,
        sort: state.sort,
        sortIndex: state.sortIndex,
      }));
      window.sortState = sortState;
      console.log("sort state saved", sortState);
    }
    function onBtRestoreSortState() {
      if (!window.sortState) {
        console.log("no sort state to restore, you must save sort state first");
        return;
      }
      gridApi.value!.applyColumnState({
        state: window.sortState,
      });
      console.log("sort state restored");
    }
    function onBtSaveOrderAndVisibilityState() {
      const allState = gridApi.value!.getColumnState();
      const orderAndVisibilityState = allState.map((state) => ({
        colId: state.colId,
        hide: state.hide,
      }));
      window.orderAndVisibilityState = orderAndVisibilityState;
      console.log("order and visibility state saved", orderAndVisibilityState);
    }
    function onBtRestoreOrderAndVisibilityState() {
      if (!window.orderAndVisibilityState) {
        console.log(
          "no order and visibility state to restore by, you must save order and visibility state first",
        );
        return;
      }
      gridApi.value!.applyColumnState({
        state: window.orderAndVisibilityState,
        applyOrder: true,
      });
      console.log("column state restored");
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
      sideBar,
      rowGroupPanelShow,
      pivotPanelShow,
      rowData,
      onGridReady,
      onBtSaveSortState,
      onBtRestoreSortState,
      onBtSaveOrderAndVisibilityState,
      onBtRestoreOrderAndVisibilityState,
    };
  },
});

createApp(VueExample).mount("#app");
