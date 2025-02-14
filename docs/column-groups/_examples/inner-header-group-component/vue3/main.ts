import {
  createApp,
  defineComponent,
  onBeforeMount,
  ref,
  shallowRef,
} from "vue";
import { AgGridVue } from "ag-grid-vue3";
import "./style.css";
import {
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ModuleRegistry,
  ValidationModule,
  createGrid,
} from "ag-grid-community";
import CustomInnerHeaderGroup from "./customInnerHeaderGroupVue";
import { IOlympicData } from "./interfaces";
ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  ValidationModule /* Development Only */,
]);

const VueExample = defineComponent({
  template: `
        <div style="height: 100%">
                <ag-grid-vue
      style="width: 100%; height: 100%;"
      @grid-ready="onGridReady"
      :columnDefs="columnDefs"
      :defaultColDef="defaultColDef"
      :rowData="rowData"></ag-grid-vue>
        </div>
    `,
  components: {
    "ag-grid-vue": AgGridVue,
    CustomInnerHeaderGroup,
  },
  setup(props) {
    const gridApi = shallowRef<GridApi<IOlympicData> | null>(null);
    const columnDefs = ref<(ColDef | ColGroupDef)[]>([
      {
        headerName: "Athlete Details",
        headerGroupComponentParams: {
          innerHeaderGroupComponent: "CustomInnerHeaderGroup",
          icon: "fa-user",
        },
        children: [
          { field: "athlete", width: 150 },
          { field: "age", width: 90, columnGroupShow: "open" },
          {
            field: "country",
            width: 120,
            columnGroupShow: "open",
          },
        ],
      },
      {
        headerName: "Medal details",
        headerGroupComponentParams: {
          innerHeaderGroupComponent: "CustomInnerHeaderGroup",
        },
        children: [
          { field: "year", width: 90 },
          { field: "date", width: 110 },
          {
            field: "sport",
            width: 110,
            columnGroupShow: "open",
          },
          {
            field: "gold",
            width: 100,
            columnGroupShow: "open",
          },
          {
            field: "silver",
            width: 100,
            columnGroupShow: "open",
          },
          {
            field: "bronze",
            width: 100,
            columnGroupShow: "open",
          },
          {
            field: "total",
            width: 100,
            columnGroupShow: "open",
          },
        ],
      },
    ]);
    const defaultColDef = ref<ColDef>({
      width: 100,
    });
    const rowData = ref<IOlympicData[]>(null);

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
    };
  },
});

createApp(VueExample).mount("#app");
