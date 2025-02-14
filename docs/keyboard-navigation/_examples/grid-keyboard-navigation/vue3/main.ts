import {
  createApp,
  defineComponent,
  onBeforeMount,
  ref,
  shallowRef,
} from "vue";
import { AgGridVue } from "ag-grid-vue3";
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
  RowSelectionModule,
  RowSelectionOptions,
  SideBarDef,
  TextEditorModule,
  ValidationModule,
} from "ag-grid-community";
import {
  ClipboardModule,
  ColumnMenuModule,
  ColumnsToolPanelModule,
  ContextMenuModule,
  FiltersToolPanelModule,
  PivotModule,
  SetFilterModule,
} from "ag-grid-enterprise";
import { IOlympicData } from "./interfaces";
ModuleRegistry.registerModules([
  NumberEditorModule,
  TextEditorModule,
  RowSelectionModule,
  ClientSideRowModelModule,
  ColumnsToolPanelModule,
  FiltersToolPanelModule,
  ColumnMenuModule,
  ContextMenuModule,
  SetFilterModule,
  NumberFilterModule,
  ClipboardModule,
  PivotModule,
  ValidationModule /* Development Only */,
]);

const VueExample = defineComponent({
  template: `
        <div style="height: 100%">
                <ag-grid-vue
      style="width: 100%; height: 100%;"
      @grid-ready="onGridReady"
      :columnDefs="columnDefs"
      :rowSelection="rowSelection"
      :defaultColDef="defaultColDef"
      :sideBar="sideBar"
      :rowData="rowData"></ag-grid-vue>
        </div>
    `,
  components: {
    "ag-grid-vue": AgGridVue,
  },
  setup(props) {
    const gridApi = shallowRef<GridApi<IOlympicData> | null>(null);
    const columnDefs = ref<(ColDef | ColGroupDef)[]>([
      {
        headerName: "Participant",
        children: [
          { field: "athlete", minWidth: 170 },
          { field: "country", minWidth: 150 },
        ],
      },
      { field: "sport" },
      {
        headerName: "Medals",
        children: [
          {
            field: "total",
            columnGroupShow: "closed",
            filter: "agNumberColumnFilter",
            width: 120,
            flex: 0,
          },
          {
            field: "gold",
            columnGroupShow: "open",
            filter: "agNumberColumnFilter",
            width: 100,
            flex: 0,
          },
          {
            field: "silver",
            columnGroupShow: "open",
            filter: "agNumberColumnFilter",
            width: 100,
            flex: 0,
          },
          {
            field: "bronze",
            columnGroupShow: "open",
            filter: "agNumberColumnFilter",
            width: 100,
            flex: 0,
          },
        ],
      },
      { field: "year", filter: "agNumberColumnFilter" },
    ]);
    const rowSelection = ref<RowSelectionOptions | "single" | "multiple">({
      mode: "multiRow",
    });
    const defaultColDef = ref<ColDef>({
      editable: true,
      minWidth: 100,
      filter: true,
      floatingFilter: true,
      flex: 1,
    });
    const sideBar = ref<SideBarDef | string | string[] | boolean | null>({
      toolPanels: ["columns", "filters"],
      defaultToolPanel: "",
    });
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
      columnDefs,
      rowSelection,
      defaultColDef,
      sideBar,
      rowData,
      onGridReady,
    };
  },
});

createApp(VueExample).mount("#app");
