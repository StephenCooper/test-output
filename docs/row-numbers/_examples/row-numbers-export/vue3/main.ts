import {
  createApp,
  defineComponent,
  onBeforeMount,
  ref,
  shallowRef,
} from "vue";
import { AgGridVue } from "ag-grid-vue3";
import {
  CellSelectionOptions,
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  CsvExportParams,
  ExcelExportParams,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ModuleRegistry,
  RowNumbersOptions,
  ValidationModule,
  createGrid,
} from "ag-grid-community";
import {
  CellSelectionModule,
  ContextMenuModule,
  ExcelExportModule,
  RowNumbersModule,
} from "ag-grid-enterprise";
import { IOlympicData } from "./interfaces";
ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  RowNumbersModule,
  CellSelectionModule,
  ExcelExportModule,
  ContextMenuModule,
  ValidationModule /* Development Only */,
]);

const VueExample = defineComponent({
  template: `
        <div style="height: 100%">
                <ag-grid-vue
      style="width: 100%; height: 100%;"
      @grid-ready="onGridReady"
      :columnDefs="columnDefs"
      :defaultColDef="defaultColDef"
      :rowNumbers="true"
      :defaultCsvExportParams="defaultCsvExportParams"
      :defaultExcelExportParams="defaultExcelExportParams"
      :cellSelection="cellSelection"
      :rowData="rowData"></ag-grid-vue>
        </div>
    `,
  components: {
    "ag-grid-vue": AgGridVue,
  },
  setup(props) {
    const gridApi = shallowRef<GridApi<IOlympicData> | null>(null);
    const columnDefs = ref<ColDef[]>([
      { field: "athlete" },
      { field: "country" },
      { field: "sport" },
      { field: "year" },
      { field: "gold" },
      { field: "silver" },
      { field: "bronze" },
    ]);
    const defaultColDef = ref<ColDef>({
      flex: 1,
      minWidth: 100,
    });
    const defaultCsvExportParams = ref<CsvExportParams>({
      exportRowNumbers: true,
    });
    const defaultExcelExportParams = ref<ExcelExportParams>({
      exportRowNumbers: true,
    });
    const cellSelection = ref<boolean | CellSelectionOptions>({
      enableHeaderHighlight: true,
      handle: {
        mode: "fill",
      },
    });
    const rowData = ref<IOlympicData[]>(null);

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
      defaultCsvExportParams,
      defaultExcelExportParams,
      cellSelection,
      rowData,
      onGridReady,
    };
  },
});

createApp(VueExample).mount("#app");
