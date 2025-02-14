import {
  createApp,
  defineComponent,
  onBeforeMount,
  ref,
  shallowRef,
} from "vue";
import { AgGridVue } from "ag-grid-vue3";
import "./style.css";
import {
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  GetDataPath,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ModuleRegistry,
  NumberFilterModule,
  TextFilterModule,
  ValidationModule,
} from "ag-grid-community";
import { TreeDataModule } from "ag-grid-enterprise";
import { getData } from "./data";
ModuleRegistry.registerModules([
  TextFilterModule,
  ClientSideRowModelModule,
  TreeDataModule,
  NumberFilterModule,
  ValidationModule /* Development Only */,
]);

const VueExample = defineComponent({
  template: `
        <div style="height: 100%">
                <div class="example-wrapper">
      <label>
        suppressAggFilteredOnly:
        <input type="checkbox" id="suppressAggFilteredOnly" checked="" v-on:click="toggleCheckbox()">
        </label>
        <ag-grid-vue
          style="width: 100%; height: 100%;"
          @grid-ready="onGridReady"
          :columnDefs="columnDefs"
          :defaultColDef="defaultColDef"
          :autoGroupColumnDef="autoGroupColumnDef"
          :rowData="rowData"
          :treeData="true"
          :groupDefaultExpanded="groupDefaultExpanded"
          :suppressAggFilteredOnly="true"
          :getDataPath="getDataPath"></ag-grid-vue>
        </div>
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
        filter: "agNumberColumnFilter",
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
    });
    const autoGroupColumnDef = ref<ColDef>({
      headerName: "File Explorer",
      minWidth: 150,
      cellRendererParams: {
        suppressCount: true,
      },
    });
    const rowData = ref<any[] | null>(getData());
    const groupDefaultExpanded = ref(1);
    const getDataPath = ref<GetDataPath>((data) => data.path);

    function toggleCheckbox() {
      const checkbox = document.querySelector<HTMLInputElement>(
        "#suppressAggFilteredOnly",
      )!;
      gridApi.value.setGridOption("suppressAggFilteredOnly", checkbox.checked);
    }
    const onGridReady = (params: GridReadyEvent) => {
      gridApi.value = params.api;

      params.api.setFilterModel({
        size: {
          filterType: "number",
          type: "equal",
          filter: 5193728,
        },
      });
    };

    return {
      gridApi,
      columnDefs,
      defaultColDef,
      autoGroupColumnDef,
      rowData,
      groupDefaultExpanded,
      getDataPath,
      onGridReady,
      toggleCheckbox,
    };
  },
});

createApp(VueExample).mount("#app");
