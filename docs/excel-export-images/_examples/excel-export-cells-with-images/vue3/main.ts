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
  ExcelExportParams,
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
import CountryCellRenderer from "./countryCellRendererVue";
import { createBase64FlagsFromResponse } from "./imageUtils";
import { FlagContext } from "./interfaces";
import { IOlympicData } from "./interfaces";
ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  ExcelExportModule,
  ColumnMenuModule,
  ContextMenuModule,
  ValidationModule /* Development Only */,
]);

const countryCodes: any = {};

const base64flags: any = {};

const VueExample = defineComponent({
  template: `
        <div style="height: 100%">
                <div class="container">
      <div>
        <button class="export" v-on:click="onBtExport()">Export to Excel</button>
      </div>
      <div class="grid-wrapper">
        <ag-grid-vue
          style="width: 100%; height: 100%;"
          @grid-ready="onGridReady"
          :columnDefs="columnDefs"
          :defaultColDef="defaultColDef"
          :defaultExcelExportParams="defaultExcelExportParams"
          :context="context"
          :rowData="rowData"></ag-grid-vue>
        </div>
      </div>
        </div>
    `,
  components: {
    "ag-grid-vue": AgGridVue,
    CountryCellRenderer,
  },
  setup(props) {
    const gridApi = shallowRef<GridApi<IOlympicData> | null>(null);
    const columnDefs = ref<ColDef[]>([
      {
        field: "country",
        headerName: " ",
        minWidth: 70,
        width: 70,
        maxWidth: 70,
        cellRenderer: "CountryCellRenderer",
        cellRendererParams: {
          base64flags: base64flags,
          countryCodes: countryCodes,
        },
      },
      { field: "athlete" },
      { field: "age" },
      { field: "year" },
      { field: "date" },
      { field: "sport" },
      { field: "gold" },
      { field: "silver" },
      { field: "bronze" },
      { field: "total" },
    ]);
    const defaultColDef = ref<ColDef>({
      width: 150,
    });
    const defaultExcelExportParams = ref<ExcelExportParams>({
      addImageToCell: (rowIndex, col, value) => {
        if (col.getColId() !== "country") {
          return;
        }
        const countryCode = countryCodes[value];
        return {
          image: {
            id: countryCode,
            base64: base64flags[countryCode],
            imageType: "png",
            width: 20,
            height: 11,
            position: {
              offsetX: 30,
              offsetY: 5.5,
            },
          },
        };
      },
    });
    const context = ref({
      base64flags: base64flags,
      countryCodes: countryCodes,
    } as FlagContext);
    const rowData = ref<IOlympicData[]>(null);

    function onBtExport() {
      gridApi.value!.exportDataAsExcel();
    }
    const onGridReady = (params: GridReadyEvent) => {
      gridApi.value = params.api;

      fetch("https://www.ag-grid.com/example-assets/small-olympic-winners.json")
        .then((data) =>
          createBase64FlagsFromResponse(data, countryCodes, base64flags),
        )
        .then((data) => params.api.setGridOption("rowData", data));
    };

    return {
      gridApi,
      columnDefs,
      defaultColDef,
      defaultExcelExportParams,
      context,
      rowData,
      onGridReady,
      onBtExport,
    };
  },
});

createApp(VueExample).mount("#app");
