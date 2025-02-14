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
  Column,
  ColumnApiModule,
  ColumnMovedEvent,
  ColumnPinnedEvent,
  ColumnPivotChangedEvent,
  ColumnResizedEvent,
  ColumnRowGroupChangedEvent,
  ColumnValueChangedEvent,
  ColumnVisibleEvent,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ModuleRegistry,
  SortChangedEvent,
  ValidationModule,
  createGrid,
} from "ag-grid-community";
import { PivotModule } from "ag-grid-enterprise";
import { IOlympicData } from "./interfaces";
ModuleRegistry.registerModules([
  ColumnApiModule,
  ClientSideRowModelModule,
  PivotModule,
  ValidationModule /* Development Only */,
]);

const VueExample = defineComponent({
  template: `
        <div style="height: 100%">
                <div class="test-container">
      <div class="test-header">
        <div class="test-button-row">
          <div class="test-button-group">
            <button v-on:click="onBtSortOn()">Sort On</button>
            <br />
            <button v-on:click="onBtSortOff()">Sort Off</button>
          </div>
          <div class="test-button-group">
            <button v-on:click="onBtWidthNarrow()">Width Narrow</button>
            <br />
            <button v-on:click="onBtWidthNormal()">Width Normal</button>
          </div>
          <div class="test-button-group">
            <button v-on:click="onBtHide()">Hide Cols</button>
            <br />
            <button v-on:click="onBtShow()">Show Cols</button>
          </div>
          <div class="test-button-group">
            <button v-on:click="onBtReverseOrder()">Reverse Medal Order</button>
            <br />
            <button v-on:click="onBtNormalOrder()">Normal Medal Order</button>
          </div>
          <div class="test-button-group">
            <button v-on:click="onBtRowGroupOn()">Row Group On</button>
            <br />
            <button v-on:click="onBtRowGroupOff()">Row Group Off</button>
          </div>
          <div class="test-button-group">
            <button v-on:click="onBtAggFuncOn()">Agg Func On</button>
            <br />
            <button v-on:click="onBtAggFuncOff()">Agg Func Off</button>
          </div>
          <div class="test-button-group">
            <button v-on:click="onBtPivotOn()">Pivot On</button>
            <br />
            <button v-on:click="onBtPivotOff()">Pivot Off</button>
          </div>
          <div class="test-button-group">
            <button v-on:click="onBtPinnedOn()">Pinned On</button>
            <br />
            <button v-on:click="onBtPinnedOff()">Pinned Off</button>
          </div>
        </div>
      </div>
      <ag-grid-vue
        style="width: 100%; height: 100%;"
        @grid-ready="onGridReady"
        :columnDefs="columnDefs"
        :defaultColDef="defaultColDef"
        :rowData="rowData"
        @sort-changed="onSortChanged"
        @column-resized="onColumnResized"
        @column-visible="onColumnVisible"
        @column-pivot-changed="onColumnPivotChanged"
        @column-row-group-changed="onColumnRowGroupChanged"
        @column-value-changed="onColumnValueChanged"
        @column-moved="onColumnMoved"
        @column-pinned="onColumnPinned"></ag-grid-vue>
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
      { field: "gold" },
      { field: "silver" },
      { field: "bronze" },
    ]);
    const defaultColDef = ref<ColDef>({
      width: 150,
      enableRowGroup: true,
      enablePivot: true,
      enableValue: true,
    });
    const rowData = ref<IOlympicData[]>(null);

    function onSortChanged(e: SortChangedEvent) {
      console.log("Event Sort Changed", e);
    }
    function onColumnResized(e: ColumnResizedEvent) {
      console.log("Event Column Resized", e);
    }
    function onColumnVisible(e: ColumnVisibleEvent) {
      console.log("Event Column Visible", e);
    }
    function onColumnPivotChanged(e: ColumnPivotChangedEvent) {
      console.log("Event Pivot Changed", e);
    }
    function onColumnRowGroupChanged(e: ColumnRowGroupChangedEvent) {
      console.log("Event Row Group Changed", e);
    }
    function onColumnValueChanged(e: ColumnValueChangedEvent) {
      console.log("Event Value Changed", e);
    }
    function onColumnMoved(e: ColumnMovedEvent) {
      console.log("Event Column Moved", e);
    }
    function onColumnPinned(e: ColumnPinnedEvent) {
      console.log("Event Column Pinned", e);
    }
    function onBtSortOn() {
      gridApi.value!.applyColumnState({
        state: [
          { colId: "age", sort: "desc" },
          { colId: "athlete", sort: "asc" },
        ],
      });
    }
    function onBtSortOff() {
      gridApi.value!.applyColumnState({
        defaultState: { sort: null },
      });
    }
    function onBtWidthNarrow() {
      gridApi.value!.applyColumnState({
        state: [
          { colId: "age", width: 100 },
          { colId: "athlete", width: 100 },
        ],
      });
    }
    function onBtWidthNormal() {
      gridApi.value!.applyColumnState({
        state: [
          { colId: "age", width: 200 },
          { colId: "athlete", width: 200 },
        ],
      });
    }
    function onBtHide() {
      gridApi.value!.applyColumnState({
        state: [
          { colId: "age", hide: true },
          { colId: "athlete", hide: true },
        ],
      });
    }
    function onBtShow() {
      gridApi.value!.applyColumnState({
        defaultState: { hide: false },
      });
    }
    function onBtPivotOn() {
      gridApi.value!.setGridOption("pivotMode", true);
      gridApi.value!.applyColumnState({
        state: [{ colId: "country", pivot: true }],
      });
    }
    function onBtPivotOff() {
      gridApi.value!.setGridOption("pivotMode", false);
      gridApi.value!.applyColumnState({
        defaultState: { pivot: false },
      });
    }
    function onBtRowGroupOn() {
      gridApi.value!.applyColumnState({
        state: [{ colId: "sport", rowGroup: true }],
      });
    }
    function onBtRowGroupOff() {
      gridApi.value!.applyColumnState({
        defaultState: { rowGroup: false },
      });
    }
    function onBtAggFuncOn() {
      gridApi.value!.applyColumnState({
        state: [
          { colId: "gold", aggFunc: "sum" },
          { colId: "silver", aggFunc: "sum" },
          { colId: "bronze", aggFunc: "sum" },
        ],
      });
    }
    function onBtAggFuncOff() {
      gridApi.value!.applyColumnState({
        defaultState: { aggFunc: null },
      });
    }
    function onBtNormalOrder() {
      gridApi.value!.applyColumnState({
        state: [
          { colId: "athlete" },
          { colId: "age" },
          { colId: "country" },
          { colId: "sport" },
          { colId: "gold" },
          { colId: "silver" },
          { colId: "bronze" },
        ],
        applyOrder: true,
      });
    }
    function onBtReverseOrder() {
      gridApi.value!.applyColumnState({
        state: [
          { colId: "athlete" },
          { colId: "age" },
          { colId: "country" },
          { colId: "sport" },
          { colId: "bronze" },
          { colId: "silver" },
          { colId: "gold" },
        ],
        applyOrder: true,
      });
    }
    function onBtPinnedOn() {
      gridApi.value!.applyColumnState({
        state: [
          { colId: "athlete", pinned: "left" },
          { colId: "age", pinned: "right" },
        ],
      });
    }
    function onBtPinnedOff() {
      gridApi.value!.applyColumnState({
        defaultState: { pinned: null },
      });
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
      onSortChanged,
      onColumnResized,
      onColumnVisible,
      onColumnPivotChanged,
      onColumnRowGroupChanged,
      onColumnValueChanged,
      onColumnMoved,
      onColumnPinned,
      onBtSortOn,
      onBtSortOff,
      onBtWidthNarrow,
      onBtWidthNormal,
      onBtHide,
      onBtShow,
      onBtPivotOn,
      onBtPivotOff,
      onBtRowGroupOn,
      onBtRowGroupOff,
      onBtAggFuncOn,
      onBtAggFuncOff,
      onBtNormalOrder,
      onBtReverseOrder,
      onBtPinnedOn,
      onBtPinnedOff,
    };
  },
});

createApp(VueExample).mount("#app");
