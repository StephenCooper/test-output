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
  GridApi,
  GridOptions,
  GridReadyEvent,
  ModuleRegistry,
  NumberEditorModule,
  ProcessCellForExportParams,
  ProcessGroupHeaderForExportParams,
  ProcessHeaderForExportParams,
  TextEditorModule,
  ValidationModule,
  createGrid,
} from "ag-grid-community";
import {
  CellSelectionModule,
  ClipboardModule,
  ColumnMenuModule,
  ContextMenuModule,
} from "ag-grid-enterprise";
import { IOlympicData } from "./interfaces";
ModuleRegistry.registerModules([
  NumberEditorModule,
  TextEditorModule,
  ClientSideRowModelModule,
  ClipboardModule,
  ColumnMenuModule,
  ContextMenuModule,
  CellSelectionModule,
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
      :cellSelection="true"
      :processCellForClipboard="processCellForClipboard"
      :processHeaderForClipboard="processHeaderForClipboard"
      :processGroupHeaderForClipboard="processGroupHeaderForClipboard"
      :processCellFromClipboard="processCellFromClipboard"
      :rowData="rowData"></ag-grid-vue>
        </div>
    `,
  components: {
    "ag-grid-vue": AgGridVue,
  },
  setup(props) {
    const gridApi = shallowRef<GridApi<IOlympicData> | null>(null);
    const columnDefs = ref<(ColDef | ColGroupDef)[]>([
      {
        headerName: "Participants",
        children: [
          { field: "athlete", headerName: "Athlete Name", minWidth: 200 },
          { field: "age" },
          { field: "country", minWidth: 150 },
        ],
      },
      {
        headerName: "Olympic Games",
        children: [
          { field: "year" },
          { field: "date", minWidth: 150 },
          { field: "sport", minWidth: 150 },
          { field: "gold" },
          { field: "silver", suppressPaste: true },
          { field: "bronze" },
          { field: "total" },
        ],
      },
    ]);
    const defaultColDef = ref<ColDef>({
      editable: true,
      flex: 1,
      minWidth: 100,
      cellDataType: false,
    });
    const rowData = ref<IOlympicData[]>(null);

    const onGridReady = (params: GridReadyEvent) => {
      gridApi.value = params.api;

      const updateData = (data) => (rowData.value = data);

      fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
        .then((resp) => resp.json())
        .then((data) => updateData(data));
    };
    function processCellForClipboard(params: ProcessCellForExportParams) {
      return "C-" + params.value;
    }
    function processHeaderForClipboard(params: ProcessHeaderForExportParams) {
      const colDef = params.column.getColDef();
      let headerName = colDef.headerName || colDef.field || "";
      if (colDef.headerName !== "") {
        headerName = headerName.charAt(0).toUpperCase() + headerName.slice(1);
      }
      return "H-" + headerName;
    }
    function processGroupHeaderForClipboard(
      params: ProcessGroupHeaderForExportParams,
    ) {
      const colGroupDef = params.columnGroup.getColGroupDef() || ({} as any);
      const headerName = colGroupDef.headerName || "";
      if (headerName === "") {
        return "";
      }
      return "GH-" + headerName;
    }
    function processCellFromClipboard(params: ProcessCellForExportParams) {
      return "Z-" + params.value;
    }

    return {
      gridApi,
      columnDefs,
      defaultColDef,
      processCellForClipboard,
      processHeaderForClipboard,
      processGroupHeaderForClipboard,
      processCellFromClipboard,
      rowData,
      onGridReady,
    };
  },
});

createApp(VueExample).mount("#app");
