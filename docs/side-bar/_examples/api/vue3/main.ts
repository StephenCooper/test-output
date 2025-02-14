import {
  createApp,
  defineComponent,
  onBeforeMount,
  ref,
  shallowRef,
} from "vue";
import { AgGridVue } from "ag-grid-vue3";
import "./style.css";
import {
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ModuleRegistry,
  NumberFilterModule,
  SideBarDef,
  TextFilterModule,
  ToolPanelSizeChangedEvent,
  ToolPanelVisibleChangedEvent,
  ValidationModule,
  createGrid,
} from "ag-grid-community";
import {
  ColumnsToolPanelModule,
  FiltersToolPanelModule,
  PivotModule,
  SetFilterModule,
} from "ag-grid-enterprise";
import { IOlympicData } from "./interfaces";
ModuleRegistry.registerModules([
  NumberFilterModule,
  ClientSideRowModelModule,
  ColumnsToolPanelModule,
  FiltersToolPanelModule,
  SetFilterModule,
  PivotModule,
  TextFilterModule,
  ValidationModule /* Development Only */,
]);

const VueExample = defineComponent({
  template: `
        <div style="height: 100%">
                <div class="parent-div">
      <div class="api-panel">
        <div class="api-column">
          Visibility
          <button v-on:click="setSideBarVisible(true)">setSideBarVisible(true)</button>
          <button v-on:click="setSideBarVisible(false)">setSideBarVisible(false)</button>
          <button v-on:click="isSideBarVisible()">isSideBarVisible()</button>
        </div>
        <div class="api-column">
          Open &amp; Close
          <button v-on:click="openToolPanel('columns')">openToolPanel('columns')</button>
          <button v-on:click="openToolPanel('filters')">openToolPanel('filters')</button>
          <button v-on:click="closeToolPanel()">closeToolPanel()</button>
          <button v-on:click="getOpenedToolPanel()">getOpenedToolPanel()</button>
        </div>
        <div class="api-column">
          Reset
          <button v-on:click="setSideBar(['filters','columns'])">setSideBar(['filters','columns'])</button>
          <button v-on:click="setSideBar('columns')">setSideBar('columns')</button>
          <button v-on:click="getSideBar()">getSideBar()</button>
        </div>
        <div class="api-column">
          Position
          <button v-on:click="setSideBarPosition('left')">setSideBarPosition('left')</button>
          <button v-on:click="setSideBarPosition('right')">setSideBarPosition('right')</button>
        </div>
      </div>
      <ag-grid-vue
        style="width: 100%; height: 100%;"
        class="grid-div"
        @grid-ready="onGridReady"
        :columnDefs="columnDefs"
        :defaultColDef="defaultColDef"
        :autoGroupColumnDef="autoGroupColumnDef"
        :sideBar="sideBar"
        :rowData="rowData"
        @tool-panel-visible-changed="onToolPanelVisibleChanged"
        @tool-panel-size-changed="onToolPanelSizeChanged"></ag-grid-vue>
      </div>
        </div>
    `,
  components: {
    "ag-grid-vue": AgGridVue,
  },
  setup(props) {
    const gridApi = shallowRef<GridApi<IOlympicData> | null>(null);
    const columnDefs = ref<ColDef[]>([
      { field: "athlete", filter: "agTextColumnFilter", minWidth: 200 },
      { field: "age" },
      { field: "country", minWidth: 200 },
      { field: "year" },
      { field: "date", minWidth: 160 },
      { field: "gold" },
      { field: "silver" },
      { field: "bronze" },
      { field: "total" },
    ]);
    const defaultColDef = ref<ColDef>({
      flex: 1,
      minWidth: 100,
      // allow every column to be aggregated
      enableValue: true,
      // allow every column to be grouped
      enableRowGroup: true,
      // allow every column to be pivoted
      enablePivot: true,
      filter: true,
    });
    const autoGroupColumnDef = ref<ColDef>({
      minWidth: 200,
    });
    const sideBar = ref<SideBarDef | string | string[] | boolean | null>({
      toolPanels: [
        {
          id: "columns",
          labelDefault: "Columns",
          labelKey: "columns",
          iconKey: "columns",
          toolPanel: "agColumnsToolPanel",
        },
        {
          id: "filters",
          labelDefault: "Filters",
          labelKey: "filters",
          iconKey: "filter",
          toolPanel: "agFiltersToolPanel",
        },
      ],
      defaultToolPanel: "filters",
      hiddenByDefault: true,
    });
    const rowData = ref<IOlympicData[]>(null);

    function onToolPanelVisibleChanged(event: ToolPanelVisibleChangedEvent) {
      console.log("toolPanelVisibleChanged", event);
    }
    function onToolPanelSizeChanged(event: ToolPanelSizeChangedEvent) {
      console.log("toolPanelSizeChanged", event);
    }
    function setSideBarVisible(value: boolean) {
      gridApi.value!.setSideBarVisible(value);
    }
    function isSideBarVisible() {
      alert(gridApi.value!.isSideBarVisible());
    }
    function openToolPanel(key: string) {
      gridApi.value!.openToolPanel(key);
    }
    function closeToolPanel() {
      gridApi.value!.closeToolPanel();
    }
    function getOpenedToolPanel() {
      alert(gridApi.value!.getOpenedToolPanel());
    }
    function setSideBar(def: SideBarDef | string | string[] | boolean) {
      gridApi.value!.setGridOption("sideBar", def);
    }
    function getSideBar() {
      const sideBar = gridApi.value!.getSideBar();
      alert(JSON.stringify(sideBar));
      console.log(sideBar);
    }
    function setSideBarPosition(position: "left" | "right") {
      gridApi.value!.setSideBarPosition(position);
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
      rowData,
      onGridReady,
      onToolPanelVisibleChanged,
      onToolPanelSizeChanged,
      setSideBarVisible,
      isSideBarVisible,
      openToolPanel,
      closeToolPanel,
      getOpenedToolPanel,
      setSideBar,
      getSideBar,
      setSideBarPosition,
    };
  },
});

createApp(VueExample).mount("#app");
