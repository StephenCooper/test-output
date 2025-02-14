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
  ISetFilterParams,
  LocaleModule,
  ModuleRegistry,
  SideBarDef,
  ValidationModule,
} from "ag-grid-community";
import {
  ColumnMenuModule,
  ContextMenuModule,
  FiltersToolPanelModule,
  SetFilterModule,
} from "ag-grid-enterprise";
import { getData } from "./data";
ModuleRegistry.registerModules([
  LocaleModule,
  ClientSideRowModelModule,
  FiltersToolPanelModule,
  ColumnMenuModule,
  ContextMenuModule,
  SetFilterModule,
  ValidationModule /* Development Only */,
]);

const VueExample = defineComponent({
  template: `
        <div style="height: 100%">
                <ag-grid-vue
      style="width: 100%; height: 100%;"
      @grid-ready="onGridReady"
      :columnDefs="columnDefs"
      :defaultColDef="defaultColDef"
      :sideBar="sideBar"
      :rowData="rowData"
      :localeText="localeText"></ag-grid-vue>
        </div>
    `,
  components: {
    "ag-grid-vue": AgGridVue,
  },
  setup(props) {
    const gridApi = shallowRef<GridApi | null>(null);
    const columnDefs = ref<ColDef[]>([
      {
        headerName: "Default",
        field: "animal",
        filter: "agSetColumnFilter",
      },
      {
        headerName: "Excel (Windows)",
        field: "animal",
        filter: "agSetColumnFilter",
        filterParams: {
          excelMode: "windows",
        } as ISetFilterParams,
      },
      {
        headerName: "Excel (Mac)",
        field: "animal",
        filter: "agSetColumnFilter",
        filterParams: {
          excelMode: "mac",
        } as ISetFilterParams,
      },
    ]);
    const defaultColDef = ref<ColDef>({
      flex: 1,
      minWidth: 200,
    });
    const sideBar = ref<SideBarDef | string | string[] | boolean | null>(
      "filters",
    );
    const rowData = ref<any[] | null>(getData());
    const localeText = ref<{
      [key: string]: string;
    }>({
      applyFilter: "OK",
      cancelFilter: "Cancel",
      resetFilter: "Clear Filter",
    });

    const onGridReady = (params: GridReadyEvent) => {
      gridApi.value = params.api;
    };

    return {
      gridApi,
      columnDefs,
      defaultColDef,
      sideBar,
      rowData,
      localeText,
      onGridReady,
    };
  },
});

createApp(VueExample).mount("#app");
