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
  RowDragCancelEvent,
  RowDragEndEvent,
  RowDragEnterEvent,
  RowDragLeaveEvent,
  RowDragModule,
  RowDragMoveEvent,
  TextFilterModule,
  ValidationModule,
  createGrid,
} from "ag-grid-community";
import { IOlympicData } from "./interfaces";
ModuleRegistry.registerModules([
  RowDragModule,
  TextFilterModule,
  NumberFilterModule,
  ClientSideRowModelModule,
  ValidationModule /* Development Only */,
]);

const VueExample = defineComponent({
  template: `
        <div style="height: 100%">
                <div class="example-wrapper">
      <div class="example-header" style="background-color: #ccaa22a9">
        Rows in this example do not move, only events are fired
      </div>
      <ag-grid-vue
        style="width: 100%; height: 100%;"
        @grid-ready="onGridReady"
        :columnDefs="columnDefs"
        :defaultColDef="defaultColDef"
        :rowData="rowData"
        @row-drag-enter="onRowDragEnter"
        @row-drag-end="onRowDragEnd"
        @row-drag-move="onRowDragMove"
        @row-drag-leave="onRowDragLeave"
        @row-drag-cancel="onRowDragCancel"></ag-grid-vue>
      </div>
        </div>
    `,
  components: {
    "ag-grid-vue": AgGridVue,
  },
  setup(props) {
    const gridApi = shallowRef<GridApi<IOlympicData> | null>(null);
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
    const rowData = ref<IOlympicData[]>(null);

    function onRowDragEnter(e: RowDragEnterEvent) {
      console.log("onRowDragEnter", e);
    }
    function onRowDragEnd(e: RowDragEndEvent) {
      console.log("onRowDragEnd", e);
    }
    function onRowDragMove(e: RowDragMoveEvent) {
      console.log("onRowDragMove", e);
    }
    function onRowDragLeave(e: RowDragLeaveEvent) {
      console.log("onRowDragLeave", e);
    }
    function onRowDragCancel(e: RowDragCancelEvent) {
      console.log("onRowDragCancel", e);
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
      onRowDragEnter,
      onRowDragEnd,
      onRowDragMove,
      onRowDragLeave,
      onRowDragCancel,
    };
  },
});

createApp(VueExample).mount("#app");
