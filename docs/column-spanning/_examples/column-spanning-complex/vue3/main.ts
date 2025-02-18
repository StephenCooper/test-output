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
  CellClassRules,
  CellStyleModule,
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  ColSpanParams,
  ColumnAutoSizeModule,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ModuleRegistry,
  RowHeightParams,
  SizeColumnsToContentStrategy,
  SizeColumnsToFitGridStrategy,
  SizeColumnsToFitProvidedWidthStrategy,
  ValidationModule,
} from "ag-grid-community";
import { getData } from "./data";
ModuleRegistry.registerModules([
  ColumnAutoSizeModule,
  CellStyleModule,
  ClientSideRowModelModule,
  ValidationModule /* Development Only */,
]);

const cellClassRules: CellClassRules = {
  "header-cell": 'data.section === "big-title"',
  "quarters-cell": 'data.section === "quarters"',
};

function isHeaderRow(params: RowHeightParams | ColSpanParams) {
  return params.data.section === "big-title";
}

function isQuarterRow(params: ColSpanParams) {
  return params.data.section === "quarters";
}

const VueExample = defineComponent({
  template: `
        <div style="height: 100%">
                <ag-grid-vue
      style="width: 100%; height: 100%;"
      @grid-ready="onGridReady"
      :columnDefs="columnDefs"
      :getRowHeight="getRowHeight"
      :rowData="rowData"
      :defaultColDef="defaultColDef"
      :autoSizeStrategy="autoSizeStrategy"></ag-grid-vue>
        </div>
    `,
  components: {
    "ag-grid-vue": AgGridVue,
  },
  setup(props) {
    const gridApi = shallowRef<GridApi | null>(null);
    const columnDefs = ref<ColDef[]>([
      {
        headerName: "Jan",
        field: "jan",
        colSpan: (params: ColSpanParams) => {
          if (isHeaderRow(params)) {
            return 6;
          } else if (isQuarterRow(params)) {
            return 3;
          } else {
            return 1;
          }
        },
        cellClassRules: cellClassRules,
      },
      { headerName: "Feb", field: "feb" },
      { headerName: "Mar", field: "mar" },
      {
        headerName: "Apr",
        field: "apr",
        colSpan: (params: ColSpanParams) => {
          if (isQuarterRow(params)) {
            return 3;
          } else {
            return 1;
          }
        },
        cellClassRules: cellClassRules,
      },
      { headerName: "May", field: "may" },
      { headerName: "Jun", field: "jun" },
    ]);
    const getRowHeight = ref<
      (params: RowHeightParams) => number | undefined | null
    >((params: RowHeightParams) => {
      if (isHeaderRow(params)) {
        return 60;
      }
    });
    const rowData = ref<any[] | null>(getData());
    const defaultColDef = ref<ColDef>({
      width: 100,
      sortable: false,
      suppressMovable: true,
    });
    const autoSizeStrategy = ref<
      | SizeColumnsToFitGridStrategy
      | SizeColumnsToFitProvidedWidthStrategy
      | SizeColumnsToContentStrategy
    >({
      type: "fitGridWidth",
    });

    const onGridReady = (params: GridReadyEvent) => {
      gridApi.value = params.api;
    };

    return {
      gridApi,
      columnDefs,
      getRowHeight,
      rowData,
      defaultColDef,
      autoSizeStrategy,
      onGridReady,
    };
  },
});

createApp(VueExample).mount("#app");
