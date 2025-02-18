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
  HeaderValueGetterParams,
  ModuleRegistry,
  NumberFilterModule,
  SideBarDef,
  ValidationModule,
} from "ag-grid-community";
import {
  ColumnMenuModule,
  ColumnsToolPanelModule,
  ContextMenuModule,
  PivotModule,
  RowGroupingPanelModule,
  SetFilterModule,
} from "ag-grid-enterprise";
import { IOlympicData } from "./interfaces";
ModuleRegistry.registerModules([
  NumberFilterModule,
  ClientSideRowModelModule,
  ColumnsToolPanelModule,
  ColumnMenuModule,
  ContextMenuModule,
  SetFilterModule,
  PivotModule,
  RowGroupingPanelModule,
  ValidationModule /* Development Only */,
]);

function countryHeaderValueGetter(params: HeaderValueGetterParams) {
  switch (params.location) {
    case "csv":
      return "CSV Country";
    case "columnToolPanel":
      return "TP Country";
    case "columnDrop":
      return "CD Country";
    case "header":
      return "H Country";
    default:
      return "Should never happen!";
  }
}

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
      :rowGroupPanelShow="rowGroupPanelShow"
      :rowData="rowData"></ag-grid-vue>
        </div>
    `,
  components: {
    "ag-grid-vue": AgGridVue,
  },
  setup(props) {
    const gridApi = shallowRef<GridApi<IOlympicData> | null>(null);
    const columnDefs = ref<ColDef[]>([
      {
        field: "athlete",
        minWidth: 200,
        enableRowGroup: true,
        enablePivot: true,
      },
      {
        field: "age",
        enableValue: true,
      },
      {
        field: "country",
        minWidth: 200,
        enableRowGroup: true,
        enablePivot: true,
        headerValueGetter: countryHeaderValueGetter,
      },
      {
        field: "year",
        enableRowGroup: true,
        enablePivot: true,
      },
      {
        field: "date",
        minWidth: 180,
        enableRowGroup: true,
        enablePivot: true,
      },
      {
        field: "sport",
        minWidth: 200,
        enableRowGroup: true,
        enablePivot: true,
      },
      {
        field: "gold",
        hide: true,
        enableValue: true,
        toolPanelClass: "tp-gold",
      },
      {
        field: "silver",
        hide: true,
        enableValue: true,
        toolPanelClass: ["tp-silver"],
      },
      {
        field: "bronze",
        hide: true,
        enableValue: true,
        toolPanelClass: (params) => {
          return "tp-bronze";
        },
      },
      {
        headerName: "Total",
        field: "total",
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
    const rowGroupPanelShow = ref<"always" | "onlyWhenGrouping" | "never">(
      "always",
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
      rowGroupPanelShow,
      rowData,
      onGridReady,
    };
  },
});

createApp(VueExample).mount("#app");
