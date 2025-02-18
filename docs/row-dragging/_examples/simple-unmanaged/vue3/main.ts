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
  ColumnApiModule,
  GetRowIdFunc,
  GetRowIdParams,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ModuleRegistry,
  NumberFilterModule,
  RowDragModule,
  RowDragMoveEvent,
  TextFilterModule,
  ValidationModule,
} from "ag-grid-community";
import { getData } from "./data";
ModuleRegistry.registerModules([
  RowDragModule,
  TextFilterModule,
  NumberFilterModule,
  ClientSideRowModelModule,
  ColumnApiModule,
  ValidationModule /* Development Only */,
]);

let immutableStore: any[] = getData();

let sortActive = false;

let filterActive = false;

const VueExample = defineComponent({
  template: `
        <div style="height: 100%">
                <ag-grid-vue
      style="width: 100%; height: 100%;"
      @grid-ready="onGridReady"
      :columnDefs="columnDefs"
      :defaultColDef="defaultColDef"
      :getRowId="getRowId"
      :rowData="rowData"
      @sort-changed="onSortChanged"
      @filter-changed="onFilterChanged"
      @row-drag-move="onRowDragMove"></ag-grid-vue>
        </div>
    `,
  components: {
    "ag-grid-vue": AgGridVue,
  },
  setup(props) {
    const gridApi = shallowRef<GridApi | null>(null);
    const columnDefs = ref<ColDef[]>([
      { field: "athlete", rowDrag: true },
      { field: "country" },
      { field: "year", width: 100 },
      { field: "date" },
      { field: "sport" },
      { field: "gold" },
      { field: "silver" },
      { field: "bronze" },
    ]);
    const defaultColDef = ref<ColDef>({
      width: 170,
      filter: true,
    });
    const rowData = ref<any[]>(null);

    // listen for change on sort changed
    function onSortChanged() {
      const colState = gridApi.value!.getColumnState() || [];
      sortActive = colState.some((c) => c.sort);
      // suppress row drag if either sort or filter is active
      const suppressRowDrag = sortActive || filterActive;
      console.log(
        "sortActive = " +
          sortActive +
          ", filterActive = " +
          filterActive +
          ", allowRowDrag = " +
          suppressRowDrag,
      );
      gridApi.value!.setGridOption("suppressRowDrag", suppressRowDrag);
    }
    // listen for changes on filter changed
    function onFilterChanged() {
      filterActive = gridApi.value!.isAnyFilterPresent();
      // suppress row drag if either sort or filter is active
      const suppressRowDrag = sortActive || filterActive;
      console.log(
        "sortActive = " +
          sortActive +
          ", filterActive = " +
          filterActive +
          ", allowRowDrag = " +
          suppressRowDrag,
      );
      gridApi.value!.setGridOption("suppressRowDrag", suppressRowDrag);
    }
    function onRowDragMove(event: RowDragMoveEvent) {
      const movingNode = event.node;
      const overNode = event.overNode;
      const rowNeedsToMove = movingNode !== overNode;
      if (rowNeedsToMove) {
        // the list of rows we have is data, not row nodes, so extract the data
        const movingData = movingNode.data;
        const overData = overNode!.data;
        const fromIndex = immutableStore.indexOf(movingData);
        const toIndex = immutableStore.indexOf(overData);
        const newStore = immutableStore.slice();
        moveInArray(newStore, fromIndex, toIndex);
        immutableStore = newStore;
        gridApi.value!.setGridOption("rowData", newStore);
        gridApi.value!.clearFocusedCell();
      }
      function moveInArray(arr: any[], fromIndex: number, toIndex: number) {
        const element = arr[fromIndex];
        arr.splice(fromIndex, 1);
        arr.splice(toIndex, 0, element);
      }
    }
    const onGridReady = (params: GridReadyEvent) => {
      gridApi.value = params.api;

      // add id to each item, needed for immutable store to work
      immutableStore.forEach(function (data, index) {
        data.id = index;
      });
      params.api.setGridOption("rowData", immutableStore);
    };
    function getRowId(params: GetRowIdParams) {
      return String(params.data.id);
    }

    return {
      gridApi,
      columnDefs,
      defaultColDef,
      getRowId,
      rowData,
      onGridReady,
      onSortChanged,
      onFilterChanged,
      onRowDragMove,
    };
  },
});

createApp(VueExample).mount("#app");
