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
  ModuleRegistry,
  SideBarDef,
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
  ValidationModule /* Development Only */,
]);

const filterParams: ISetFilterParams = {
  comparator: (a: string | null, b: string | null) => {
    const valA = a == null ? 0 : parseInt(a);
    const valB = b == null ? 0 : parseInt(b);
    if (valA === valB) return 0;
    return valA > valB ? 1 : -1;
  },
};

function getRowData() {
  const rows = [];
  for (let i = 1; i < 117; i++) {
    rows.push({ age: i });
  }
  return rows;
}

const VueExample = defineComponent({
  template: `
        <div style="height: 100%">
                <ag-grid-vue
      style="width: 100%; height: 100%;"
      @grid-ready="onGridReady"
      :columnDefs="columnDefs"
      :defaultColDef="defaultColDef"
      :rowData="rowData"
      :sideBar="sideBar"></ag-grid-vue>
        </div>
    `,
  components: {
    "ag-grid-vue": AgGridVue,
  },
  setup(props) {
    const gridApi = shallowRef<GridApi | null>(null);
    const columnDefs = ref<ColDef[]>([
      {
        headerName: "Age (No Comparator)",
        field: "age",
        filter: "agSetColumnFilter",
      },
      {
        headerName: "Age (With Comparator)",
        field: "age",
        filter: "agSetColumnFilter",
        filterParams: filterParams,
      },
    ]);
    const defaultColDef = ref<ColDef>({
      flex: 1,
      filter: true,
      cellDataType: false,
    });
    const rowData = ref<any[] | null>(getRowData());
    const sideBar = ref<SideBarDef | string | string[] | boolean | null>(
      "filters",
    );

    const onGridReady = (params: GridReadyEvent) => {
      gridApi.value = params.api;

      params.api.getToolPanelInstance("filters")!.expandFilters();
    };

    return {
      gridApi,
      columnDefs,
      defaultColDef,
      rowData,
      sideBar,
      onGridReady,
    };
  },
});

createApp(VueExample).mount("#app");
