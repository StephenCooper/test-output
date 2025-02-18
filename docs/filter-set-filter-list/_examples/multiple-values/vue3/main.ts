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
  KeyCreatorParams,
  ModuleRegistry,
  SideBarDef,
  ValidationModule,
  ValueFormatterParams,
  ValueGetterParams,
} from "ag-grid-community";
import {
  ColumnMenuModule,
  ColumnsToolPanelModule,
  ContextMenuModule,
  FiltersToolPanelModule,
  SetFilterModule,
} from "ag-grid-enterprise";
import { getData } from "./data";
ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  ColumnsToolPanelModule,
  FiltersToolPanelModule,
  ColumnMenuModule,
  ContextMenuModule,
  SetFilterModule,
  ValidationModule /* Development Only */,
]);

const valueGetter = function (params: ValueGetterParams) {
  return params.data["animalsString"].split("|");
};

const valueFormatter = function (params: ValueFormatterParams) {
  return params.value
    .map(function (animal: any) {
      return animal.name;
    })
    .join(", ");
};

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
        headerName: "Animals (array)",
        field: "animalsArray",
        filter: "agSetColumnFilter",
      },
      {
        headerName: "Animals (string)",
        filter: "agSetColumnFilter",
        valueGetter: valueGetter,
      },
      {
        headerName: "Animals (objects)",
        field: "animalsObjects",
        filter: "agSetColumnFilter",
        valueFormatter: valueFormatter,
        keyCreator: (params: KeyCreatorParams) => params.value.name,
        filterParams: {
          valueFormatter: (params: ValueFormatterParams) =>
            params.value ? params.value.name : "(Blanks)",
        } as ISetFilterParams,
      },
    ]);
    const defaultColDef = ref<ColDef>({
      flex: 1,
      cellDataType: false,
    });
    const rowData = ref<any[] | null>(getData());
    const sideBar = ref<SideBarDef | string | string[] | boolean | null>(
      "filters",
    );

    const onGridReady = (params: GridReadyEvent) => {
      gridApi.value = params.api;
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
