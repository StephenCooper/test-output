import {
  createApp,
  defineComponent,
  onBeforeMount,
  ref,
  shallowRef,
} from "vue";
import { AgGridVue } from "ag-grid-vue3";
import {
  CellValueChangedEvent,
  ClientSideRowModelApiModule,
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  EventApiModule,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ModuleRegistry,
  NumberEditorModule,
  NumberFilterModule,
  RowApiModule,
  SideBarDef,
  TextEditorModule,
  TextFilterModule,
  Theme,
  ValidationModule,
  iconOverrides,
  themeQuartz,
} from "ag-grid-community";
import {
  ColumnsToolPanelModule,
  FiltersToolPanelModule,
  SetFilterModule,
} from "ag-grid-enterprise";
import CustomStatsToolPanel from "./customStatsToolPanelVue";
import { IOlympicData } from "./interfaces";
ModuleRegistry.registerModules([
  ClientSideRowModelApiModule,
  NumberEditorModule,
  TextEditorModule,
  NumberFilterModule,
  ClientSideRowModelModule,
  ColumnsToolPanelModule,
  FiltersToolPanelModule,
  SetFilterModule,
  TextFilterModule,
  RowApiModule,
  EventApiModule,
  ValidationModule /* Development Only */,
]);

const VueExample = defineComponent({
  template: `
        <div style="height: 100%">
                <div style="height: 100%; box-sizing: border-box">
      <ag-grid-vue
        style="width: 100%; height: 100%;"
        @grid-ready="onGridReady"
        :columnDefs="columnDefs"
        :theme="theme"
        :defaultColDef="defaultColDef"
        :icons="icons"
        :sideBar="sideBar"
        :rowData="rowData"
        @cell-value-changed="onCellValueChanged"></ag-grid-vue>
      </div>
        </div>
    `,
  components: {
    "ag-grid-vue": AgGridVue,
    CustomStatsToolPanel,
  },
  setup(props) {
    const gridApi = shallowRef<GridApi<IOlympicData> | null>(null);
    const columnDefs = ref<ColDef[]>([
      { field: "athlete", width: 150, filter: "agTextColumnFilter" },
      { field: "age", width: 90 },
      { field: "country", width: 120 },
      { field: "year", width: 90 },
      { field: "date", width: 110 },
      { field: "gold", width: 100, filter: false },
      { field: "silver", width: 100, filter: false },
      { field: "bronze", width: 100, filter: false },
      { field: "total", width: 100, filter: false },
    ]);
    const theme = ref<Theme | "legacy">(
      themeQuartz.withPart(
        iconOverrides({
          type: "image",
          mask: true,
          icons: {
            // map of icon names to images
            "custom-stats": {
              svg: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"><g stroke="#7F8C8D" fill="none" fill-rule="evenodd"><path d="M10.5 6V4.5h-5v.532a1 1 0 0 0 .36.768l1.718 1.432a1 1 0 0 1 0 1.536L5.86 10.2a1 1 0 0 0-.36.768v.532h5V10"/><rect x="1.5" y="1.5" width="13" height="13" rx="2"/></g></svg>',
            },
          },
        }),
      ),
    );
    const defaultColDef = ref<ColDef>({
      editable: true,
      flex: 1,
      minWidth: 100,
      filter: true,
    });
    const icons = ref<{
      [key: string]: ((...args: any[]) => any) | string;
    }>({
      "custom-stats": '<span class="ag-icon ag-icon-custom-stats"></span>',
    });
    const sideBar = ref<SideBarDef | string | string[] | boolean | null>({
      toolPanels: [
        {
          id: "columns",
          labelDefault: "Columns",
          labelKey: "columns",
          iconKey: "columns",
          toolPanel: "agColumnsToolPanel",
        },
        {
          id: "filters",
          labelDefault: "Filters",
          labelKey: "filters",
          iconKey: "filter",
          toolPanel: "agFiltersToolPanel",
        },
        {
          id: "customStats",
          labelDefault: "Custom Stats",
          labelKey: "customStats",
          iconKey: "custom-stats",
          toolPanel: "CustomStatsToolPanel",
          toolPanelParams: {
            title: "Custom Stats",
          },
        },
      ],
      defaultToolPanel: "customStats",
    });
    const rowData = ref<IOlympicData[]>(null);

    function onCellValueChanged(params: CellValueChangedEvent) {
      params.api.refreshClientSideRowModel();
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
      theme,
      defaultColDef,
      icons,
      sideBar,
      rowData,
      onGridReady,
      onCellValueChanged,
    };
  },
});

createApp(VueExample).mount("#app");
