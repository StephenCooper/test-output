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
  RowGroupOpenedEvent,
  ScrollApiModule,
  TextFilterModule,
  ValidationModule,
} from "ag-grid-community";
import { TreeDataModule } from "ag-grid-enterprise";
import { getData } from "./data";
ModuleRegistry.registerModules([
  ScrollApiModule,
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
      :animateRows="false"
      @row-group-opened="onRowGroupOpened"></ag-grid-vue>
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

    function onRowGroupOpened(event: RowGroupOpenedEvent<IOlympicData>) {
      if (event.expanded) {
        const rowNodeIndex = event.node.rowIndex!;
        // factor in child nodes so we can scroll to correct position
        const childCount = event.node.childrenAfterSort
          ? event.node.childrenAfterSort.length
          : 0;
        const newIndex = rowNodeIndex + childCount;
        gridApi.value!.ensureIndexVisible(newIndex);
      }
    }
    const onGridReady = (params: GridReadyEvent) => {
      gridApi.value = params.api;
    };

    return {
      gridApi,
      columnDefs,
      defaultColDef,
      autoGroupColumnDef,
      rowData,
      getDataPath,
      onGridReady,
      onRowGroupOpened,
    };
  },
});

createApp(VueExample).mount("#app");
