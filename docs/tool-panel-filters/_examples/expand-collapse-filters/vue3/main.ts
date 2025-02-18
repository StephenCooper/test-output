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
} from "ag-grid-community";
import {
  ColumnMenuModule,
  ContextMenuModule,
  FiltersToolPanelModule,
  SetFilterModule,
} from "ag-grid-enterprise";
import { IOlympicData } from "./interfaces";
ModuleRegistry.registerModules([
  NumberFilterModule,
  ClientSideRowModelModule,
  FiltersToolPanelModule,
  ColumnMenuModule,
  ContextMenuModule,
  SetFilterModule,
  TextFilterModule,
  ValidationModule /* Development Only */,
]);

const VueExample = defineComponent({
  template: `
        <div style="height: 100%">
                <div class="example-wrapper">
      <div>
        <span class="button-group">
          <button v-on:click="expandYearAndSport()">Expand Year &amp; Sport</button>
          <button v-on:click="collapseYear()">Collapse Year</button>
          <button v-on:click="expandAll()">Expand All</button>
          <button v-on:click="collapseAll()">Collapse All</button>
        </span>
      </div>
      <ag-grid-vue
        style="width: 100%; height: 100%;"
        @grid-ready="onGridReady"
        :columnDefs="columnDefs"
        :defaultColDef="defaultColDef"
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
          { field: "age" },
          {
            groupId: "competitionGroupId",
            headerName: "Competition",
            children: [{ field: "year" }, { field: "date", minWidth: 180 }],
          },
          { field: "country", minWidth: 200 },
        ],
      },
      { colId: "sport", field: "sport", minWidth: 200 },
      {
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
      filter: true,
    });
    const sideBar = ref<SideBarDef | string | string[] | boolean | null>(
      "filters",
    );
    const rowData = ref<IOlympicData[]>(null);

    function collapseAll() {
      gridApi.value!.getToolPanelInstance("filters")!.collapseFilters();
    }
    function expandYearAndSport() {
      gridApi
        .value!.getToolPanelInstance("filters")!
        .expandFilters(["year", "sport"]);
    }
    function collapseYear() {
      gridApi.value!.getToolPanelInstance("filters")!.collapseFilters(["year"]);
    }
    function expandAll() {
      gridApi.value!.getToolPanelInstance("filters")!.expandFilters();
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
      sideBar,
      rowData,
      onGridReady,
      collapseAll,
      expandYearAndSport,
      collapseYear,
      expandAll,
    };
  },
});

createApp(VueExample).mount("#app");
