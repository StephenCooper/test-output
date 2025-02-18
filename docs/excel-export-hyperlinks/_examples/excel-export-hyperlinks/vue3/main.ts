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
  ExcelExportParams,
  ExcelStyle,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ModuleRegistry,
  ValidationModule,
} from "ag-grid-community";
import {
  ColumnMenuModule,
  ContextMenuModule,
  ExcelExportModule,
} from "ag-grid-enterprise";
ModuleRegistry.registerModules([
  CellStyleModule,
  ClientSideRowModelModule,
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
        <button v-on:click="onBtExport()" style="margin-bottom: 5px; font-weight: bold">Export to Excel</button>
      </div>
      <div class="grid-wrapper">
        <ag-grid-vue
          style="width: 100%; height: 100%;"
          @grid-ready="onGridReady"
          :columnDefs="columnDefs"
          :defaultColDef="defaultColDef"
          :defaultExcelExportParams="defaultExcelExportParams"
          :excelStyles="excelStyles"
          :rowData="rowData"></ag-grid-vue>
        </div>
      </div>
        </div>
    `,
  components: {
    "ag-grid-vue": AgGridVue,
  },
  setup(props) {
    const gridApi = shallowRef<GridApi | null>(null);
    const columnDefs = ref<ColDef[]>([
      { field: "company" },
      { field: "url", cellClass: "hyperlinks" },
    ]);
    const defaultColDef = ref<ColDef>({
      flex: 1,
      minWidth: 100,
    });
    const defaultExcelExportParams = ref<ExcelExportParams>({
      autoConvertFormulas: true,
      processCellCallback: (params) => {
        const field = params.column.getColDef().field;
        return field === "url" ? `=HYPERLINK("${params.value}")` : params.value;
      },
    });
    const excelStyles = ref<ExcelStyle[]>([
      {
        id: "hyperlinks",
        font: {
          underline: "Single",
          color: "#358ccb",
        },
      },
    ]);
    const rowData = ref<any[] | null>([
      { company: "Google", url: "https://www.google.com" },
      { company: "Adobe", url: "https://www.adobe.com" },
      { company: "The New York Times", url: "https://www.nytimes.com" },
      { company: "Twitter", url: "https://www.twitter.com" },
      { company: "StackOverflow", url: "https://stackoverflow.com/" },
      { company: "Reddit", url: "https://www.reddit.com" },
      { company: "GitHub", url: "https://www.github.com" },
      { company: "Microsoft", url: "https://www.microsoft.com" },
      { company: "Gizmodo", url: "https://www.gizmodo.com" },
      { company: "LinkedIN", url: "https://www.linkedin.com" },
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
      defaultExcelExportParams,
      excelStyles,
      rowData,
      onGridReady,
      onBtExport,
    };
  },
});

createApp(VueExample).mount("#app");
