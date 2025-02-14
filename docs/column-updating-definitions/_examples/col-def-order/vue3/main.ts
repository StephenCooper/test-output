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

function getColumnDefsA(): ColDef[] {
  return [
    { field: "athlete", headerName: "A Athlete" },
    { field: "age", headerName: "A Age" },
    { field: "country", headerName: "A Country" },
    { field: "sport", headerName: "A Sport" },
    { field: "year", headerName: "A Year" },
    { field: "date", headerName: "A Date" },
    { field: "gold", headerName: "A Gold" },
    { field: "silver", headerName: "A Silver" },
    { field: "bronze", headerName: "A Bronze" },
    { field: "total", headerName: "A Total" },
  ];
}

function getColumnDefsB(): ColDef[] {
  return [
    { field: "gold", headerName: "B Gold" },
    { field: "silver", headerName: "B Silver" },
    { field: "bronze", headerName: "B Bronze" },
    { field: "total", headerName: "B Total" },
    { field: "athlete", headerName: "B Athlete" },
    { field: "age", headerName: "B Age" },
    { field: "country", headerName: "B Country" },
    { field: "sport", headerName: "B Sport" },
    { field: "year", headerName: "B Year" },
    { field: "date", headerName: "B Date" },
  ];
}

const VueExample = defineComponent({
  template: `
        <div style="height: 100%">
                <div class="test-container">
      <div class="test-header">
        <button v-on:click="setColsA()">Column Set A</button>
        <button v-on:click="setColsB()">Column Set B</button>
        <button v-on:click="clearColDefs()">Clear</button>
      </div>
      <ag-grid-vue
        style="width: 100%; height: 100%;"
        class="test-grid"
        @grid-ready="onGridReady"
        :defaultColDef="defaultColDef"
        :maintainColumnOrder="true"
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
    const columnDefs = ref<ColDef[]>(getColumnDefsA());
    const rowData = ref<IOlympicData[]>(null);

    function setColsA() {
      gridApi.value!.setGridOption("columnDefs", getColumnDefsA());
    }
    function setColsB() {
      gridApi.value!.setGridOption("columnDefs", getColumnDefsB());
    }
    function clearColDefs() {
      gridApi.value!.setGridOption("columnDefs", []);
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
      defaultColDef,
      columnDefs,
      rowData,
      onGridReady,
      setColsA,
      setColsB,
      clearColDefs,
    };
  },
});

createApp(VueExample).mount("#app");
