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
  ProcessCellForExportParams,
  ProcessRowGroupForExportParams,
  UseGroupTotalRow,
  ValidationModule,
} from "ag-grid-community";
import {
  ColumnMenuModule,
  ContextMenuModule,
  ExcelExportModule,
  RowGroupingModule,
  SetFilterModule,
} from "ag-grid-enterprise";
import { IOlympicData } from "./interfaces";
ModuleRegistry.registerModules([
  NumberFilterModule,
  ClientSideRowModelModule,
  CsvExportModule,
  ExcelExportModule,
  ColumnMenuModule,
  ContextMenuModule,
  RowGroupingModule,
  SetFilterModule,
  ValidationModule /* Development Only */,
]);

const getParams: () => ExcelExportParams = () => ({
  processCellCallback(params: ProcessCellForExportParams): string {
    const value = params.value;
    return value === undefined ? "" : `_${value}_`;
  },
  processRowGroupCallback(params: ProcessRowGroupForExportParams): string {
    const { node } = params;
    if (!node.footer) {
      return `row group: ${node.key}`;
    }
    const isRootLevel = node.level === -1;
    if (isRootLevel) {
      return "Grand Total";
    }
    return `Sub Total (${node.key})`;
  },
});

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
          :groupTotalRow="groupTotalRow"
          :grandTotalRow="grandTotalRow"
          :popupParent="popupParent"
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
    const columnDefs = ref<ColDef[]>([
      { field: "athlete", minWidth: 200 },
      { field: "country", minWidth: 200, rowGroup: true, hide: true },
      { field: "sport", minWidth: 150 },
      { field: "gold", aggFunc: "sum" },
    ]);
    const defaultColDef = ref<ColDef>({
      filter: true,
      minWidth: 150,
      flex: 1,
    });
    const groupTotalRow = ref<"top" | "bottom" | UseGroupTotalRow>("bottom");
    const grandTotalRow = ref<"top" | "bottom">("bottom");
    const popupParent = ref<HTMLElement | null>(document.body);
    const defaultExcelExportParams = ref<ExcelExportParams>(getParams());
    const rowData = ref<IOlympicData[]>(null);

    function onBtExport() {
      gridApi.value!.exportDataAsExcel(getParams());
    }
    const onGridReady = (params: GridReadyEvent) => {
      gridApi.value = params.api;

      const updateData = (data) =>
        (rowData.value = data.filter((rec: any) => rec.country != null));

      fetch("https://www.ag-grid.com/example-assets/small-olympic-winners.json")
        .then((resp) => resp.json())
        .then((data) => updateData(data));
    };

    return {
      gridApi,
      columnDefs,
      defaultColDef,
      groupTotalRow,
      grandTotalRow,
      popupParent,
      defaultExcelExportParams,
      rowData,
      onGridReady,
      onBtExport,
    };
  },
});

createApp(VueExample).mount("#app");
