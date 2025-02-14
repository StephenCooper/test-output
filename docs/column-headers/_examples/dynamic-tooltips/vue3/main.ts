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
  TextEditorModule,
  TextFilterModule,
  TooltipModule,
  ValidationModule,
  createGrid,
} from "ag-grid-community";
import CustomHeader from "./customHeaderVue";
import { IOlympicData } from "./interfaces";
ModuleRegistry.registerModules([
  NumberEditorModule,
  TextEditorModule,
  TextFilterModule,
  NumberFilterModule,
  ClientSideRowModelModule,
  TooltipModule,
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
    CustomHeader,
  },
  setup(props) {
    const gridApi = shallowRef<GridApi<IOlympicData> | null>(null);
    const columnDefs = ref<ColDef[]>([
      {
        field: "athlete",
        headerName: "Athlete's Full Name",
        suppressHeaderFilterButton: true,
        minWidth: 120,
      },
      {
        field: "age",
        headerName: "Athlete's Age",
        sortable: false,
        headerComponentParams: { menuIcon: "fa-external-link-alt" },
      },
      {
        field: "country",
        headerName: "Athlete's Country",
        suppressHeaderFilterButton: true,
        minWidth: 120,
      },
      { field: "year", headerName: "Event Year", sortable: false },
      {
        field: "date",
        headerName: "Event Date",
        suppressHeaderFilterButton: true,
      },
      { field: "sport", sortable: false },
      {
        field: "gold",
        headerName: "Gold Medals",
        headerComponentParams: { menuIcon: "fa-cog" },
        minWidth: 120,
      },
      { field: "silver", headerName: "Silver Medals", sortable: false },
      {
        field: "bronze",
        headerName: "Bronze Medals",
        suppressHeaderFilterButton: true,
        minWidth: 120,
      },
      { field: "total", headerName: "Total Medals", sortable: false },
    ]);
    const defaultColDef = ref<ColDef>({
      editable: true,
      filter: true,
      width: 120,
      headerComponent: "CustomHeader",
      headerComponentParams: {
        menuIcon: "fa-bars",
      },
    });
    const rowData = ref<IOlympicData[]>(null);

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
    };
  },
});

createApp(VueExample).mount("#app");
