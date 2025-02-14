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
  UseGroupTotalRow,
  ValidationModule,
} from "ag-grid-community";
import { RowGroupingModule } from "ag-grid-enterprise";
ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  RowGroupingModule,
  ValidationModule /* Development Only */,
]);

const VueExample = defineComponent({
  template: `
        <div style="height: 100%">
                <div class="example-wrapper">
      <div class="example-header">
        <label>
          <span>suppressStickyTotalRow:</span>
          <select id="input-property-value" v-on:change="onChange()">
            <option value="false">false</option>
            <option value="true">true</option>
            <option value="grand">"grand"</option>
            <option value="group">"group"</option>
          </select>
        </label>
      </div>
      <ag-grid-vue
        style="width: 100%; height: 100%;"
        @grid-ready="onGridReady"
        :columnDefs="columnDefs"
        :defaultColDef="defaultColDef"
        :autoGroupColumnDef="autoGroupColumnDef"
        :groupDefaultExpanded="groupDefaultExpanded"
        :groupTotalRow="groupTotalRow"
        :grandTotalRow="grandTotalRow"
        :rowData="rowData"></ag-grid-vue>
      </div>
        </div>
    `,
  components: {
    "ag-grid-vue": AgGridVue,
  },
  setup(props) {
    const gridApi = shallowRef<GridApi | null>(null);
    const columnDefs = ref<ColDef[]>([
      { field: "country", rowGroup: true, hide: true },
      { field: "year", rowGroup: true, hide: true },
      { field: "gold", aggFunc: "sum" },
      { field: "silver", aggFunc: "sum" },
      { field: "bronze", aggFunc: "sum" },
    ]);
    const defaultColDef = ref<ColDef>({
      flex: 1,
      minWidth: 150,
    });
    const autoGroupColumnDef = ref<ColDef>({
      minWidth: 300,
    });
    const groupDefaultExpanded = ref(-1);
    const groupTotalRow = ref<"top" | "bottom" | UseGroupTotalRow>("bottom");
    const grandTotalRow = ref<"top" | "bottom">("bottom");
    const rowData = ref<any[]>(null);

    function onChange() {
      const suppressStickyTotalRow = document.querySelector<HTMLInputElement>(
        "#input-property-value",
      )!.value;
      if (
        suppressStickyTotalRow === "grand" ||
        suppressStickyTotalRow === "group"
      ) {
        gridApi.value.setGridOption(
          "suppressStickyTotalRow",
          suppressStickyTotalRow,
        );
      } else if (suppressStickyTotalRow === "true") {
        gridApi.value.setGridOption("suppressStickyTotalRow", true);
      } else {
        gridApi.value.setGridOption("suppressStickyTotalRow", false);
      }
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
      groupDefaultExpanded,
      groupTotalRow,
      grandTotalRow,
      rowData,
      onGridReady,
      onChange,
    };
  },
});

createApp(VueExample).mount("#app");
