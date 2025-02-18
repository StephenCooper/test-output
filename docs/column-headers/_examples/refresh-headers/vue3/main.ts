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
import CustomHeader from "./customHeaderVue";
import { IOlympicData } from "./interfaces";
ModuleRegistry.registerModules([
  TextFilterModule,
  NumberFilterModule,
  ClientSideRowModelModule,
  ValidationModule /* Development Only */,
]);

const VueExample = defineComponent({
  template: `
        <div style="height: 100%">
                <div class="test-container">
      <div class="test-header">
        <button v-on:click="onBtUpperNames()">Upper Header Names</button>
        <button v-on:click="onBtLowerNames()">Lower Header Names</button>
        &nbsp;&nbsp;&nbsp;
        <button v-on:click="onBtFilterOn()">Filter On</button>
        <button v-on:click="onBtFilterOff()">Filter Off</button>
        &nbsp;&nbsp;&nbsp;
        <button v-on:click="onBtResizeOn()">Resize On</button>
        <button v-on:click="onBtResizeOff()">Resize Off</button>
      </div>
      <ag-grid-vue
        style="width: 100%; height: 100%;"
        class="test-grid"
        @grid-ready="onGridReady"
        :columnDefs="columnDefs"
        :defaultColDef="defaultColDef"
        :rowData="rowData"></ag-grid-vue>
      </div>
        </div>
    `,
  components: {
    "ag-grid-vue": AgGridVue,
    CustomHeader,
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
      headerComponent: "CustomHeader",
    });
    const rowData = ref<IOlympicData[]>(null);

    function onBtUpperNames() {
      const columnDefs: ColDef[] = [
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
      ];
      columnDefs.forEach((c) => {
        c.headerName = c.field!.toUpperCase();
      });
      gridApi.value!.setGridOption("columnDefs", columnDefs);
    }
    function onBtLowerNames() {
      const columnDefs: ColDef[] = [
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
      ];
      columnDefs.forEach((c) => {
        c.headerName = c.field;
      });
      gridApi.value!.setGridOption("columnDefs", columnDefs);
    }
    function onBtFilterOn() {
      const columnDefs: ColDef[] = [
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
      ];
      columnDefs.forEach((c) => {
        c.filter = true;
      });
      gridApi.value!.setGridOption("columnDefs", columnDefs);
    }
    function onBtFilterOff() {
      const columnDefs: ColDef[] = [
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
      ];
      columnDefs.forEach((c) => {
        c.filter = false;
      });
      gridApi.value!.setGridOption("columnDefs", columnDefs);
    }
    function onBtResizeOn() {
      const columnDefs: ColDef[] = [
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
      ];
      columnDefs.forEach((c) => {
        c.resizable = true;
      });
      gridApi.value!.setGridOption("columnDefs", columnDefs);
    }
    function onBtResizeOff() {
      const columnDefs: ColDef[] = [
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
      ];
      columnDefs.forEach((c) => {
        c.resizable = false;
      });
      gridApi.value!.setGridOption("columnDefs", columnDefs);
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
      columnDefs,
      defaultColDef,
      rowData,
      onGridReady,
      onBtUpperNames,
      onBtLowerNames,
      onBtFilterOn,
      onBtFilterOff,
      onBtResizeOn,
      onBtResizeOff,
    };
  },
});

createApp(VueExample).mount("#app");
