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
import { IOlympicData } from "./interfaces";
ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  ValidationModule /* Development Only */,
]);

function createNormalColDefs(): (ColDef | ColGroupDef)[] {
  return [
    {
      headerName: "Athlete Details",
      headerClass: "participant-group",
      children: [
        { field: "athlete", colId: "athlete" },
        { field: "country", colId: "country" },
      ],
    },
    { field: "age", colId: "age" },
    {
      headerName: "Sports Results",
      headerClass: "medals-group",
      children: [
        { field: "sport", colId: "sport" },
        { field: "gold", colId: "gold" },
      ],
    },
  ];
}

function createExtraColDefs(): (ColDef | ColGroupDef)[] {
  return [
    {
      headerName: "Athlete Details",
      headerClass: "participant-group",
      children: [
        { field: "athlete", colId: "athlete" },
        { field: "country", colId: "country" },
        { field: "region1", colId: "region1" },
        { field: "region2", colId: "region2" },
      ],
    },
    { field: "age", colId: "age" },
    { field: "distance", colId: "distance" },
    {
      headerName: "Sports Results",
      headerClass: "medals-group",
      children: [
        { field: "sport", colId: "sport" },
        { field: "gold", colId: "gold" },
      ],
    },
  ];
}

const VueExample = defineComponent({
  template: `
        <div style="height: 100%">
                <div class="test-container">
      <div class="test-header">
        <button v-on:click="onBtNormalCols()">Normal Cols</button>
        <button v-on:click="onBtExtraCols()">Extra Cols</button>
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
      width: 150,
    });
    const columnDefs = ref<ColDef[]>(createNormalColDefs());
    const rowData = ref<IOlympicData[]>(null);

    function onBtNormalCols() {
      gridApi.value!.setGridOption("columnDefs", createNormalColDefs());
    }
    function onBtExtraCols() {
      gridApi.value!.setGridOption("columnDefs", createExtraColDefs());
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
      onBtNormalCols,
      onBtExtraCols,
    };
  },
});

createApp(VueExample).mount("#app");
