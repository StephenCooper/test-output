import {
  createApp,
  defineComponent,
  onBeforeMount,
  ref,
  shallowRef,
} from "vue";
import { AgGridVue } from "ag-grid-vue3";
import "./style.css";
import {
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  CsvCell,
  CsvExportParams,
  ExcelCell,
  ExcelExportParams,
  ExcelRow,
  ExcelStyle,
  GridApi,
  GridOptions,
  GridReadyEvent,
  IDetailCellRendererParams,
  ModuleRegistry,
  ProcessRowGroupForExportParams,
  ValidationModule,
} from "ag-grid-community";
import {
  ClipboardModule,
  ColumnMenuModule,
  ColumnsToolPanelModule,
  ContextMenuModule,
  ExcelExportModule,
  MasterDetailModule,
} from "ag-grid-enterprise";
import { IAccount } from "./interfaces";
ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  ClipboardModule,
  ColumnsToolPanelModule,
  ExcelExportModule,
  MasterDetailModule,
  ColumnMenuModule,
  ContextMenuModule,
  ValidationModule /* Development Only */,
]);

const getRows = (params: ProcessRowGroupForExportParams) => {
  const rows = [
    {
      outlineLevel: 1,
      cells: [
        cell(""),
        cell("Call Id", "header"),
        cell("Direction", "header"),
        cell("Number", "header"),
        cell("Duration", "header"),
        cell("Switch Code", "header"),
      ],
    },
  ].concat(
    ...params.node.data.callRecords.map((record: any) => [
      {
        outlineLevel: 1,
        cells: [
          cell(""),
          cell(record.callId, "body"),
          cell(record.direction, "body"),
          cell(record.number, "body"),
          cell(record.duration, "body"),
          cell(record.switchCode, "body"),
        ],
      },
    ]),
  );
  return rows;
};

function cell(text: string, styleId?: string): ExcelCell {
  return {
    styleId: styleId,
    data: {
      type: /^\d+$/.test(text) ? "Number" : "String",
      value: String(text),
    },
  };
}

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
          :defaultCsvExportParams="defaultCsvExportParams"
          :defaultExcelExportParams="defaultExcelExportParams"
          :columnDefs="columnDefs"
          :defaultColDef="defaultColDef"
          :masterDetail="true"
          :detailCellRendererParams="detailCellRendererParams"
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
    const gridApi = shallowRef<GridApi<IAccount> | null>(null);
    const defaultCsvExportParams = ref<CsvExportParams>({
      getCustomContentBelowRow: (params) => {
        const rows = getRows(params);
        return rows.map((row) => row.cells) as CsvCell[][];
      },
    });
    const defaultExcelExportParams = ref<ExcelExportParams>({
      getCustomContentBelowRow: (params) => getRows(params) as ExcelRow[],
      columnWidth: 120,
      fileName: "ag-grid.xlsx",
    });
    const columnDefs = ref<ColDef[]>([
      // group cell renderer needed for expand / collapse icons
      { field: "name", cellRenderer: "agGroupCellRenderer" },
      { field: "account" },
      { field: "calls" },
      { field: "minutes", valueFormatter: "x.toLocaleString() + 'm'" },
    ]);
    const defaultColDef = ref<ColDef>({
      flex: 1,
    });
    const detailCellRendererParams = ref({
      detailGridOptions: {
        columnDefs: [
          { field: "callId" },
          { field: "direction" },
          { field: "number", minWidth: 150 },
          { field: "duration", valueFormatter: "x.toLocaleString() + 's'" },
          { field: "switchCode", minWidth: 150 },
        ],
        defaultColDef: {
          flex: 1,
        },
      },
      getDetailRowData: (params) => {
        params.successCallback(params.data.callRecords);
      },
    } as IDetailCellRendererParams<IAccount, ICallRecord>);
    const excelStyles = ref<ExcelStyle[]>([
      {
        id: "header",
        interior: {
          color: "#aaaaaa",
          pattern: "Solid",
        },
      },
      {
        id: "body",
        interior: {
          color: "#dddddd",
          pattern: "Solid",
        },
      },
    ]);
    const rowData = ref<IAccount[]>(null);

    function onBtExport() {
      gridApi.value!.exportDataAsExcel();
    }
    const onGridReady = (params: GridReadyEvent) => {
      gridApi.value = params.api;

      const updateData = (data) => {
        rowData.value = data;
      };

      fetch("https://www.ag-grid.com/example-assets/master-detail-data.json")
        .then((resp) => resp.json())
        .then((data) => updateData(data));
    };

    return {
      gridApi,
      defaultCsvExportParams,
      defaultExcelExportParams,
      columnDefs,
      defaultColDef,
      detailCellRendererParams,
      excelStyles,
      rowData,
      onGridReady,
      onBtExport,
    };
  },
});

createApp(VueExample).mount("#app");
