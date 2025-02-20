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
  ValidationModule,
} from "ag-grid-community";
import { TreeDataModule } from "ag-grid-enterprise";
import { getData } from "./data";
ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  TreeDataModule,
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
      :rowData="rowData"
      :treeData="true"
      :treeDataChildrenField="treeDataChildrenField"
      :groupDefaultExpanded="groupDefaultExpanded"></ag-grid-vue>
        </div>
    `,
  components: {
    "ag-grid-vue": AgGridVue,
  },
  setup(props) {
    const gridApi = shallowRef<GridApi | null>(null);
    const columnDefs = ref<ColDef[]>([
      {
        headerName: "Aggregated (Sum)",
        aggFunc: "sum",
        field: "items",
      },
      {
        headerName: "Provided",
        field: "items",
      },
    ]);
    const defaultColDef = ref<ColDef>({
      flex: 1,
    });
    const autoGroupColumnDef = ref<ColDef>({
      headerName: "Name",
      field: "name",
      cellRendererParams: {
        suppressCount: true,
      },
    });
    const rowData = ref<any[] | null>(getData());
    const treeDataChildrenField = ref("children");
    const groupDefaultExpanded = ref(-1);

    const onGridReady = (params: GridReadyEvent) => {
      gridApi.value = params.api;
    };

    return {
      gridApi,
      columnDefs,
      defaultColDef,
      autoGroupColumnDef,
      rowData,
      treeDataChildrenField,
      groupDefaultExpanded,
      onGridReady,
    };
  },
});

createApp(VueExample).mount("#app");
