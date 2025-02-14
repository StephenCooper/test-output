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
  ModuleRegistry,
  ValidationModule,
  createGrid,
} from "ag-grid-community";
import {
  ColumnMenuModule,
  ContextMenuModule,
  ExcelExportModule,
} from "ag-grid-enterprise";
ModuleRegistry.registerModules([
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
                <div class="example-wrapper">
      <div class="example-header">
        <button v-on:click="onBtExport()" style="font-weight: bold">Export to Excel</button>
      </div>
      <ag-grid-vue
        style="width: 100%; height: 100%;"
        @grid-ready="onGridReady"
        :columnDefs="columnDefs"
        :defaultColDef="defaultColDef"
        :rowData="rowData"
        :excelStyles="excelStyles"
        :popupParent="popupParent"></ag-grid-vue>
      </div>
        </div>
    `,
  components: {
    "ag-grid-vue": AgGridVue,
  },
  setup(props) {
    const gridApi = shallowRef<GridApi | null>(null);
    const columnDefs = ref<ColDef[]>([
      { headerName: "provided", field: "rawValue" },
      { headerName: "number", field: "rawValue", cellClass: "numberType" },
      {
        headerName: "currency",
        field: "rawValue",
        cellClass: "currencyFormat",
      },
      { headerName: "boolean", field: "rawValue", cellClass: "booleanType" },
      {
        headerName: "Negative",
        field: "negativeValue",
        cellClass: "negativeInBrackets",
      },
      { headerName: "string", field: "rawValue", cellClass: "stringType" },
      {
        headerName: "Date",
        field: "dateValue",
        cellClass: "dateType",
        minWidth: 220,
      },
    ]);
    const defaultColDef = ref<ColDef>({
      flex: 1,
      minWidth: 100,
    });
    const rowData = ref<any[] | null>([
      {
        rawValue: 1,
        negativeValue: -10,
        dateValue: "2009-04-20T00:00:00.000",
      },
    ]);
    const excelStyles = ref<ExcelStyle[]>([
      {
        id: "numberType",
        numberFormat: {
          format: "0",
        },
      },
      {
        id: "currencyFormat",
        numberFormat: {
          format: "#,##0.00 €",
        },
      },
      {
        id: "negativeInBrackets",
        numberFormat: {
          format: "$[blue] #,##0;$ [red](#,##0)",
        },
      },
      {
        id: "booleanType",
        dataType: "Boolean",
      },
      {
        id: "stringType",
        dataType: "String",
      },
      {
        id: "dateType",
        dataType: "DateTime",
      },
    ]);
    const popupParent = ref<HTMLElement | null>(document.body);

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
      popupParent,
      onGridReady,
      onBtExport,
    };
  },
});

createApp(VueExample).mount("#app");
