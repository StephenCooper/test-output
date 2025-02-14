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
  FirstDataRenderedEvent,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ModuleRegistry,
  SideBarDef,
  TextEditorModule,
  TextFilterModule,
  ValidationModule,
  createGrid,
} from "ag-grid-community";
import {
  ColumnMenuModule,
  ColumnsToolPanelModule,
  ContextMenuModule,
  FiltersToolPanelModule,
  SetFilterModule,
} from "ag-grid-enterprise";
ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  ColumnsToolPanelModule,
  FiltersToolPanelModule,
  ColumnMenuModule,
  ContextMenuModule,
  SetFilterModule,
  TextFilterModule,
  TextEditorModule,
  ValidationModule /* Development Only */,
]);

function getRowData() {
  return [{ col1: "A" }, { col1: "A" }, { col1: "B" }, { col1: "C" }];
}

const VueExample = defineComponent({
  template: `
        <div style="height: 100%">
                <div class="example-wrapper">
      <div style="margin-bottom: 5px">
        <button v-on:click="updateOne()">Apply Data Update 1</button>
        <button v-on:click="updateTwo()">Apply Data Update 2</button>
        <button v-on:click="reset()" style="margin-left: 5px">Reset</button>
      </div>
      <ag-grid-vue
        style="width: 100%; height: 100%;"
        @grid-ready="onGridReady"
        :columnDefs="columnDefs"
        :sideBar="sideBar"
        :rowData="rowData"
        @first-data-rendered="onFirstDataRendered"></ag-grid-vue>
      </div>
        </div>
    `,
  components: {
    "ag-grid-vue": AgGridVue,
  },
  setup(props) {
    const gridApi = shallowRef<GridApi | null>(null);
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
    const rowData = ref<any[] | null>(getRowData());

    function onFirstDataRendered(params: FirstDataRenderedEvent) {
      params.api.getToolPanelInstance("filters")!.expandFilters();
    }
    function updateOne() {
      const newData = [
        { col1: "A" },
        { col1: "A" },
        { col1: "C" },
        { col1: "D" },
        { col1: "E" },
      ];
      gridApi.value!.setGridOption("rowData", newData);
    }
    function updateTwo() {
      const newData = [
        { col1: "A" },
        { col1: "A" },
        { col1: "B" },
        { col1: "C" },
        { col1: "D" },
        { col1: "E" },
        { col1: "B" },
        { col1: "B" },
      ];
      gridApi.value!.setGridOption("rowData", newData);
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
      columnDefs,
      sideBar,
      rowData,
      onGridReady,
      onFirstDataRendered,
      updateOne,
      updateTwo,
      reset,
    };
  },
});

createApp(VueExample).mount("#app");
