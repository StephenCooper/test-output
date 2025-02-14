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
  CellEditingStartedEvent,
  CellEditingStoppedEvent,
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ModuleRegistry,
  NumberEditorModule,
  PinnedRowModule,
  RowEditingStartedEvent,
  RowEditingStoppedEvent,
  RowPinnedType,
  TextEditorModule,
  ValidationModule,
} from "ag-grid-community";
import { getData } from "./data";
ModuleRegistry.registerModules([
  NumberEditorModule,
  TextEditorModule,
  PinnedRowModule,
  ClientSideRowModelModule,
  ValidationModule /* Development Only */,
]);

function getPinnedTopData() {
  return [
    {
      firstName: "##",
      lastName: "##",
      gender: "##",
      address: "##",
      mood: "##",
      country: "##",
    },
  ];
}

function getPinnedBottomData() {
  return [
    {
      firstName: "##",
      lastName: "##",
      gender: "##",
      address: "##",
      mood: "##",
      country: "##",
    },
  ];
}

const VueExample = defineComponent({
  template: `
        <div style="height: 100%">
                <div class="example-wrapper">
      <div>
        <div style="margin-bottom: 5px; display: flex">
          <button v-on:click="onBtStartEditing(undefined)">edit (0)</button>
          <button v-on:click="onBtStartEditing('Backspace')">edit (0, Backspace)</button>
          <button v-on:click="onBtStartEditing('T')">edit (0, 'T')</button>
          <button v-on:click="onBtStartEditing(undefined, 'top')">edit (0, Top)</button>
          <button v-on:click="onBtStartEditing(undefined, 'bottom')">edit (0, Bottom)</button>
        </div>
        <div style="margin-bottom: 5px; display: flex">
          <button v-on:click="onBtStopEditing()">stop ()</button>
          <button v-on:click="onBtNextCell()">next ()</button>
          <button v-on:click="onBtPreviousCell()">previous ()</button>
          <button v-on:click="onBtWhich()">which ()</button>
        </div>
      </div>
      <div class="grid-wrapper">
        <ag-grid-vue
          style="width: 100%; height: 100%;"
          @grid-ready="onGridReady"
          :columnDefs="columnDefs"
          :defaultColDef="defaultColDef"
          :rowData="rowData"
          :pinnedTopRowData="pinnedTopRowData"
          :pinnedBottomRowData="pinnedBottomRowData"
          @row-editing-started="onRowEditingStarted"
          @row-editing-stopped="onRowEditingStopped"
          @cell-editing-started="onCellEditingStarted"
          @cell-editing-stopped="onCellEditingStopped"></ag-grid-vue>
        </div>
      </div>
        </div>
    `,
  components: {
    "ag-grid-vue": AgGridVue,
  },
  setup(props) {
    const gridApi = shallowRef<GridApi | null>(null);
    const columnDefs = ref<ColDef[]>([
      { field: "firstName" },
      { field: "lastName" },
      { field: "gender" },
      { field: "age" },
      { field: "mood" },
      { field: "country" },
      { field: "address", minWidth: 550 },
    ]);
    const defaultColDef = ref<ColDef>({
      flex: 1,
      minWidth: 110,
      editable: true,
    });
    const rowData = ref<any[] | null>(getData());
    const pinnedTopRowData = ref<any[]>(getPinnedTopData());
    const pinnedBottomRowData = ref<any[]>(getPinnedBottomData());

    function onRowEditingStarted(event: RowEditingStartedEvent) {
      console.log("never called - not doing row editing");
    }
    function onRowEditingStopped(event: RowEditingStoppedEvent) {
      console.log("never called - not doing row editing");
    }
    function onCellEditingStarted(event: CellEditingStartedEvent) {
      console.log("cellEditingStarted");
    }
    function onCellEditingStopped(event: CellEditingStoppedEvent) {
      console.log("cellEditingStopped");
    }
    function onBtStopEditing() {
      gridApi.value!.stopEditing();
    }
    function onBtStartEditing(key?: string, pinned?: RowPinnedType) {
      gridApi.value!.setFocusedCell(0, "lastName", pinned);
      gridApi.value!.startEditingCell({
        rowIndex: 0,
        colKey: "lastName",
        // set to 'top', 'bottom' or undefined
        rowPinned: pinned,
        key: key,
      });
    }
    function onBtNextCell() {
      gridApi.value!.tabToNextCell();
    }
    function onBtPreviousCell() {
      gridApi.value!.tabToPreviousCell();
    }
    function onBtWhich() {
      const cellDefs = gridApi.value!.getEditingCells();
      if (cellDefs.length > 0) {
        const cellDef = cellDefs[0];
        console.log(
          "editing cell is: row = " +
            cellDef.rowIndex +
            ", col = " +
            cellDef.column.getId() +
            ", floating = " +
            cellDef.rowPinned,
        );
      } else {
        console.log("no cells are editing");
      }
    }
    const onGridReady = (params: GridReadyEvent) => {
      gridApi.value = params.api;
    };

    return {
      gridApi,
      columnDefs,
      defaultColDef,
      rowData,
      pinnedTopRowData,
      pinnedBottomRowData,
      onGridReady,
      onRowEditingStarted,
      onRowEditingStopped,
      onCellEditingStarted,
      onCellEditingStopped,
      onBtStopEditing,
      onBtStartEditing,
      onBtNextCell,
      onBtPreviousCell,
      onBtWhich,
    };
  },
});

createApp(VueExample).mount("#app");
