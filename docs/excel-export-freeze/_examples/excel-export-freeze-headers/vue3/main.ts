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
  CsvExportModule,
  ExcelExportParams,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ModuleRegistry,
  NumberFilterModule,
  TextFilterModule,
  ValidationModule,
} from "ag-grid-community";
import {
  ColumnMenuModule,
  ContextMenuModule,
  ExcelExportModule,
} from "ag-grid-enterprise";
import { IOlympicData } from "./interfaces";
ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  CsvExportModule,
  ExcelExportModule,
  ColumnMenuModule,
  ContextMenuModule,
  TextFilterModule,
  NumberFilterModule,
  ValidationModule /* Development Only */,
]);

const VueExample = defineComponent({
  template: `
        <div style="height: 100%">
                <div class="container">
      <div class="columns">
        <div>
          <button v-on:click="onBtExport()" style="font-weight: bold">Export to Excel</button>
        </div>
      </div>
      <div class="grid-wrapper">
        <ag-grid-vue
          style="width: 100%; height: 100%;"
          @grid-ready="onGridReady"
          :columnDefs="columnDefs"
          :defaultExcelExportParams="defaultExcelExportParams"
          :rowData="rowData"></ag-grid-vue>
        </div>
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
        headerName: "Athlete Details",
        children: [
          {
            field: "athlete",
            width: 180,
            filter: "agTextColumnFilter",
          },
          {
            field: "age",
            width: 90,
            filter: "agNumberColumnFilter",
          },
          { headerName: "Country", field: "country", width: 140 },
        ],
      },
      {
        headerName: "Sports Results",
        children: [
          { field: "sport", width: 140 },
          {
            columnGroupShow: "closed",
            field: "total",
            width: 100,
            filter: "agNumberColumnFilter",
          },
          {
            columnGroupShow: "open",
            field: "gold",
            width: 100,
            filter: "agNumberColumnFilter",
          },
          {
            columnGroupShow: "open",
            field: "silver",
            width: 100,
            filter: "agNumberColumnFilter",
          },
          {
            columnGroupShow: "open",
            field: "bronze",
            width: 100,
            filter: "agNumberColumnFilter",
          },
        ],
      },
    ]);
    const defaultExcelExportParams = ref<ExcelExportParams>({
      freezeRows: "headers",
    });
    const rowData = ref<IOlympicData[]>(null);

    function onBtExport() {
      gridApi.value!.exportDataAsExcel();
    }
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
      defaultExcelExportParams,
      rowData,
      onGridReady,
      onBtExport,
    };
  },
});

createApp(VueExample).mount("#app");
