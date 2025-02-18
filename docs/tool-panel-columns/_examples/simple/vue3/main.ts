import {
  createApp,
  defineComponent,
  onBeforeMount,
  ref,
  shallowRef,
} from "vue";
import { AgGridVue } from "ag-grid-vue3";
import {
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ModuleRegistry,
  NumberFilterModule,
  SideBarDef,
  TextFilterModule,
  ValidationModule,
} from "ag-grid-community";
import {
  ColumnMenuModule,
  ColumnsToolPanelModule,
  ContextMenuModule,
  PivotModule,
  SetFilterModule,
} from "ag-grid-enterprise";
import { IOlympicData } from "./interfaces";
ModuleRegistry.registerModules([
  NumberFilterModule,
  ClientSideRowModelModule,
  ColumnsToolPanelModule,
  ColumnMenuModule,
  ContextMenuModule,
  PivotModule,
  SetFilterModule,
  TextFilterModule,
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
      :autoGroupColumnDef="autoGroupColumnDef"
      :sideBar="sideBar"
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
        headerName: "Athlete",
        children: [
          {
            field: "athlete",
            filter: "agTextColumnFilter",
            enableRowGroup: true,
            enablePivot: true,
            minWidth: 150,
          },
          { field: "age", enableRowGroup: true, enablePivot: true },
          {
            field: "country",
            enableRowGroup: true,
            enablePivot: true,
            minWidth: 125,
          },
        ],
      },
      {
        headerName: "Competition",
        children: [
          { field: "year", enableRowGroup: true, enablePivot: true },
          {
            field: "date",
            enableRowGroup: true,
            enablePivot: true,
            minWidth: 180,
          },
        ],
      },
      {
        field: "sport",
        enableRowGroup: true,
        enablePivot: true,
        minWidth: 125,
      },
      {
        headerName: "Medals",
        children: [
          { field: "gold", enableValue: true },
          { field: "silver", enableValue: true },
          { field: "bronze", enableValue: true },
          { field: "total", enableValue: true },
        ],
      },
    ]);
    const defaultColDef = ref<ColDef>({
      flex: 1,
      minWidth: 100,
      filter: true,
    });
    const autoGroupColumnDef = ref<ColDef>({
      minWidth: 200,
    });
    const sideBar = ref<SideBarDef | string | string[] | boolean | null>(
      "columns",
    );
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
      autoGroupColumnDef,
      sideBar,
      rowData,
      onGridReady,
    };
  },
});

createApp(VueExample).mount("#app");
