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
  CellStyleModule,
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  ExcelStyle,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ModuleRegistry,
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
      { field: "athlete", minWidth: 200 },
      {
        field: "age",
        cellClassRules: {
          greenBackground: (params) => {
            return params.value < 23;
          },
          redFont: (params) => {
            return params.value < 20;
          },
        },
      },
      {
        field: "country",
        minWidth: 200,
        cellClassRules: {
          redFont: (params) => {
            return params.value === "United States";
          },
        },
      },
      {
        headerName: "Group",
        valueGetter: "data.country.charAt(0)",
        cellClass: ["redFont", "greenBackground"],
      },
      {
        field: "year",
        cellClassRules: {
          notInExcel: (params) => {
            return true;
          },
        },
      },
      { field: "sport", minWidth: 150 },
    ]);
    const defaultColDef = ref<ColDef>({
      cellClassRules: {
        darkGreyBackground: (params: CellClassParams) => {
          return (params.node.rowIndex || 0) % 2 == 0;
        },
      },
      filter: true,
      minWidth: 100,
      flex: 1,
    });
    const excelStyles = ref<ExcelStyle[]>([
      {
        id: "cell",
        alignment: {
          vertical: "Center",
        },
      },
      {
        id: "greenBackground",
        interior: {
          color: "#b5e6b5",
          pattern: "Solid",
        },
      },
      {
        id: "redFont",
        font: {
          fontName: "Calibri Light",
          underline: "Single",
          italic: true,
          color: "#BB0000",
        },
      },
      {
        id: "darkGreyBackground",
        interior: {
          color: "#888888",
          pattern: "Solid",
        },
        font: {
          fontName: "Calibri Light",
          color: "#ffffff",
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
      excelStyles,
      rowData,
      onGridReady,
      onBtnExportDataAsExcel,
    };
  },
});

createApp(VueExample).mount("#app");
