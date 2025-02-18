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
  GetRowIdFunc,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ModuleRegistry,
  RowApiModule,
  TextFilterModule,
  ValidationModule,
} from "ag-grid-community";
import { TreeDataModule } from "ag-grid-enterprise";
import { getData } from "./data";
ModuleRegistry.registerModules([
  RowApiModule,
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
      :rowData="rowData"
      :treeData="true"
      :getDataPath="getDataPath"
      :getRowId="getRowId"></ag-grid-vue>
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
      filter: true,
    });
    const autoGroupColumnDef = ref<ColDef>({
      headerName: "File Explorer",
      minWidth: 280,
      filter: "agTextColumnFilter",
      cellRendererParams: {
        suppressCount: true,
      },
    });
    const rowData = ref<any[] | null>(getData());
    const getDataPath = ref<GetDataPath>((data) => data.path);
    const getRowId = ref<GetRowIdFunc>(
      (params) => params.data.path[params.data.path.length - 1],
    );

    const onGridReady = (params: GridReadyEvent) => {
      gridApi.value = params.api;

      const node = params.api.getRowNode("Proposal.docx");
      if (node) {
        params.api.setRowNodeExpanded(node, true, true);
      }
    };

    return {
      gridApi,
      columnDefs,
      defaultColDef,
      autoGroupColumnDef,
      rowData,
      getDataPath,
      getRowId,
      onGridReady,
    };
  },
});

createApp(VueExample).mount("#app");
