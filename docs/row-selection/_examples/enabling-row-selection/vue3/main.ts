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
  GridApi,
  GridOptions,
  GridReadyEvent,
  ModuleRegistry,
  RowSelectionMode,
  RowSelectionModule,
  RowSelectionOptions,
  ValidationModule,
  createGrid,
} from "ag-grid-community";
import {
  ColumnMenuModule,
  ColumnsToolPanelModule,
  ContextMenuModule,
  RowGroupingModule,
} from "ag-grid-enterprise";
import { IOlympicData } from "./interfaces";
ModuleRegistry.registerModules([
  RowSelectionModule,
  ClientSideRowModelModule,
  ColumnsToolPanelModule,
  ColumnMenuModule,
  ContextMenuModule,
  RowGroupingModule,
  ValidationModule /* Development Only */,
]);

function getSelectValue(id: string): RowSelectionMode {
  return (
    (document.querySelector<HTMLSelectElement>(id)
      ?.value as RowSelectionMode) ?? "singleRow"
  );
}

const VueExample = defineComponent({
  template: `
        <div style="height: 100%">
                <div class="example-wrapper">
      <div class="example-header">
        <label>
          <span>Selection mode: </span>
          <select id="input-selection-mode" v-on:change="updateSelectionOptions()">
            <option value="singleRow">singleRow</option>
            <option value="multiRow">multiRow</option>
          </select>
        </label>
      </div>
      <ag-grid-vue
        style="width: 100%; height: 100%;"
        @grid-ready="onGridReady"
        :columnDefs="columnDefs"
        :defaultColDef="defaultColDef"
        :rowSelection="rowSelection"
        :rowData="rowData"></ag-grid-vue>
      </div>
        </div>
    `,
  components: {
    "ag-grid-vue": AgGridVue,
  },
  setup(props) {
    const gridApi = shallowRef<GridApi<IOlympicData> | null>(null);
    const columnDefs = ref<ColDef[]>([
      { field: "athlete", minWidth: 150 },
      { field: "age", maxWidth: 90 },
      { field: "country", minWidth: 150 },
      { field: "year", maxWidth: 90 },
      { field: "date", minWidth: 150 },
      { field: "sport", minWidth: 150 },
      { field: "gold" },
      { field: "silver" },
      { field: "bronze" },
      { field: "total" },
    ]);
    const defaultColDef = ref<ColDef>({
      flex: 1,
      minWidth: 100,
    });
    const rowSelection = ref<RowSelectionOptions | "single" | "multiple">({
      mode: "singleRow",
    });
    const rowData = ref<IOlympicData[]>(null);

    function updateSelectionOptions() {
      gridApi.value.setGridOption("rowSelection", {
        mode: getSelectValue("#input-selection-mode"),
      });
    }
    const onGridReady = (params: GridReadyEvent) => {
      gridApi.value = params.api;

      const updateData = (data) => (rowData.value = data);

      fetch("https://www.ag-grid.com/example-assets/small-olympic-winners.json")
        .then((resp) => resp.json())
        .then((data) => updateData(data));
    };

    return {
      gridApi,
      columnDefs,
      defaultColDef,
      rowSelection,
      rowData,
      onGridReady,
      updateSelectionOptions,
    };
  },
});

createApp(VueExample).mount("#app");
