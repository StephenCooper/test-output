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
  SideBarDef,
  ValidationModule,
} from "ag-grid-community";
import {
  ColumnMenuModule,
  ColumnsToolPanelModule,
  ContextMenuModule,
  PivotModule,
} from "ag-grid-enterprise";
import { IOlympicData } from "./interfaces";
ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  ColumnsToolPanelModule,
  ColumnMenuModule,
  ContextMenuModule,
  PivotModule,
  ValidationModule /* Development Only */,
]);

const VueExample = defineComponent({
  template: `
        <div style="height: 100%">
                <div class="example-wrapper">
      <div>
        <span class="button-group">
          <button v-on:click="showPivotModeSection()">Show Pivot Mode Section</button>
          <button v-on:click="showRowGroupsSection()">Show Row Groups Section</button>
          <button v-on:click="showValuesSection()">Show Values Section</button>
          <button v-on:click="showPivotSection()">Show Pivot Section</button>
        </span>
      </div>
      <ag-grid-vue
        style="width: 100%; height: 100%;"
        @grid-ready="onGridReady"
        :columnDefs="columnDefs"
        :defaultColDef="defaultColDef"
        :autoGroupColumnDef="autoGroupColumnDef"
        :sideBar="sideBar"
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
      { headerName: "Name", field: "athlete", minWidth: 200 },
      { field: "age", enableRowGroup: true },
      { field: "country", minWidth: 200 },
      { field: "year" },
      { field: "date", suppressColumnsToolPanel: true, minWidth: 180 },
      { field: "sport", minWidth: 200 },
      { field: "gold", aggFunc: "sum" },
      { field: "silver", aggFunc: "sum" },
      { field: "bronze", aggFunc: "sum" },
      { field: "total", aggFunc: "sum" },
    ]);
    const defaultColDef = ref<ColDef>({
      flex: 1,
      minWidth: 100,
      enablePivot: true,
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
          toolPanelParams: {
            suppressRowGroups: true,
            suppressValues: true,
            suppressPivots: true,
            suppressPivotMode: true,
            suppressColumnFilter: true,
            suppressColumnSelectAll: true,
            suppressColumnExpandAll: true,
          },
        },
      ],
      defaultToolPanel: "columns",
    });
    const rowData = ref<IOlympicData[]>(null);

    function showPivotModeSection() {
      const columnToolPanel = gridApi.value!.getToolPanelInstance("columns")!;
      columnToolPanel.setPivotModeSectionVisible(true);
    }
    function showRowGroupsSection() {
      const columnToolPanel = gridApi.value!.getToolPanelInstance("columns")!;
      columnToolPanel.setRowGroupsSectionVisible(true);
    }
    function showValuesSection() {
      const columnToolPanel = gridApi.value!.getToolPanelInstance("columns")!;
      columnToolPanel.setValuesSectionVisible(true);
    }
    function showPivotSection() {
      const columnToolPanel = gridApi.value!.getToolPanelInstance("columns")!;
      columnToolPanel.setPivotSectionVisible(true);
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
      showPivotModeSection,
      showRowGroupsSection,
      showValuesSection,
      showPivotSection,
    };
  },
});

createApp(VueExample).mount("#app");
