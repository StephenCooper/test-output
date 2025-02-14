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
  ValueGetterParams,
  createGrid,
} from "ag-grid-community";
import { IOlympicData } from "./interfaces";
ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  ValidationModule /* Development Only */,
]);

const athleteColumn = {
  headerName: "Athlete",
  valueGetter: (params: ValueGetterParams<IOlympicData>) => {
    return params.data ? params.data.athlete : undefined;
  },
};

function getColDefsMedalsIncluded(): ColDef<IOlympicData>[] {
  return [
    athleteColumn,
    {
      colId: "myAgeCol",
      headerName: "Age",
      valueGetter: (params: ValueGetterParams<IOlympicData>) => {
        return params.data ? params.data.age : undefined;
      },
    },
    {
      headerName: "Country",
      headerClass: "country-header",
      valueGetter: (params: ValueGetterParams<IOlympicData>) => {
        return params.data ? params.data.country : undefined;
      },
    },
    { field: "sport" },
    { field: "year" },
    { field: "date" },
    { field: "gold" },
    { field: "silver" },
    { field: "bronze" },
    { field: "total" },
  ];
}

function getColDefsMedalsExcluded(): ColDef<IOlympicData>[] {
  return [
    athleteColumn,
    {
      colId: "myAgeCol",
      headerName: "Age",
      valueGetter: (params: ValueGetterParams<IOlympicData>) => {
        return params.data ? params.data.age : undefined;
      },
    },
    {
      headerName: "Country",
      headerClass: "country-header",
      valueGetter: (params: ValueGetterParams<IOlympicData>) => {
        return params.data ? params.data.country : undefined;
      },
    },
    { field: "sport" },
    { field: "year" },
    { field: "date" },
  ];
}

const VueExample = defineComponent({
  template: `
        <div style="height: 100%">
                <div class="test-container">
      <div class="test-header">
        <button v-on:click="onBtIncludeMedalColumns()">Include Medal Columns</button>
        <button v-on:click="onBtExcludeMedalColumns()">Exclude Medal Columns</button>
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
    });
    const columnDefs = ref<ColDef[]>(getColDefsMedalsIncluded());
    const rowData = ref<IOlympicData[]>(null);

    function onBtExcludeMedalColumns() {
      gridApi.value!.setGridOption("columnDefs", getColDefsMedalsExcluded());
    }
    function onBtIncludeMedalColumns() {
      gridApi.value!.setGridOption("columnDefs", getColDefsMedalsIncluded());
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
      onBtExcludeMedalColumns,
      onBtIncludeMedalColumns,
    };
  },
});

createApp(VueExample).mount("#app");
