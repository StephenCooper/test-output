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
  NumberFilterModule,
  TextFilterModule,
  ValidationModule,
} from "ag-grid-community";
import { IOlympicData } from "./interfaces";
ModuleRegistry.registerModules([
  TextFilterModule,
  NumberFilterModule,
  ClientSideRowModelModule,
  ValidationModule /* Development Only */,
]);

const COL_DEFS: ColDef<IOlympicData>[] = [
  { field: "athlete" },
  { field: "age" },
  { field: "country" },
  { field: "sport" },
  { field: "year" },
  { field: "date" },
  { field: "gold" },
  { field: "silver" },
  { field: "bronze" },
  { field: "total" },
];

const VueExample = defineComponent({
  template: `
        <div style="height: 100%">
                <div class="test-container">
      <div class="test-header">
        <button v-on:click="setHeaderNames()">Set Header Names</button>
        <button v-on:click="removeHeaderNames()">Remove Header Names</button>
        <button v-on:click="setValueFormatters()">Set Value Formatters</button>
        <button v-on:click="removeValueFormatters()">Remove Value Formatters</button>
      </div>
      <ag-grid-vue
        style="width: 100%; height: 100%;"
        class="test-grid"
        @grid-ready="onGridReady"
        :defaultColDef="defaultColDef"
        :columnDefs="columnDefs"
        :rowData="rowData"></ag-grid-vue>
      </div>
        </div>
    `,
  components: {
    "ag-grid-vue": AgGridVue,
  },
  setup(props) {
    const gridApi = shallowRef<GridApi<IOlympicData> | null>(null);
    const defaultColDef = ref<ColDef>({
      initialWidth: 100,
      filter: true,
    });
    const columnDefs = ref<ColDef[]>(COL_DEFS);
    const rowData = ref<IOlympicData[]>(null);

    function setHeaderNames() {
      COL_DEFS.forEach((colDef, index) => {
        colDef.headerName = "C" + index;
      });
      gridApi.value!.setGridOption("columnDefs", COL_DEFS);
    }
    function removeHeaderNames() {
      COL_DEFS.forEach((colDef) => {
        colDef.headerName = undefined;
      });
      gridApi.value!.setGridOption("columnDefs", COL_DEFS);
    }
    function setValueFormatters() {
      COL_DEFS.forEach((colDef) => {
        colDef.valueFormatter = function (params) {
          return "[ " + params.value + " ]";
        };
      });
      gridApi.value!.setGridOption("columnDefs", COL_DEFS);
    }
    function removeValueFormatters() {
      COL_DEFS.forEach((colDef) => {
        colDef.valueFormatter = undefined;
      });
      gridApi.value!.setGridOption("columnDefs", COL_DEFS);
    }
    const onGridReady = (params: GridReadyEvent) => {
      gridApi.value = params.api;

      const updateData = (data) => {
        rowData.value = data;
      };

      fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
        .then((resp) => resp.json())
        .then((data) => updateData(data));
    };

    return {
      gridApi,
      defaultColDef,
      columnDefs,
      rowData,
      onGridReady,
      setHeaderNames,
      removeHeaderNames,
      setValueFormatters,
      removeValueFormatters,
    };
  },
});

createApp(VueExample).mount("#app");
