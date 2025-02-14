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
  PinnedRowModule,
  TextFilterModule,
  ValidationModule,
  createGrid,
} from "ag-grid-community";
import {
  ColumnMenuModule,
  ContextMenuModule,
  ExcelExportModule,
} from "ag-grid-enterprise";
import { IOlympicData } from "./interfaces";
ModuleRegistry.registerModules([
  PinnedRowModule,
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
          :pinnedTopRowData="pinnedTopRowData"
          :pinnedBottomRowData="pinnedBottomRowData"
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
    const pinnedTopRowData = ref<any[]>([
      {
        athlete: "TOP (athlete)",
        country: "TOP (country)",
        sport: "TOP (sport)",
      },
    ]);
    const pinnedBottomRowData = ref<any[]>([
      {
        athlete: "BOTTOM (athlete)",
        country: "BOTTOM (country)",
        sport: "BOTTOM (sport)",
      },
    ]);
    const defaultExcelExportParams = ref<ExcelExportParams>({
      freezeRows: "headersAndPinnedRows",
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
      pinnedTopRowData,
      pinnedBottomRowData,
      defaultExcelExportParams,
      rowData,
      onGridReady,
      onBtExport,
    };
  },
});

createApp(VueExample).mount("#app");
