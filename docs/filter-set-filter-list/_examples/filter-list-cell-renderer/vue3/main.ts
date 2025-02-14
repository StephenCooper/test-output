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
  FirstDataRenderedEvent,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ISetFilterParams,
  ModuleRegistry,
  SideBarDef,
  ValidationModule,
} from "ag-grid-community";
import {
  ColumnMenuModule,
  ColumnsToolPanelModule,
  ContextMenuModule,
  FiltersToolPanelModule,
  SetFilterModule,
} from "ag-grid-enterprise";
import CountryCellRenderer from "./countryCellRendererVue";
import { IOlympicData } from "./interfaces";
ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  ColumnsToolPanelModule,
  FiltersToolPanelModule,
  ColumnMenuModule,
  ContextMenuModule,
  SetFilterModule,
  ValidationModule /* Development Only */,
]);

const COUNTRY_CODES: Record<string, string> = {
  Ireland: "ie",
  Luxembourg: "lu",
  Belgium: "be",
  Spain: "es",
  France: "fr",
  Germany: "de",
  Sweden: "se",
  Italy: "it",
  Greece: "gr",
  Iceland: "is",
  Portugal: "pt",
  Malta: "mt",
  Norway: "no",
  Brazil: "br",
  Argentina: "ar",
  Colombia: "co",
  Peru: "pe",
  Venezuela: "ve",
  Uruguay: "uy",
};

const VueExample = defineComponent({
  template: `
        <div style="height: 100%">
                <div class="example-wrapper">
      <div style="margin-bottom: 5px">
        <button v-on:click="printFilterModel()">Print Filter Model</button>
      </div>
      <ag-grid-vue
        style="width: 100%; height: 100%;"
        @grid-ready="onGridReady"
        :columnDefs="columnDefs"
        :context="context"
        :defaultColDef="defaultColDef"
        :sideBar="sideBar"
        :rowData="rowData"
        @first-data-rendered="onFirstDataRendered"></ag-grid-vue>
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
        headerName: "No Cell Renderer",
        field: "country",
        cellRenderer: "CountryCellRenderer",
        filter: "agSetColumnFilter",
        filterParams: {
          // no cell renderer!
        },
      },
      {
        headerName: "With Cell Renderers",
        field: "country",
        cellRenderer: "CountryCellRenderer",
        filter: "agSetColumnFilter",
        filterParams: {
          cellRenderer: "CountryCellRenderer",
          cellRendererParams: { isFilterRenderer: true },
        } as ISetFilterParams,
      },
    ]);
    const context = ref({
      COUNTRY_CODES: COUNTRY_CODES,
    });
    const defaultColDef = ref<ColDef>({
      flex: 1,
      minWidth: 225,
      floatingFilter: true,
    });
    const sideBar = ref<SideBarDef | string | string[] | boolean | null>(
      "filters",
    );
    const rowData = ref<IOlympicData[]>(null);

    function onFirstDataRendered(params: FirstDataRenderedEvent) {
      params.api.getToolPanelInstance("filters")!.expandFilters();
    }
    function printFilterModel() {
      const filterModel = gridApi.value!.getFilterModel();
      console.log(filterModel);
    }
    const onGridReady = (params: GridReadyEvent) => {
      gridApi.value = params.api;

      const updateData = (data) => {
        // only return data that has corresponding country codes
        const dataWithFlags = data.filter(function (d: any) {
          return COUNTRY_CODES[d.country];
        });
        // Empty data used to demonstrate custom (Blanks) handling in filter cell renderer
        dataWithFlags[0].country = "";
        rowData.value = dataWithFlags;
      };

      fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
        .then((resp) => resp.json())
        .then((data) => updateData(data));
    };

    return {
      gridApi,
      columnDefs,
      context,
      defaultColDef,
      sideBar,
      rowData,
      onGridReady,
      onFirstDataRendered,
      printFilterModel,
    };
  },
});

createApp(VueExample).mount("#app");
