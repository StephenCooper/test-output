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
  CellClassParams,
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  ExcelExportParams,
  ExcelStyle,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ModuleRegistry,
  NumberFilterModule,
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
  TextFilterModule,
  NumberFilterModule,
  ClientSideRowModelModule,
  ExcelExportModule,
  ColumnMenuModule,
  ContextMenuModule,
  ValidationModule /* Development Only */,
]);

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
    const gridApi = shallowRef<GridApi<IOlympicData> | null>(null);
    const columnDefs = ref<(ColDef | ColGroupDef)[]>([
      { field: "athlete" },
      { field: "sport", minWidth: 150 },
      {
        headerName: "Medals",
        children: [
          { field: "gold", headerClass: "gold-header" },
          { field: "silver", headerClass: "silver-header" },
          { field: "bronze", headerClass: "bronze-header" },
        ],
      },
    ]);
    const defaultColDef = ref<ColDef>({
      filter: true,
      minWidth: 100,
      flex: 1,
    });
    const defaultExcelExportParams = ref<ExcelExportParams>({
      headerRowHeight: 30,
    });
    const excelStyles = ref<ExcelStyle[]>([
      {
        id: "header",
        alignment: {
          vertical: "Center",
        },
        interior: {
          color: "#f8f8f8",
          pattern: "Solid",
          patternColor: undefined,
        },
        borders: {
          borderBottom: {
            color: "#ffab00",
            lineStyle: "Continuous",
            weight: 1,
          },
        },
      },
      {
        id: "headerGroup",
        font: {
          bold: true,
        },
      },
      {
        id: "gold-header",
        interior: {
          color: "#E4AB11",
          pattern: "Solid",
        },
      },
      {
        id: "silver-header",
        interior: {
          color: "#bbb4bb",
          pattern: "Solid",
        },
      },
      {
        id: "bronze-header",
        interior: {
          color: "#be9088",
          pattern: "Solid",
        },
      },
    ]);
    const rowData = ref<IOlympicData[]>(null);

    function onBtnExportDataAsExcel() {
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
      defaultColDef,
      defaultExcelExportParams,
      excelStyles,
      rowData,
      onGridReady,
      onBtnExportDataAsExcel,
    };
  },
});

createApp(VueExample).mount("#app");
