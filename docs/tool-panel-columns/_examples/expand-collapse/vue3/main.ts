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
  SideBarDef,
  TextFilterModule,
  ValidationModule,
  createGrid,
} from "ag-grid-community";
import {
  ColumnMenuModule,
  ColumnsToolPanelModule,
  ContextMenuModule,
  PivotModule,
  SetFilterModule,
} from "ag-grid-enterprise";
import { IOlympicData } from "./interfaces";
ModuleRegistry.registerModules([
  NumberFilterModule,
  ClientSideRowModelModule,
  ColumnsToolPanelModule,
  ColumnMenuModule,
  ContextMenuModule,
  SetFilterModule,
  PivotModule,
  TextFilterModule,
  ValidationModule /* Development Only */,
]);

const VueExample = defineComponent({
  template: `
        <div style="height: 100%">
                <div class="example-wrapper">
      <div>
        <span class="button-group">
          <button v-on:click="expandAllGroups()">Expand All</button>
          <button v-on:click="collapseAllGroups()">Collapse All</button>
          <button v-on:click="expandAthleteAndCompetitionGroups()">Expand Athlete &amp; Competition</button>
          <button v-on:click="collapseCompetitionGroups()">Collapse Competition</button>
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
    const columnDefs = ref<(ColDef | ColGroupDef)[]>([
      {
        groupId: "athleteGroupId",
        headerName: "Athlete",
        children: [
          {
            headerName: "Name",
            field: "athlete",
            minWidth: 200,
            filter: "agTextColumnFilter",
          },
          {
            groupId: "competitionGroupId",
            headerName: "Competition",
            children: [{ field: "year" }, { field: "date", minWidth: 180 }],
          },
        ],
      },
      {
        groupId: "medalsGroupId",
        headerName: "Medals",
        children: [
          { field: "gold" },
          { field: "silver" },
          { field: "bronze" },
          { field: "total" },
        ],
      },
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
    const sideBar = ref<SideBarDef | string | string[] | boolean | null>(
      "columns",
    );
    const rowData = ref<IOlympicData[]>(null);

    function expandAllGroups() {
      const columnToolPanel = gridApi.value!.getToolPanelInstance("columns")!;
      columnToolPanel.expandColumnGroups();
    }
    function collapseAllGroups() {
      const columnToolPanel = gridApi.value!.getToolPanelInstance("columns")!;
      columnToolPanel.collapseColumnGroups();
    }
    function expandAthleteAndCompetitionGroups() {
      const columnToolPanel = gridApi.value!.getToolPanelInstance("columns")!;
      columnToolPanel.expandColumnGroups([
        "athleteGroupId",
        "competitionGroupId",
      ]);
    }
    function collapseCompetitionGroups() {
      const columnToolPanel = gridApi.value!.getToolPanelInstance("columns")!;
      columnToolPanel.collapseColumnGroups(["competitionGroupId"]);
    }
    const onGridReady = (params: GridReadyEvent) => {
      gridApi.value = params.api;

      const columnToolPanel = params.api.getToolPanelInstance("columns")!;
      columnToolPanel.collapseColumnGroups();

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
      expandAllGroups,
      collapseAllGroups,
      expandAthleteAndCompetitionGroups,
      collapseCompetitionGroups,
    };
  },
});

createApp(VueExample).mount("#app");
