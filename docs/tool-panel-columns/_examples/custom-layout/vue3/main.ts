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

const sortedToolPanelColumnDefs = [
  {
    headerName: "Athlete",
    children: [
      { field: "age" },
      { field: "country" },
      { headerName: "Name", field: "athlete" },
    ],
  },
  {
    headerName: "Competition",
    children: [{ field: "date" }, { field: "year" }],
  },
  {
    headerName: "Medals",
    children: [
      { field: "bronze" },
      { field: "gold" },
      { field: "silver" },
      { field: "total" },
    ],
  },
  { colId: "sport", field: "sport" },
];

const customToolPanelColumnDefs = [
  {
    headerName: "Dummy Group 1",
    children: [
      { field: "age" },
      { headerName: "Name", field: "athlete" },
      {
        headerName: "Dummy Group 2",
        children: [{ colId: "sport" }, { field: "country" }],
      },
    ],
  },
  {
    headerName: "Medals",
    children: [
      { field: "total" },
      { field: "bronze" },
      {
        headerName: "Dummy Group 3",
        children: [{ field: "silver" }, { field: "gold" }],
      },
    ],
  },
];

const VueExample = defineComponent({
  template: `
        <div style="height: 100%">
                <div class="example-wrapper">
      <div>
        <span class="button-group">
          <button v-on:click="setCustomSortLayout()">Custom Sort Layout</button>
          <button v-on:click="setCustomGroupLayout()">Custom Group Layout</button>
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
        headerName: "Athlete",
        children: [
          {
            headerName: "Name",
            field: "athlete",
            minWidth: 200,
            filter: "agTextColumnFilter",
          },
          { field: "age" },
          { field: "country", minWidth: 200 },
        ],
      },
      {
        headerName: "Competition",
        children: [{ field: "year" }, { field: "date", minWidth: 180 }],
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
          toolPanelParams: {
            // prevents custom layout changing when columns are reordered in the grid
            suppressSyncLayoutWithGrid: true,
            // prevents columns being reordered from the columns tool panel
            suppressColumnMove: true,
          },
        },
      ],
      defaultToolPanel: "columns",
    });
    const rowData = ref<IOlympicData[]>(null);

    function setCustomSortLayout() {
      const columnToolPanel = gridApi.value!.getToolPanelInstance("columns");
      columnToolPanel!.setColumnLayout(sortedToolPanelColumnDefs);
    }
    function setCustomGroupLayout() {
      const columnToolPanel = gridApi.value!.getToolPanelInstance("columns");
      columnToolPanel!.setColumnLayout(customToolPanelColumnDefs);
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
      setCustomSortLayout,
      setCustomGroupLayout,
    };
  },
});

createApp(VueExample).mount("#app");
