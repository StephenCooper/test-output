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
  createGrid,
} from "ag-grid-community";
import { RowGroupingModule } from "ag-grid-enterprise";
import { IOlympicData } from "./interfaces";
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
          <span>groupTotalRow:</span>
          <select id="input-property-value" v-on:change="onChange()">
            <option value="bottom">"bottom"</option>
            <option value="top">"top"</option>
            <option value="undefined">undefined</option>
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
    const groupDefaultExpanded = ref(1);
    const groupTotalRow = ref<"top" | "bottom" | UseGroupTotalRow>("bottom");
    const rowData = ref<IOlympicData[]>(null);

    function onChange() {
      const groupTotalRow = document.querySelector<HTMLInputElement>(
        "#input-property-value",
      )!.value;
      if (groupTotalRow === "bottom" || groupTotalRow === "top") {
        gridApi.value.setGridOption("groupTotalRow", groupTotalRow);
      } else {
        gridApi.value.setGridOption("groupTotalRow", undefined);
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
      rowData,
      onGridReady,
      onChange,
    };
  },
});

createApp(VueExample).mount("#app");
