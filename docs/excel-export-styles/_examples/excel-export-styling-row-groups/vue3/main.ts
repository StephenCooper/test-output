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
  CellClassParams,
  CellStyleModule,
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  ExcelStyle,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ModuleRegistry,
  NumberFilterModule,
  ProcessRowGroupForExportParams,
  TextFilterModule,
  ValidationModule,
} from "ag-grid-community";
import {
  ColumnMenuModule,
  ContextMenuModule,
  ExcelExportModule,
  RowGroupingModule,
} from "ag-grid-enterprise";
import { IOlympicData } from "./interfaces";
ModuleRegistry.registerModules([
  TextFilterModule,
  NumberFilterModule,
  CellStyleModule,
  ClientSideRowModelModule,
  ExcelExportModule,
  ColumnMenuModule,
  ContextMenuModule,
  RowGroupingModule,
  ValidationModule /* Development Only */,
]);

function rowGroupCallback(params: ProcessRowGroupForExportParams) {
  return params.node.key!;
}

function getIndentClass(params: CellClassParams) {
  let indent = 0;
  let node = params.node;
  while (node && node.parent) {
    indent++;
    node = node.parent;
  }
  return "indent-" + indent;
}

const VueExample = defineComponent({
  template: `
        <div style="height: 100%">
                <div class="page-wrapper">
      <div>
        <button v-on:click="onBtnExportDataAsExcel()" style="margin-bottom: 5px; font-weight: bold">
          Export to Excel
        </button>
      </div>
      <div class="grid-wrapper">
        <ag-grid-vue
          style="width: 100%; height: 100%;"
          @grid-ready="onGridReady"
          :columnDefs="columnDefs"
          :defaultColDef="defaultColDef"
          :groupDefaultExpanded="groupDefaultExpanded"
          :autoGroupColumnDef="autoGroupColumnDef"
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
    const gridApi = shallowRef<GridApi<IOlympicData> | null>(null);
    const columnDefs = ref<ColDef[]>([
      { field: "country", minWidth: 120, rowGroup: true },
      { field: "year", rowGroup: true },
      { headerName: "Name", field: "athlete", minWidth: 150 },
      {
        headerName: "Name Length",
        valueGetter: 'data ? data.athlete.length : ""',
      },
      { field: "sport", minWidth: 120, rowGroup: true },
      { field: "silver" },
      { field: "bronze" },
      { field: "total" },
    ]);
    const defaultColDef = ref<ColDef>({
      filter: true,
      minWidth: 100,
      flex: 1,
    });
    const groupDefaultExpanded = ref(-1);
    const autoGroupColumnDef = ref<ColDef>({
      cellClass: getIndentClass,
      minWidth: 250,
      flex: 1,
    });
    const excelStyles = ref<ExcelStyle[]>([
      {
        id: "indent-1",
        alignment: {
          indent: 1,
        },
        // note, dataType: 'string' required to ensure that numeric values aren't right-aligned
        dataType: "String",
      },
      {
        id: "indent-2",
        alignment: {
          indent: 2,
        },
        dataType: "String",
      },
      {
        id: "indent-3",
        alignment: {
          indent: 3,
        },
        dataType: "String",
      },
    ]);
    const rowData = ref<IOlympicData[]>(null);

    function onBtnExportDataAsExcel() {
      gridApi.value!.exportDataAsExcel({
        processRowGroupCallback: rowGroupCallback,
      });
    }
    const onGridReady = (params: GridReadyEvent) => {
      gridApi.value = params.api;

      const updateData = (data) => {
        rowData.value = data;
      };

      fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
        .then((resp) => resp.json())
        .then((data) => updateData(data));
    };

    return {
      gridApi,
      columnDefs,
      defaultColDef,
      groupDefaultExpanded,
      autoGroupColumnDef,
      excelStyles,
      rowData,
      onGridReady,
      onBtnExportDataAsExcel,
    };
  },
});

createApp(VueExample).mount("#app");
