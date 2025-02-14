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
  HeaderClassParams,
  ModuleRegistry,
  NumberFilterModule,
  TextFilterModule,
  ValidationModule,
  createGrid,
} from "ag-grid-community";
ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  TextFilterModule,
  NumberFilterModule,
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
  },
  setup(props) {
    const gridApi = shallowRef<GridApi | null>(null);
    const columnDefs = ref<(ColDef | ColGroupDef)[]>([
      {
        headerName: "Athlete Details",
        headerStyle: { color: "white", backgroundColor: "cadetblue" },
        children: [
          {
            field: "athlete",
            headerStyle: { color: "white", backgroundColor: "teal" },
          },
          { field: "age", initialWidth: 120 },
          {
            field: "country",
            headerStyle: (params: HeaderClassParams) => {
              return {
                color: "white",
                backgroundColor: params.floatingFilter
                  ? "cornflowerblue"
                  : "teal",
              };
            },
          },
        ],
      },
      {
        field: "sport",
        wrapHeaderText: true,
        autoHeaderHeight: true,
        headerName: "The Sport the athlete participated in",
        headerClass: "sport-header",
      },
      {
        headerName: "Medal Details",
        headerStyle: (params) => {
          return {
            color: "white",
            backgroundColor: params.columnGroup?.isExpanded()
              ? "cornflowerblue"
              : "orangered",
          };
        },
        children: [
          { field: "bronze", columnGroupShow: "open" },
          { field: "silver", columnGroupShow: "open" },
          { field: "gold", columnGroupShow: "open" },
          {
            columnGroupShow: "closed",
            field: "total",
          },
        ],
      },
    ]);
    const defaultColDef = ref<ColDef>({
      initialWidth: 200,
      floatingFilter: true,
      filter: true,
    });
    const rowData = ref<any[]>(null);

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
