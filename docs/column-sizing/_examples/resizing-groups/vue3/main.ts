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
  createGrid,
} from "ag-grid-community";
import { IOlympicData } from "./interfaces";
ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  ValidationModule /* Development Only */,
]);

const VueExample = defineComponent({
  template: `
        <div style="height: 100%">
                <div class="example-wrapper">
      <div class="legend-bar">
        <span class="legend-box resizable-header"></span> Resizable Column &nbsp;&nbsp;&nbsp;&nbsp;
        <span class="legend-box fixed-size-header"></span> Fixed Width Column
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
  },
  setup(props) {
    const gridApi = shallowRef<GridApi<IOlympicData> | null>(null);
    const columnDefs = ref<(ColDef | ColGroupDef)[]>([
      {
        headerName: "Everything Resizes",
        children: [
          {
            field: "athlete",
            headerClass: "resizable-header",
          },
          { field: "age", headerClass: "resizable-header" },
          {
            field: "country",
            headerClass: "resizable-header",
          },
        ],
      },
      {
        headerName: "Only Year Resizes",
        children: [
          { field: "year", headerClass: "resizable-header" },
          {
            field: "date",
            resizable: false,
            headerClass: "fixed-size-header",
          },
          {
            field: "sport",
            resizable: false,
            headerClass: "fixed-size-header",
          },
        ],
      },
      {
        headerName: "Nothing Resizes",
        children: [
          {
            field: "gold",
            resizable: false,
            headerClass: "fixed-size-header",
          },
          {
            field: "silver",
            resizable: false,
            headerClass: "fixed-size-header",
          },
          {
            field: "bronze",
            resizable: false,
            headerClass: "fixed-size-header",
          },
          {
            field: "total",
            resizable: false,
            headerClass: "fixed-size-header",
          },
        ],
      },
    ]);
    const defaultColDef = ref<ColDef>({
      width: 150,
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
