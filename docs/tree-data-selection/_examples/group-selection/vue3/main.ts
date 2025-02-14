import {
  createApp,
  defineComponent,
  onBeforeMount,
  ref,
  shallowRef,
} from "vue";
import { AgGridVue } from "ag-grid-vue3";
import "./styles.css";
import {
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  GetDataPath,
  GridApi,
  GridOptions,
  GridReadyEvent,
  GroupSelectionMode,
  ModuleRegistry,
  QuickFilterModule,
  RowSelectionModule,
  RowSelectionOptions,
  ValidationModule,
  createGrid,
} from "ag-grid-community";
import {
  ColumnMenuModule,
  ColumnsToolPanelModule,
  ContextMenuModule,
  TreeDataModule,
} from "ag-grid-enterprise";
import { getData } from "./data";
ModuleRegistry.registerModules([
  RowSelectionModule,
  QuickFilterModule,
  ClientSideRowModelModule,
  ColumnsToolPanelModule,
  ColumnMenuModule,
  ContextMenuModule,
  TreeDataModule,
  ValidationModule /* Development Only */,
]);

function getGroupSelectsValue(): GroupSelectionMode {
  return (
    (document.querySelector<HTMLSelectElement>("#input-group-selection-mode")
      ?.value as any) ?? "self"
  );
}

const VueExample = defineComponent({
  template: `
        <div style="height: 100%">
                <div class="example-wrapper">
      <div class="example-header">
        <label>
          <span>Group selects:</span>
          <select id="input-group-selection-mode" v-on:change="onSelectionModeChange()">
            <option value="self">self</option>
            <option value="descendants">descendants</option>
            <option value="filteredDescendants">filteredDescendants</option>
          </select>
        </label>
        <label>
          <span>Quick Filter:</span>
          <input type="text" id="input-quick-filter" v-on:input="onQuickFilterChanged()">
          </label>
        </div>
        <ag-grid-vue
          style="width: 100%; height: 100%;"
          @grid-ready="onGridReady"
          :columnDefs="columnDefs"
          :defaultColDef="defaultColDef"
          :autoGroupColumnDef="autoGroupColumnDef"
          :rowSelection="rowSelection"
          :groupDefaultExpanded="groupDefaultExpanded"
          :suppressAggFuncInHeader="true"
          :rowData="rowData"
          :treeData="true"
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
      cellRenderer: "agGroupCellRenderer",
      cellRendererParams: {
        suppressCount: true,
      },
    });
    const rowSelection = ref<RowSelectionOptions | "single" | "multiple">({
      mode: "multiRow",
      groupSelects: "self",
    });
    const groupDefaultExpanded = ref(-1);
    const rowData = ref<any[] | null>(getData());
    const getDataPath = ref<GetDataPath>((data) => data.path);

    function onSelectionModeChange() {
      gridApi.value.setGridOption("rowSelection", {
        mode: "multiRow",
        groupSelects: getGroupSelectsValue(),
      });
    }
    function onQuickFilterChanged() {
      gridApi.value.setGridOption(
        "quickFilterText",
        document.querySelector<HTMLInputElement>("#input-quick-filter")?.value,
      );
    }
    const onGridReady = (params: GridReadyEvent) => {
      gridApi.value = params.api;
    };

    return {
      gridApi,
      columnDefs,
      defaultColDef,
      autoGroupColumnDef,
      rowSelection,
      groupDefaultExpanded,
      rowData,
      getDataPath,
      onGridReady,
      onSelectionModeChange,
      onQuickFilterChanged,
    };
  },
});

createApp(VueExample).mount("#app");
