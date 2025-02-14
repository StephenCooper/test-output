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

function getCheckboxValue(id: string): boolean {
  return document.querySelector<HTMLInputElement>(id)?.checked ?? false;
}

const VueExample = defineComponent({
  template: `
        <div style="height: 100%">
                <div class="example-wrapper">
      <div class="example-header">
        <label>
          <span>Hide disabled checkboxes:</span>
          <input id="toggle-hide-checkbox" type="checkbox" checked="" v-on:change="toggleHideCheckbox()">
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
      { field: "athlete" },
      { field: "sport" },
      { field: "year", maxWidth: 120 },
    ]);
    const defaultColDef = ref<ColDef>({
      flex: 1,
      minWidth: 100,
    });
    const rowSelection = ref<RowSelectionOptions | "single" | "multiple">({
      mode: "singleRow",
      hideDisabledCheckboxes: true,
      isRowSelectable: (rowNode) =>
        rowNode.data ? rowNode.data.year < 2007 : false,
    });
    const rowData = ref<IOlympicData[]>(null);

    function toggleHideCheckbox() {
      gridApi.value.setGridOption("rowSelection", {
        mode: "singleRow",
        isRowSelectable: (rowNode) =>
          rowNode.data ? rowNode.data.year < 2007 : false,
        hideDisabledCheckboxes: getCheckboxValue("#toggle-hide-checkbox"),
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
      toggleHideCheckbox,
    };
  },
});

createApp(VueExample).mount("#app");
