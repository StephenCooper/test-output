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
} from "ag-grid-community";
import { PivotModule } from "ag-grid-enterprise";
import { IOlympicData } from "./interfaces";
ModuleRegistry.registerModules([
  ColumnApiModule,
  ClientSideRowModelModule,
  PivotModule,
  ValidationModule /* Development Only */,
]);

function getColumnDefs(): ColDef[] {
  return [
    { field: "athlete" },
    { field: "age" },
    { field: "country" },
    { field: "sport" },
    { field: "gold" },
    { field: "silver" },
    { field: "bronze" },
  ];
}

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
            <button v-on:click="onBtPivotOn()">Pivot On</button>
            <br />
            <button v-on:click="onBtPivotOff()">Pivot Off</button>
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
            <button v-on:click="onBtPinnedOn()">Pinned On</button>
            <br />
            <button v-on:click="onBtPinnedOff()">Pinned Off</button>
          </div>
        </div>
      </div>
      <ag-grid-vue
        style="width: 100%; height: 100%;"
        @grid-ready="onGridReady"
        :defaultColDef="defaultColDef"
        :columnDefs="columnDefs"
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
    const defaultColDef = ref<ColDef>({
      width: 150,
      enableRowGroup: true,
      enablePivot: true,
      enableValue: true,
    });
    const columnDefs = ref<ColDef[]>(getColumnDefs());
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
      const columnDefs: ColDef[] = getColumnDefs();
      columnDefs.forEach((colDef) => {
        if (colDef.field === "age") {
          colDef.sort = "desc";
        }
        if (colDef.field === "athlete") {
          colDef.sort = "asc";
        }
      });
      gridApi.value!.setGridOption("columnDefs", columnDefs);
    }
    function onBtSortOff() {
      const columnDefs: ColDef[] = getColumnDefs();
      columnDefs.forEach((colDef) => {
        colDef.sort = null;
      });
      gridApi.value!.setGridOption("columnDefs", columnDefs);
    }
    function onBtWidthNarrow() {
      const columnDefs: ColDef[] = getColumnDefs();
      columnDefs.forEach((colDef) => {
        if (colDef.field === "age" || colDef.field === "athlete") {
          colDef.width = 100;
        }
      });
      gridApi.value!.setGridOption("columnDefs", columnDefs);
    }
    function onBtWidthNormal() {
      const columnDefs: ColDef[] = getColumnDefs();
      columnDefs.forEach((colDef) => {
        colDef.width = 200;
      });
      gridApi.value!.setGridOption("columnDefs", columnDefs);
    }
    function onBtHide() {
      const columnDefs: ColDef[] = getColumnDefs();
      columnDefs.forEach((colDef) => {
        if (colDef.field === "age" || colDef.field === "athlete") {
          colDef.hide = true;
        }
      });
      gridApi.value!.setGridOption("columnDefs", columnDefs);
    }
    function onBtShow() {
      const columnDefs: ColDef[] = getColumnDefs();
      columnDefs.forEach((colDef) => {
        colDef.hide = false;
      });
      gridApi.value!.setGridOption("columnDefs", columnDefs);
    }
    function onBtPivotOn() {
      gridApi.value!.setGridOption("pivotMode", true);
      const columnDefs: ColDef[] = getColumnDefs();
      columnDefs.forEach((colDef) => {
        if (colDef.field === "country") {
          colDef.pivot = true;
        }
      });
      gridApi.value!.setGridOption("columnDefs", columnDefs);
    }
    function onBtPivotOff() {
      gridApi.value!.setGridOption("pivotMode", false);
      const columnDefs: ColDef[] = getColumnDefs();
      columnDefs.forEach((colDef) => {
        colDef.pivot = false;
      });
      gridApi.value!.setGridOption("columnDefs", columnDefs);
    }
    function onBtRowGroupOn() {
      const columnDefs: ColDef[] = getColumnDefs();
      columnDefs.forEach((colDef) => {
        if (colDef.field === "sport") {
          colDef.rowGroup = true;
        }
      });
      gridApi.value!.setGridOption("columnDefs", columnDefs);
    }
    function onBtRowGroupOff() {
      const columnDefs: ColDef[] = getColumnDefs();
      columnDefs.forEach((colDef) => {
        colDef.rowGroup = false;
      });
      gridApi.value!.setGridOption("columnDefs", columnDefs);
    }
    function onBtAggFuncOn() {
      const columnDefs: ColDef[] = getColumnDefs();
      columnDefs.forEach((colDef) => {
        if (
          colDef.field === "gold" ||
          colDef.field === "silver" ||
          colDef.field === "bronze"
        ) {
          colDef.aggFunc = "sum";
        }
      });
      gridApi.value!.setGridOption("columnDefs", columnDefs);
    }
    function onBtAggFuncOff() {
      const columnDefs: ColDef[] = getColumnDefs();
      columnDefs.forEach((colDef) => {
        colDef.aggFunc = null;
      });
      gridApi.value!.setGridOption("columnDefs", columnDefs);
    }
    function onBtPinnedOn() {
      const columnDefs: ColDef[] = getColumnDefs();
      columnDefs.forEach((colDef) => {
        if (colDef.field === "athlete") {
          colDef.pinned = "left";
        }
        if (colDef.field === "age") {
          colDef.pinned = "right";
        }
      });
      gridApi.value!.setGridOption("columnDefs", columnDefs);
    }
    function onBtPinnedOff() {
      const columnDefs: ColDef[] = getColumnDefs();
      columnDefs.forEach((colDef) => {
        colDef.pinned = null;
      });
      gridApi.value!.setGridOption("columnDefs", columnDefs);
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
      defaultColDef,
      columnDefs,
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
      onBtPinnedOn,
      onBtPinnedOff,
    };
  },
});

createApp(VueExample).mount("#app");
