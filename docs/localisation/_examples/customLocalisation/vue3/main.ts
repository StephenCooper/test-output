import { AG_GRID_LOCALE_DE } from "@ag-grid-community/locale";
import {
  createApp,
  defineComponent,
  onBeforeMount,
  ref,
  shallowRef,
} from "vue";
import { AgGridVue } from "ag-grid-vue3";
import { AgChartsEnterpriseModule } from "ag-charts-enterprise";
import {
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  CsvExportModule,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ICellRendererComp,
  ICellRendererParams,
  LocaleModule,
  ModuleRegistry,
  NumberEditorModule,
  NumberFilterModule,
  PaginationModule,
  RowSelectionModule,
  RowSelectionOptions,
  SideBarDef,
  StatusPanelDef,
  TextEditorModule,
  TextFilterModule,
  ValidationModule,
  createGrid,
} from "ag-grid-community";
import {
  CellSelectionModule,
  ClipboardModule,
  ColumnMenuModule,
  ColumnsToolPanelModule,
  ContextMenuModule,
  ExcelExportModule,
  FiltersToolPanelModule,
  IntegratedChartsModule,
  MultiFilterModule,
  PivotModule,
  RowGroupingPanelModule,
  SetFilterModule,
  SideBarModule,
  StatusBarModule,
} from "ag-grid-enterprise";
import { zzzLocale } from "./locale";
import { IOlympicData } from "./interfaces";
ModuleRegistry.registerModules([
  NumberEditorModule,
  TextEditorModule,
  RowSelectionModule,
  LocaleModule,
  PaginationModule,
  ClientSideRowModelModule,
  ClipboardModule,
  ColumnsToolPanelModule,
  CsvExportModule,
  ExcelExportModule,
  FiltersToolPanelModule,
  ColumnMenuModule,
  ContextMenuModule,
  MultiFilterModule,
  CellSelectionModule,
  PivotModule,
  SetFilterModule,
  SideBarModule,
  StatusBarModule,
  RowGroupingPanelModule,
  TextFilterModule,
  NumberFilterModule,
  IntegratedChartsModule.with(AgChartsEnterpriseModule),
  ValidationModule /* Development Only */,
]);

class NodeIdRenderer implements ICellRendererComp {
  eGui!: HTMLElement;

  init(params: ICellRendererParams) {
    this.eGui = document.createElement("div");
    this.eGui.textContent = params.node!.id! + 1;
  }

  getGui() {
    return this.eGui;
  }

  refresh(params: ICellRendererParams): boolean {
    return false;
  }
}

// Create a dummy locale based on english but prefix everything with zzz
const AG_GRID_LOCALE_ZZZ: Record<string, string> = zzzLocale(AG_GRID_LOCALE_DE);

const VueExample = defineComponent({
  template: `
        <div style="height: 100%">
                <ag-grid-vue
      style="width: 100%; height: 100%;"
      @grid-ready="onGridReady"
      :columnDefs="columnDefs"
      :defaultColDef="defaultColDef"
      :sideBar="true"
      :statusBar="statusBar"
      :rowGroupPanelShow="rowGroupPanelShow"
      :pagination="true"
      :paginationPageSize="paginationPageSize"
      :paginationPageSizeSelector="paginationPageSizeSelector"
      :enableCharts="true"
      :localeText="localeText"
      :rowSelection="rowSelection"
      :rowData="rowData"></ag-grid-vue>
        </div>
    `,
  components: {
    "ag-grid-vue": AgGridVue,
  },
  setup(props) {
    const gridApi = shallowRef<GridApi<IOlympicData> | null>(null);
    const columnDefs = ref<ColDef[]>([
      // this row just shows the row index, doesn't use any data from the row
      {
        headerName: "#",
        cellRenderer: NodeIdRenderer,
      },
      {
        field: "athlete",
        filterParams: { buttons: ["clear", "reset", "apply"] },
      },
      {
        field: "age",
        filterParams: { buttons: ["apply", "cancel"] },
        enablePivot: true,
      },
      { field: "country", enableRowGroup: true },
      { field: "year", filter: "agNumberColumnFilter" },
      { field: "date" },
      {
        field: "sport",
        filter: "agMultiColumnFilter",
        filterParams: {
          filters: [
            {
              filter: "agTextColumnFilter",
              display: "accordion",
            },
            {
              filter: "agSetColumnFilter",
              display: "accordion",
            },
          ],
        },
      },
      { field: "gold", enableValue: true },
      { field: "silver", enableValue: true },
      { field: "bronze", enableValue: true },
      { field: "total", enableValue: true },
    ]);
    const defaultColDef = ref<ColDef>({
      editable: true,
      flex: 1,
      minWidth: 100,
      filter: true,
    });
    const statusBar = ref<{
      statusPanels: StatusPanelDef[];
    }>({
      statusPanels: [
        { statusPanel: "agTotalAndFilteredRowCountComponent", align: "left" },
        { statusPanel: "agAggregationComponent" },
      ],
    });
    const rowGroupPanelShow = ref<"always" | "onlyWhenGrouping" | "never">(
      "always",
    );
    const paginationPageSize = ref(500);
    const paginationPageSizeSelector = ref<number[] | boolean>([
      100, 500, 1000,
    ]);
    const localeText = ref<{
      [key: string]: string;
    }>(AG_GRID_LOCALE_ZZZ);
    const rowSelection = ref<RowSelectionOptions | "single" | "multiple">({
      mode: "multiRow",
    });
    const rowData = ref<IOlympicData[]>(null);

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
      statusBar,
      rowGroupPanelShow,
      paginationPageSize,
      paginationPageSizeSelector,
      localeText,
      rowSelection,
      rowData,
      onGridReady,
    };
  },
});

createApp(VueExample).mount("#app");
