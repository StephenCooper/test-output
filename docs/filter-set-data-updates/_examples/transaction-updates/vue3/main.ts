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
  FirstDataRenderedEvent,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ModuleRegistry,
  RowApiModule,
  SideBarDef,
  TextEditorModule,
  ValidationModule,
} from "ag-grid-community";
import {
  ColumnMenuModule,
  ColumnsToolPanelModule,
  ContextMenuModule,
  FiltersToolPanelModule,
  SetFilterModule,
} from "ag-grid-enterprise";
ModuleRegistry.registerModules([
  ClientSideRowModelApiModule,
  RowApiModule,
  ClientSideRowModelModule,
  ColumnsToolPanelModule,
  FiltersToolPanelModule,
  ColumnMenuModule,
  ContextMenuModule,
  SetFilterModule,
  TextEditorModule,
  ValidationModule /* Development Only */,
]);

function getRowData() {
  return [
    { col1: "A" },
    { col1: "A" },
    { col1: "B" },
    { col1: "B" },
    { col1: "C" },
    { col1: "C" },
  ];
}

const VueExample = defineComponent({
  template: `
        <div style="height: 100%">
                <div class="example-wrapper">
      <div style="margin-bottom: 5px">
        <label>Transaction Updates: </label>
        <button v-on:click="updateFirstRow()">Update First Displayed Row</button>
        <button v-on:click="addDRow()">Add New 'D' Row</button>
        <button v-on:click="reset()" style="margin-left: 20px">Reset</button>
      </div>
      <ag-grid-vue
        style="width: 100%; height: 100%;"
        @grid-ready="onGridReady"
        :rowData="rowData"
        :columnDefs="columnDefs"
        :sideBar="sideBar"
        @first-data-rendered="onFirstDataRendered"></ag-grid-vue>
      </div>
        </div>
    `,
  components: {
    "ag-grid-vue": AgGridVue,
  },
  setup(props) {
    const gridApi = shallowRef<GridApi | null>(null);
    const rowData = ref<any[] | null>(getRowData());
    const columnDefs = ref<ColDef[]>([
      {
        headerName: "Set Filter Column",
        field: "col1",
        filter: "agSetColumnFilter",
        editable: true,
        minWidth: 250,
      },
    ]);
    const sideBar = ref<SideBarDef | string | string[] | boolean | null>(
      "filters",
    );

    function onFirstDataRendered(params: FirstDataRenderedEvent) {
      params.api.getToolPanelInstance("filters")!.expandFilters();
    }
    function updateFirstRow() {
      const firstRow = gridApi.value!.getDisplayedRowAtIndex(0);
      if (firstRow) {
        const firstRowData = firstRow.data;
        firstRowData["col1"] += "X";
        gridApi.value!.applyTransaction({ update: [firstRowData] });
      }
    }
    function addDRow() {
      gridApi.value!.applyTransaction({ add: [{ col1: "D" }] });
    }
    function reset() {
      gridApi.value!.setFilterModel(null);
      gridApi.value!.setGridOption("rowData", getRowData());
    }
    const onGridReady = (params: GridReadyEvent) => {
      gridApi.value = params.api;
    };

    return {
      gridApi,
      rowData,
      columnDefs,
      sideBar,
      onGridReady,
      onFirstDataRendered,
      updateFirstRow,
      addDRow,
      reset,
    };
  },
});

createApp(VueExample).mount("#app");
