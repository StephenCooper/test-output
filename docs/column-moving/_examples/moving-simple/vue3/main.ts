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
  Column,
  ColumnApiModule,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ModuleRegistry,
  ValidationModule,
} from "ag-grid-community";
import { IOlympicData } from "./interfaces";
ModuleRegistry.registerModules([
  ColumnApiModule,
  ClientSideRowModelModule,
  ValidationModule /* Development Only */,
]);

const VueExample = defineComponent({
  template: `
        <div style="height: 100%">
                <div class="example-wrapper">
      <div style="margin-bottom: 1rem">
        <button v-on:click="onMedalsFirst()">Medals First</button>
        <button v-on:click="onMedalsLast()">Medals Last</button>
        <button v-on:click="onCountryFirst()">Country First</button>
        <button v-on:click="onSwapFirstTwo()">Swap First Two</button>
        <button v-on:click="onPrintColumns()">Print Columns</button>
      </div>
      <ag-grid-vue
        style="width: 100%; height: 100%;"
        @grid-ready="onGridReady"
        :columnDefs="columnDefs"
        :defaultColDef="defaultColDef"
        :suppressDragLeaveHidesColumns="true"
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
      { field: "age" },
      { field: "country" },
      { field: "year" },
      { field: "date" },
      { field: "sport" },
      { field: "gold" },
      { field: "silver" },
      { field: "bronze" },
      { field: "total" },
    ]);
    const defaultColDef = ref<ColDef>({
      width: 150,
    });
    const rowData = ref<IOlympicData[]>(null);

    function onMedalsFirst() {
      gridApi.value!.moveColumns(["gold", "silver", "bronze", "total"], 0);
    }
    function onMedalsLast() {
      gridApi.value!.moveColumns(["gold", "silver", "bronze", "total"], 6);
    }
    function onCountryFirst() {
      gridApi.value!.moveColumns(["country"], 0);
    }
    function onSwapFirstTwo() {
      gridApi.value!.moveColumnByIndex(0, 1);
    }
    function onPrintColumns() {
      const cols = gridApi.value!.getAllGridColumns();
      const colToNameFunc = (col: Column, index: number) =>
        index + " = " + col.getId();
      const colNames = cols.map(colToNameFunc).join(", ");
      console.log("columns are: " + colNames);
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
      onMedalsFirst,
      onMedalsLast,
      onCountryFirst,
      onSwapFirstTwo,
      onPrintColumns,
    };
  },
});

createApp(VueExample).mount("#app");
