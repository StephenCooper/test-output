import {
  createApp,
  defineComponent,
  onBeforeMount,
  ref,
  shallowRef,
} from "vue";
import { AgGridVue } from "ag-grid-vue3";
import {
  CellStyleModule,
  ColDef,
  ColGroupDef,
  GetRowIdFunc,
  GetRowIdParams,
  GridApi,
  GridOptions,
  GridReadyEvent,
  HighlightChangesModule,
  ICellRendererComp,
  ICellRendererParams,
  ModuleRegistry,
  PaginationModule,
  RowModelType,
  RowSelectionModule,
  RowSelectionOptions,
  ValidationModule,
  ValueFormatterParams,
  createGrid,
} from "ag-grid-community";
import { ViewportRowModelModule } from "ag-grid-enterprise";
import { createMockServer } from "./mock-server";
import { createViewportDatasource } from "./viewport-datasource";
ModuleRegistry.registerModules([
  RowSelectionModule,
  PaginationModule,
  CellStyleModule,
  ViewportRowModelModule,
  HighlightChangesModule,
  ValidationModule /* Development Only */,
]);

class RowIndexRenderer implements ICellRendererComp {
  eGui!: HTMLDivElement;
  init(params: ICellRendererParams) {
    this.eGui = document.createElement("div");
    this.eGui.textContent = "" + params.node.rowIndex;
  }
  refresh(params: ICellRendererParams): boolean {
    return false;
  }
  getGui(): HTMLElement {
    return this.eGui;
  }
}

function numberFormatter(params: ValueFormatterParams) {
  if (typeof params.value === "number") {
    return params.value.toFixed(2);
  } else {
    return params.value;
  }
}

const VueExample = defineComponent({
  template: `
        <div style="height: 100%">
                <ag-grid-vue
      style="width: 100%; height: 100%;"
      @grid-ready="onGridReady"
      :columnDefs="columnDefs"
      :defaultColDef="defaultColDef"
      :rowModelType="rowModelType"
      :pagination="true"
      :paginationAutoPageSize="true"
      :viewportRowModelPageSize="viewportRowModelPageSize"
      :viewportRowModelBufferSize="viewportRowModelBufferSize"
      :getRowId="getRowId"
      :rowSelection="rowSelection"
      :rowData="rowData"></ag-grid-vue>
        </div>
    `,
  components: {
    "ag-grid-vue": AgGridVue,
  },
  setup(props) {
    const gridApi = shallowRef<GridApi | null>(null);
    const columnDefs = ref<ColDef[]>([
      // this col shows the row index, doesn't use any data from the row
      {
        headerName: "#",
        maxWidth: 80,
        cellRenderer: RowIndexRenderer,
      },
      { field: "code", maxWidth: 90 },
      { field: "name", minWidth: 220 },
      {
        field: "bid",
        cellClass: "cell-number",
        valueFormatter: numberFormatter,
        cellRenderer: "agAnimateShowChangeCellRenderer",
      },
      {
        field: "mid",
        cellClass: "cell-number",
        valueFormatter: numberFormatter,
        cellRenderer: "agAnimateShowChangeCellRenderer",
      },
      {
        field: "ask",
        cellClass: "cell-number",
        valueFormatter: numberFormatter,
        cellRenderer: "agAnimateShowChangeCellRenderer",
      },
      {
        field: "volume",
        cellClass: "cell-number",
        cellRenderer: "agAnimateSlideCellRenderer",
      },
    ]);
    const defaultColDef = ref<ColDef>({
      flex: 1,
      minWidth: 140,
      sortable: false,
    });
    const rowModelType = ref<RowModelType>("viewport");
    const viewportRowModelPageSize = ref(1);
    const viewportRowModelBufferSize = ref(0);
    const getRowId = ref<GetRowIdFunc>((params: GetRowIdParams) => {
      // the code is unique, so perfect for the id
      return params.data.code;
    });
    const rowSelection = ref<RowSelectionOptions | "single" | "multiple">({
      mode: "multiRow",
      headerCheckbox: false,
    });
    const rowData = ref<any[]>(null);

    const onGridReady = (params: GridReadyEvent) => {
      gridApi.value = params.api;

      const updateData = (data) => {
        // set up a mock server - real code will not do this, it will contact your
        // real server to get what it needs
        const mockServer = createMockServer();
        mockServer.init(data);
        const viewportDatasource = createViewportDatasource(mockServer);
        params.api!.setGridOption("viewportDatasource", viewportDatasource);
      };

      fetch("https://www.ag-grid.com/example-assets/stocks.json")
        .then((resp) => resp.json())
        .then((data) => updateData(data));
    };

    return {
      gridApi,
      columnDefs,
      defaultColDef,
      rowModelType,
      viewportRowModelPageSize,
      viewportRowModelBufferSize,
      getRowId,
      rowSelection,
      rowData,
      onGridReady,
    };
  },
});

createApp(VueExample).mount("#app");
