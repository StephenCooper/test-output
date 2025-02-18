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
  SideBarDef,
  ValidationModule,
} from "ag-grid-community";
import {
  ColumnMenuModule,
  ColumnsToolPanelModule,
  ContextMenuModule,
  PivotModule,
  RowGroupingPanelModule,
} from "ag-grid-enterprise";
import { IOlympicData } from "./interfaces";
ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  ColumnsToolPanelModule,
  ColumnMenuModule,
  ContextMenuModule,
  PivotModule,
  RowGroupingPanelModule,
  ValidationModule /* Development Only */,
]);

const VueExample = defineComponent({
  template: `
        <div style="height: 100%">
                <div class="test-container">
      <div class="test-header">
        <label><input type="checkbox" id="read-only" v-on:change="setReadOnly()"> Functions Read Only</label>
      </div>
      <ag-grid-vue
        style="width: 100%; height: 100%;"
        @grid-ready="onGridReady"
        :columnDefs="columnDefs"
        :defaultColDef="defaultColDef"
        :autoGroupColumnDef="autoGroupColumnDef"
        :pivotMode="true"
        :sideBar="sideBar"
        :rowGroupPanelShow="rowGroupPanelShow"
        :pivotPanelShow="pivotPanelShow"
        :functionsReadOnly="true"
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
      {
        field: "athlete",
        minWidth: 200,
        enableRowGroup: true,
        enablePivot: true,
      },
      {
        field: "age",
        enableValue: true,
      },
      {
        field: "country",
        minWidth: 200,
        enableRowGroup: true,
        enablePivot: true,
        rowGroupIndex: 1,
      },
      {
        field: "year",
        enableRowGroup: true,
        enablePivot: true,
        pivotIndex: 1,
      },
      {
        field: "date",
        minWidth: 180,
        enableRowGroup: true,
        enablePivot: true,
      },
      {
        field: "sport",
        minWidth: 200,
        enableRowGroup: true,
        enablePivot: true,
        rowGroupIndex: 2,
      },
      {
        field: "gold",
        hide: true,
        enableValue: true,
      },
      {
        field: "silver",
        hide: true,
        enableValue: true,
        aggFunc: "sum",
      },
      {
        field: "bronze",
        hide: true,
        enableValue: true,
        aggFunc: "sum",
      },
      {
        headerName: "Total",
        field: "total",
      },
    ]);
    const defaultColDef = ref<ColDef>({
      flex: 1,
      minWidth: 150,
    });
    const autoGroupColumnDef = ref<ColDef>({
      minWidth: 250,
    });
    const sideBar = ref<SideBarDef | string | string[] | boolean | null>(
      "columns",
    );
    const rowGroupPanelShow = ref<"always" | "onlyWhenGrouping" | "never">(
      "always",
    );
    const pivotPanelShow = ref<"always" | "onlyWhenPivoting" | "never">(
      "always",
    );
    const rowData = ref<IOlympicData[]>(null);

    function setReadOnly() {
      gridApi.value!.setGridOption(
        "functionsReadOnly",
        (document.getElementById("read-only") as HTMLInputElement).checked,
      );
    }
    const onGridReady = (params: GridReadyEvent) => {
      gridApi.value = params.api;

      (document.getElementById("read-only") as HTMLInputElement).checked = true;

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
      sideBar,
      rowGroupPanelShow,
      pivotPanelShow,
      rowData,
      onGridReady,
      setReadOnly,
    };
  },
});

createApp(VueExample).mount("#app");
