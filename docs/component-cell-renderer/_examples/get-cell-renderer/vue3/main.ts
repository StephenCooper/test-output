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
  NumberEditorModule,
  NumberFilterModule,
  RenderApiModule,
  RowApiModule,
  TextEditorModule,
  TextFilterModule,
  ValidationModule,
  ValueGetterParams,
  createGrid,
} from "ag-grid-community";
import MedalCellRenderer from "./medalCellRendererVue";
import { IOlympicData } from "./interfaces";
ModuleRegistry.registerModules([
  RenderApiModule,
  NumberEditorModule,
  TextEditorModule,
  TextFilterModule,
  NumberFilterModule,
  RowApiModule,
  ClientSideRowModelModule,
  ValidationModule /* Development Only */,
]);

const VueExample = defineComponent({
  template: `
        <div style="height: 100%">
                <div class="example-wrapper">
      <div style="margin-bottom: 5px">
        <button v-on:click="onCallGold()">Gold</button>
        <button v-on:click="onFirstRowGold()">First Row Gold</button>
        <button v-on:click="onCallAllCells()">All Cells</button>
      </div>
      <ag-grid-vue
        style="width: 100%; height: 100%;"
        @grid-ready="onGridReady"
        :columnDefs="columnDefs"
        :defaultColDef="defaultColDef"
        :rowData="rowData"></ag-grid-vue>
      </div>
        </div>
    `,
  components: {
    "ag-grid-vue": AgGridVue,
    MedalCellRenderer,
  },
  setup(props) {
    const gridApi = shallowRef<GridApi<IOlympicData> | null>(null);
    const columnDefs = ref<ColDef[]>([
      { field: "athlete", width: 150 },
      { field: "country", width: 150 },
      { field: "year", width: 100 },
      { field: "gold", width: 100, cellRenderer: "MedalCellRenderer" },
      { field: "silver", width: 100, cellRenderer: "MedalCellRenderer" },
      { field: "bronze", width: 100, cellRenderer: "MedalCellRenderer" },
      {
        field: "total",
        editable: false,
        valueGetter: (params: ValueGetterParams) =>
          params.data.gold + params.data.silver + params.data.bronze,
        width: 100,
      },
    ]);
    const defaultColDef = ref<ColDef>({
      editable: true,
      flex: 1,
      minWidth: 100,
      filter: true,
    });
    const rowData = ref<IOlympicData[]>(null);

    function onCallGold() {
      console.log("=========> calling all gold");
      // pass in list of columns, here it's gold only
      const params = { columns: ["gold"] };
      const instances = gridApi.value!.getCellRendererInstances(
        params,
      ) as any[];
      instances.forEach((instance) => {
        instance.medalUserFunction();
      });
    }
    function onFirstRowGold() {
      console.log("=========> calling gold row one");
      // pass in one column and one row to identify one cell
      const firstRowNode = gridApi.value!.getDisplayedRowAtIndex(0)!;
      const params = { columns: ["gold"], rowNodes: [firstRowNode] };
      const instances = gridApi.value!.getCellRendererInstances(
        params,
      ) as any[];
      instances.forEach((instance) => {
        instance.medalUserFunction();
      });
    }
    function onCallAllCells() {
      console.log("=========> calling everything");
      // no params, goes through all rows and columns where cell renderer exists
      const instances = gridApi.value!.getCellRendererInstances() as any[];
      instances.forEach((instance) => {
        instance.medalUserFunction();
      });
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
      onCallGold,
      onFirstRowGold,
      onCallAllCells,
    };
  },
});

createApp(VueExample).mount("#app");
