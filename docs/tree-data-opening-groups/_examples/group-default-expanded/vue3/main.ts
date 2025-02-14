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
  GetDataPath,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ModuleRegistry,
  TextFilterModule,
  ValidationModule,
} from "ag-grid-community";
import { TreeDataModule } from "ag-grid-enterprise";
import { getData } from "./data";
ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  TreeDataModule,
  TextFilterModule,
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
      :autoGroupColumnDef="autoGroupColumnDef"
      :groupDefaultExpanded="groupDefaultExpanded"
      :treeData="true"
      :getDataPath="getDataPath"
      :rowData="rowData"></ag-grid-vue>
        </div>
    `,
  components: {
    "ag-grid-vue": AgGridVue,
  },
  setup(props) {
    const gridApi = shallowRef<GridApi | null>(null);
    const columnDefs = ref<ColDef[]>([
      { field: "created" },
      { field: "modified" },
      {
        field: "size",
        aggFunc: "sum",
        valueFormatter: (params) => {
          const sizeInKb = params.value / 1024;
          if (sizeInKb > 1024) {
            return `${+(sizeInKb / 1024).toFixed(2)} MB`;
          } else {
            return `${+sizeInKb.toFixed(2)} KB`;
          }
        },
      },
    ]);
    const defaultColDef = ref<ColDef>({
      flex: 1,
      minWidth: 100,
    });
    const autoGroupColumnDef = ref<ColDef>({
      headerName: "File Explorer",
      minWidth: 280,
      filter: "agTextColumnFilter",
      cellRendererParams: {
        suppressCount: true,
      },
    });
    const groupDefaultExpanded = ref(1);
    const getDataPath = ref<GetDataPath>((data) => data.path);
    const rowData = ref<any[] | null>(getData());

    const onGridReady = (params: GridReadyEvent) => {
      gridApi.value = params.api;
    };

    return {
      gridApi,
      columnDefs,
      defaultColDef,
      autoGroupColumnDef,
      groupDefaultExpanded,
      getDataPath,
      rowData,
      onGridReady,
    };
  },
});

createApp(VueExample).mount("#app");
