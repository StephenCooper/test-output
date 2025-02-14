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
import { RowGroupingModule } from "ag-grid-enterprise";
import { IOlympicData } from "./interfaces";
ModuleRegistry.registerModules([
  TextFilterModule,
  ClientSideRowModelModule,
  RowGroupingModule,
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
      :groupHeaderHeight="groupHeaderHeight"
      :headerHeight="headerHeight"
      :floatingFiltersHeight="floatingFiltersHeight"
      :rowData="rowData"></ag-grid-vue>
        </div>
    `,
  components: {
    "ag-grid-vue": AgGridVue,
  },
  setup(props) {
    const gridApi = shallowRef<GridApi<IOlympicData> | null>(null);
    const columnDefs = ref<(ColDef | ColGroupDef)[]>([
      {
        headerName: "Athlete Details",
        children: [
          {
            field: "athlete",
            width: 150,
            suppressSizeToFit: true,
            enableRowGroup: true,
            rowGroupIndex: 0,
          },
          {
            field: "age",
            width: 90,
            minWidth: 75,
            maxWidth: 100,
            enableRowGroup: true,
          },
          {
            field: "country",
            width: 120,
            enableRowGroup: true,
          },
          {
            field: "year",
            width: 90,
            enableRowGroup: true,
          },
          { field: "sport", width: 110, enableRowGroup: true },
          {
            field: "gold",
            width: 60,
            enableValue: true,
            suppressHeaderMenuButton: true,
            suppressHeaderFilterButton: true,
            filter: "agNumberColumnFilter",
            aggFunc: "sum",
          },
          {
            field: "silver",
            width: 60,
            enableValue: true,
            suppressHeaderMenuButton: true,
            suppressHeaderFilterButton: true,
            filter: "agNumberColumnFilter",
            aggFunc: "sum",
          },
          {
            field: "bronze",
            width: 60,
            enableValue: true,
            suppressHeaderMenuButton: true,
            suppressHeaderFilterButton: true,
            filter: "agNumberColumnFilter",
            aggFunc: "sum",
          },
          {
            field: "total",
            width: 60,
            enableValue: true,
            suppressHeaderMenuButton: true,
            suppressHeaderFilterButton: true,
            filter: "agNumberColumnFilter",
            aggFunc: "sum",
          },
        ],
      },
    ]);
    const groupHeaderHeight = ref(75);
    const headerHeight = ref(150);
    const floatingFiltersHeight = ref(50);
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
      groupHeaderHeight,
      headerHeight,
      floatingFiltersHeight,
      rowData,
      onGridReady,
    };
  },
});

createApp(VueExample).mount("#app");
