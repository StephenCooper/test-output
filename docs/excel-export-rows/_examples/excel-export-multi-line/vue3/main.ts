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
  CellStyleModule,
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  CsvExportModule,
  ExcelStyle,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ICellRendererParams,
  ModuleRegistry,
  RowAutoHeightModule,
  ValidationModule,
  createGrid,
} from "ag-grid-community";
import {
  ColumnMenuModule,
  ContextMenuModule,
  ExcelExportModule,
} from "ag-grid-enterprise";
import MultilineCellRenderer from "./multilineCellRendererVue";
ModuleRegistry.registerModules([
  RowAutoHeightModule,
  CellStyleModule,
  ClientSideRowModelModule,
  CsvExportModule,
  ExcelExportModule,
  ColumnMenuModule,
  ContextMenuModule,
  ValidationModule /* Development Only */,
]);

const VueExample = defineComponent({
  template: `
        <div style="height: 100%">
                <div class="container">
      <div>
        <button v-on:click="onBtExport()" style="margin: 5px 0px; font-weight: bold">Export to Excel</button>
      </div>
      <div class="grid-wrapper">
        <ag-grid-vue
          style="width: 100%; height: 100%;"
          @grid-ready="onGridReady"
          :columnDefs="columnDefs"
          :defaultColDef="defaultColDef"
          :rowData="rowData"
          :excelStyles="excelStyles"></ag-grid-vue>
        </div>
      </div>
        </div>
    `,
  components: {
    "ag-grid-vue": AgGridVue,
    MultilineCellRenderer,
  },
  setup(props) {
    const gridApi = shallowRef<GridApi | null>(null);
    const columnDefs = ref<ColDef[]>([
      { field: "address" },
      {
        headerName: "Custom column",
        autoHeight: true,
        valueGetter: (param) => {
          return param.data.col1 + "\n" + param.data.col2;
        },
        cellRenderer: "MultilineCellRenderer",
      },
    ]);
    const defaultColDef = ref<ColDef>({
      cellClass: "multiline",
      minWidth: 100,
      flex: 1,
    });
    const rowData = ref<any[] | null>([
      {
        address:
          "1197 Thunder Wagon Common,\nCataract, RI, \n02987-1016, US, \n(401) 747-0763",
        col1: "abc",
        col2: "xyz",
      },
      {
        address:
          "3685 Rocky Glade, Showtucket, NU, \nX1E-9I0, CA, \n(867) 371-4215",
        col1: "abc",
        col2: "xyz",
      },
      {
        address:
          "3235 High Forest, Glen Campbell, MS, \n39035-6845, US, \n(601) 638-8186",
        col1: "abc",
        col2: "xyz",
      },
      {
        address:
          "2234 Sleepy Pony Mall , Drain, DC, \n20078-4243, US, \n(202) 948-3634",
        col1: "abc",
        col2: "xyz",
      },
    ]);
    const excelStyles = ref<ExcelStyle[]>([
      {
        id: "multiline",
        alignment: {
          wrapText: true,
        },
      },
    ]);

    function onBtExport() {
      gridApi.value!.exportDataAsExcel();
    }
    const onGridReady = (params: GridReadyEvent) => {
      gridApi.value = params.api;
    };

    return {
      gridApi,
      columnDefs,
      defaultColDef,
      rowData,
      excelStyles,
      onGridReady,
      onBtExport,
    };
  },
});

createApp(VueExample).mount("#app");
