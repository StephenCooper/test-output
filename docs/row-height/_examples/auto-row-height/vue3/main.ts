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
  RowAutoHeightModule,
  SideBarDef,
  ValidationModule,
} from "ag-grid-community";
import {
  ColumnMenuModule,
  ColumnsToolPanelModule,
  ContextMenuModule,
  RowGroupingModule,
} from "ag-grid-enterprise";
import { getData } from "./data";
ModuleRegistry.registerModules([
  RowAutoHeightModule,
  ClientSideRowModelModule,
  ColumnsToolPanelModule,
  ColumnMenuModule,
  ContextMenuModule,
  RowGroupingModule,
  ValidationModule /* Development Only */,
]);

const VueExample = defineComponent({
  template: `
        <div style="height: 100%">
                <ag-grid-vue
      style="width: 100%; height: 100%;"
      @grid-ready="onGridReady"
      :columnDefs="columnDefs"
      :sideBar="sideBar"
      :rowData="rowData"></ag-grid-vue>
        </div>
    `,
  components: {
    "ag-grid-vue": AgGridVue,
  },
  setup(props) {
    const gridApi = shallowRef<GridApi | null>(null);
    const columnDefs = ref<ColDef[]>([
      {
        headerName: "Row #",
        field: "rowNumber",
        width: 120,
      },
      {
        field: "autoA",
        width: 300,
        wrapText: true,
        autoHeight: true,
        headerName: "A) Auto Height",
      },
      {
        width: 300,
        field: "autoB",
        wrapText: true,
        headerName: "B) Normal Height",
      },
    ]);
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
            suppressSideButtons: true,
            suppressColumnFilter: true,
            suppressColumnSelectAll: true,
            suppressColumnExpandAll: true,
          },
        },
      ],
      defaultToolPanel: "columns",
    });
    const rowData = ref<any[]>(null);

    const onGridReady = (params: GridReadyEvent) => {
      gridApi.value = params.api;

      // in this example, the CSS styles are loaded AFTER the grid is created,
      // so we put this in a timeout, so height is calculated after styles are applied.
      setTimeout(() => {
        params.api.setGridOption("rowData", getData());
      }, 500);
    };

    return {
      gridApi,
      columnDefs,
      sideBar,
      rowData,
      onGridReady,
    };
  },
});

createApp(VueExample).mount("#app");
