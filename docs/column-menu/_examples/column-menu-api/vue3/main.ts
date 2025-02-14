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
  ColumnMenuVisibleChangedEvent,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ModuleRegistry,
  NumberFilterModule,
  TextFilterModule,
  ValidationModule,
  createGrid,
} from "ag-grid-community";
import {
  ColumnMenuModule,
  ColumnsToolPanelModule,
  ContextMenuModule,
} from "ag-grid-enterprise";
import { IOlympicData } from "./interfaces";
ModuleRegistry.registerModules([
  TextFilterModule,
  NumberFilterModule,
  ClientSideRowModelModule,
  ColumnsToolPanelModule,
  ColumnMenuModule,
  ContextMenuModule,
  ValidationModule /* Development Only */,
]);

const VueExample = defineComponent({
  template: `
        <div style="height: 100%">
                <div class="example-wrapper">
      <div>
        <div class="button-group">
          <button v-on:click="showColumnChooser()">Show Column Chooser</button>
          <button v-on:click="showColumnFilter('age')">Show Age Filter</button>
          <button v-on:click="showColumnMenu('age')">Show Age Column Menu</button>
          <button v-on:click="hideColumnChooser()">Hide Column Chooser</button>
        </div>
      </div>
      <ag-grid-vue
        style="width: 100%; height: 100%;"
        @grid-ready="onGridReady"
        :columnDefs="columnDefs"
        :defaultColDef="defaultColDef"
        :rowData="rowData"
        @column-menu-visible-changed="onColumnMenuVisibleChanged"></ag-grid-vue>
      </div>
        </div>
    `,
  components: {
    "ag-grid-vue": AgGridVue,
  },
  setup(props) {
    const gridApi = shallowRef<GridApi<IOlympicData> | null>(null);
    const columnDefs = ref<ColDef[]>([
      { field: "athlete", minWidth: 200 },
      { field: "age" },
      { field: "country", minWidth: 200 },
      { field: "year" },
      { field: "sport", minWidth: 200 },
      { field: "gold" },
      { field: "silver" },
      { field: "bronze" },
      { field: "total" },
    ]);
    const defaultColDef = ref<ColDef>({
      flex: 1,
      minWidth: 100,
      filter: true,
    });
    const rowData = ref<IOlympicData[]>(null);

    function onColumnMenuVisibleChanged(event: ColumnMenuVisibleChangedEvent) {
      console.log("columnMenuVisibleChanged", event);
    }
    function showColumnChooser() {
      gridApi.value.showColumnChooser();
    }
    function showColumnFilter(colKey: string) {
      gridApi.value.showColumnFilter(colKey);
    }
    function showColumnMenu(colKey: string) {
      gridApi.value.showColumnMenu(colKey);
    }
    function hideColumnChooser() {
      gridApi.value.hideColumnChooser();
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
      rowData,
      onGridReady,
      onColumnMenuVisibleChanged,
      showColumnChooser,
      showColumnFilter,
      showColumnMenu,
      hideColumnChooser,
    };
  },
});

createApp(VueExample).mount("#app");
