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
} from "ag-grid-community";
import {
  ColumnMenuModule,
  ColumnsToolPanelModule,
  ContextMenuModule,
  RowGroupingModule,
  SetFilterModule,
} from "ag-grid-enterprise";
import { getData } from "./data";
ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  ColumnsToolPanelModule,
  ColumnMenuModule,
  ContextMenuModule,
  RowGroupingModule,
  SetFilterModule,
  ValidationModule /* Development Only */,
]);

const VueExample = defineComponent({
  template: `
        <div style="height: 100%">
                <div class="example-wrapper">
      <div class="example-header">
        <label>
          <span>groupHideParentOfSingleChild:</span>
          <select id="input-display-type" v-on:change="onOptionChange()">
            <option value="false">false</option>
            <option value="true">true</option>
            <option value="leafGroupsOnly">"leafGroupsOnly"</option>
          </select>
        </label>
      </div>
      <ag-grid-vue
        style="width: 100%; height: 100%;"
        @grid-ready="onGridReady"
        :columnDefs="columnDefs"
        :defaultColDef="defaultColDef"
        :autoGroupColumnDef="autoGroupColumnDef"
        :rowData="rowData"
        :groupDefaultExpanded="groupDefaultExpanded"
        :suppressAggFuncInHeader="true"></ag-grid-vue>
      </div>
        </div>
    `,
  components: {
    "ag-grid-vue": AgGridVue,
  },
  setup(props) {
    const gridApi = shallowRef<GridApi | null>(null);
    const columnDefs = ref<ColDef[]>([
      { field: "athlete" },
      { field: "country", rowGroup: true },
      { field: "city", rowGroup: true },
      { field: "year" },
      { field: "gold", aggFunc: "sum" },
      { field: "silver", aggFunc: "sum" },
      { field: "bronze", aggFunc: "sum" },
    ]);
    const defaultColDef = ref<ColDef>({
      flex: 1,
      minWidth: 150,
    });
    const autoGroupColumnDef = ref<ColDef>({
      headerName: "Group",
      field: "athlete",
      minWidth: 220,
      cellRenderer: "agGroupCellRenderer",
    });
    const rowData = ref<any[] | null>(getData());
    const groupDefaultExpanded = ref(-1);

    function onOptionChange() {
      const key = (
        document.querySelector("#input-display-type") as HTMLSelectElement
      ).value;
      if (key === "true" || key === "false") {
        gridApi.value!.setGridOption(
          "groupHideParentOfSingleChild",
          key === "true",
        );
      } else {
        gridApi.value!.setGridOption(
          "groupHideParentOfSingleChild",
          "leafGroupsOnly",
        );
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
      groupDefaultExpanded,
      onGridReady,
      onOptionChange,
    };
  },
});

createApp(VueExample).mount("#app");
