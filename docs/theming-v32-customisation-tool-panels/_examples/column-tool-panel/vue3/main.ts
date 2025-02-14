import {
  createApp,
  defineComponent,
  onBeforeMount,
  ref,
  shallowRef,
} from "vue";
import { AgGridVue } from "ag-grid-vue3";
import "./styles.css";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import {
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ModuleRegistry,
  NumberEditorModule,
  NumberFilterModule,
  SideBarDef,
  TextEditorModule,
  Theme,
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
  NumberEditorModule,
  TextEditorModule,
  NumberFilterModule,
  ClientSideRowModelModule,
  ColumnsToolPanelModule,
  ColumnMenuModule,
  ContextMenuModule,
  PivotModule,
  SetFilterModule,
  ValidationModule /* Development Only */,
]);

const VueExample = defineComponent({
  template: `
        <div style="height: 100%">
                <ag-grid-vue
      style="width: 100%; height: 100%;"
      class="ag-theme-quartz"
      @grid-ready="onGridReady"
      :theme="theme"
      :rowData="rowData"
      :columnDefs="columnDefs"
      :defaultColDef="defaultColDef"
      :sideBar="sideBar"></ag-grid-vue>
        </div>
    `,
  components: {
    "ag-grid-vue": AgGridVue,
  },
  setup(props) {
    const gridApi = shallowRef<GridApi<IOlympicData> | null>(null);
    const theme = ref<Theme | "legacy">("legacy");
    const columnDefs = ref<(ColDef | ColGroupDef)[]>([
      {
        headerName: "Athlete",
        children: [
          { field: "athlete", minWidth: 170, rowGroup: true },
          { field: "age", rowGroup: true },
          { field: "country" },
        ],
      },
      {
        headerName: "Event",
        children: [{ field: "year" }, { field: "date" }, { field: "sport" }],
      },
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
      editable: true,
      filter: true,
    });
    const sideBar = ref<SideBarDef | string | string[] | boolean | null>(
      "columns",
    );
    const rowData = ref<IOlympicData[]>(null);

    const onGridReady = (params: GridReadyEvent) => {
      gridApi.value = params.api;

      const updateData = (data) => (rowData.value = data);

      fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
        .then((resp) => resp.json())
        .then((data) => updateData(data));
    };

    return {
      gridApi,
      theme,
      rowData,
      columnDefs,
      defaultColDef,
      sideBar,
      onGridReady,
    };
  },
});

createApp(VueExample).mount("#app");
