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
  ValidationModule,
  createGrid,
} from "ag-grid-community";
import { RowGroupingModule, RowGroupingPanelModule } from "ag-grid-enterprise";
import { IOlympicData } from "./interfaces";
ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  RowGroupingModule,
  RowGroupingPanelModule,
  ValidationModule /* Development Only */,
]);

const VueExample = defineComponent({
  template: `
        <div style="height: 100%">
                <div class="example-wrapper">
      <div class="example-header">
        <label>
          <span>suppressGroupChangesColumnVisibility:</span>
          <select id="visibility-behaviour" v-on:change="onPropertyChange()">
            <option value="false">false</option>
            <option value="true">true</option>
            <option value="suppressHideOnGroup">"suppressHideOnGroup"</option>
            <option value="suppressShowOnUngroup">"suppressShowOnUngroup"</option>
          </select>
        </label>
        <button v-on:click="resetCols()">Reset Column Visibility</button>
      </div>
      <ag-grid-vue
        style="width: 100%; height: 100%;"
        @grid-ready="onGridReady"
        :columnDefs="columnDefs"
        :defaultColDef="defaultColDef"
        :autoGroupColumnDef="autoGroupColumnDef"
        :suppressDragLeaveHidesColumns="true"
        :rowGroupPanelShow="rowGroupPanelShow"
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
      { field: "country", enableRowGroup: true },
      { field: "year", enableRowGroup: true },
      { field: "athlete", minWidth: 180 },
      { field: "total" },
    ]);
    const defaultColDef = ref<ColDef>({
      flex: 1,
      minWidth: 150,
    });
    const autoGroupColumnDef = ref<ColDef>({
      minWidth: 200,
    });
    const rowGroupPanelShow = ref<"always" | "onlyWhenGrouping" | "never">(
      "always",
    );
    const rowData = ref<IOlympicData[]>(null);

    function onPropertyChange() {
      const prop = (
        document.querySelector("#visibility-behaviour") as HTMLSelectElement
      ).value;
      if (prop === "true" || prop === "false") {
        gridApi.value!.setGridOption(
          "suppressGroupChangesColumnVisibility",
          prop === "true",
        );
      } else {
        gridApi.value!.setGridOption(
          "suppressGroupChangesColumnVisibility",
          prop as "suppressHideOnGroup" | "suppressShowOnUngroup",
        );
      }
    }
    function resetCols() {
      gridApi.value!.setGridOption("columnDefs", [
        { field: "country", enableRowGroup: true, hide: false },
        { field: "year", enableRowGroup: true, hide: false },
        { field: "athlete", minWidth: 180, hide: false },
        { field: "total", hide: false },
      ]);
    }
    const onGridReady = (params: GridReadyEvent) => {
      gridApi.value = params.api;

      const updateData = (data) => (rowData.value = data);

      fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
        .then((resp) => resp.json())
        .then((data) => updateData(data));
    };

    return {
      gridApi,
      columnDefs,
      defaultColDef,
      autoGroupColumnDef,
      rowGroupPanelShow,
      rowData,
      onGridReady,
      onPropertyChange,
      resetCols,
    };
  },
});

createApp(VueExample).mount("#app");
