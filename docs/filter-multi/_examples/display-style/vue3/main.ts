import {
  createApp,
  defineComponent,
  onBeforeMount,
  ref,
  shallowRef,
} from "vue";
import { AgGridVue } from "ag-grid-vue3";
import {
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  GridApi,
  GridOptions,
  GridReadyEvent,
  IMultiFilterParams,
  ModuleRegistry,
  SideBarDef,
  TextFilterModule,
  ValidationModule,
} from "ag-grid-community";
import {
  ClipboardModule,
  ColumnMenuModule,
  ContextMenuModule,
  FiltersToolPanelModule,
  MultiFilterModule,
  SetFilterModule,
} from "ag-grid-enterprise";
import { IOlympicData } from "./interfaces";
ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  ClipboardModule,
  FiltersToolPanelModule,
  ColumnMenuModule,
  ContextMenuModule,
  MultiFilterModule,
  SetFilterModule,
  TextFilterModule,
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
      :sideBar="sideBar"
      :rowData="rowData"></ag-grid-vue>
        </div>
    `,
  components: {
    "ag-grid-vue": AgGridVue,
  },
  setup(props) {
    const gridApi = shallowRef<GridApi<IOlympicData> | null>(null);
    const columnDefs = ref<ColDef[]>([
      {
        field: "athlete",
        filter: "agMultiColumnFilter",
        filterParams: {
          filters: [
            {
              filter: "agTextColumnFilter",
              display: "subMenu",
            },
            {
              filter: "agSetColumnFilter",
            },
          ],
        } as IMultiFilterParams,
      },
      {
        field: "country",
        filter: "agMultiColumnFilter",
        filterParams: {
          filters: [
            {
              filter: "agTextColumnFilter",
              display: "accordion",
              title: "Expand Me for Text Filters",
            },
            {
              filter: "agSetColumnFilter",
              display: "accordion",
            },
          ],
        } as IMultiFilterParams,
      },
      {
        field: "sport",
        filter: "agMultiColumnFilter",
      },
    ]);
    const defaultColDef = ref<ColDef>({
      flex: 1,
      minWidth: 200,
      suppressHeaderMenuButton: true,
      suppressHeaderContextMenu: true,
    });
    const sideBar = ref<SideBarDef | string | string[] | boolean | null>({
      toolPanels: [
        {
          id: "filters",
          labelDefault: "Filters",
          labelKey: "filters",
          iconKey: "filter",
          toolPanel: "agFiltersToolPanel",
        },
      ],
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
      sideBar,
      rowData,
      onGridReady,
    };
  },
});

createApp(VueExample).mount("#app");
