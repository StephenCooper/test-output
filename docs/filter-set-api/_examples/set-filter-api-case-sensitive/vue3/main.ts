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
  ICellRendererParams,
  ISetFilter,
  ISetFilterParams,
  ModuleRegistry,
  SideBarDef,
  ValidationModule,
} from "ag-grid-community";
import {
  ColumnMenuModule,
  ContextMenuModule,
  FiltersToolPanelModule,
  SetFilterModule,
} from "ag-grid-enterprise";
import { getData } from "./data";
ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  FiltersToolPanelModule,
  ColumnMenuModule,
  ContextMenuModule,
  SetFilterModule,
  ValidationModule /* Development Only */,
]);

const FIXED_STYLES =
  "vertical-align: middle; border: 1px solid black; margin: 3px; display: inline-block; width: 10px; height: 10px";

const FILTER_TYPES: Record<string, string> = {
  insensitive: "colour",
  sensitive: "colour_1",
};

function colourCellRenderer(params: ICellRendererParams) {
  if (!params.value || params.value === "(Select All)") {
    return params.value;
  }
  return `<div style="background-color: ${params.value.toLowerCase()}; ${FIXED_STYLES}"></div>${params.value}`;
}

var MANGLED_COLOURS = ["ReD", "OrAnGe", "WhItE", "YeLlOw"];

const VueExample = defineComponent({
  template: `
        <div style="height: 100%">
                <div class="example-wrapper">
      <div class="example-header">
        <div>
          Case Insensitive:
          <button v-on:click="setModel('insensitive')">API: setModel() - mismatching case</button>
          <button v-on:click="getModel('insensitive')">API: getModel()</button>
          <button v-on:click="setFilterValues('insensitive')">API: setFilterValues() - mismatching case</button>
          <button v-on:click="getValues('insensitive')">API: getFilterValues()</button>
          <button v-on:click="reset('insensitive')">Reset</button>
        </div>
        <div style="padding-top: 10px">
          Case Sensitive:
          <button v-on:click="setModel('sensitive')">API: setModel() - mismatching case</button>
          <button v-on:click="getModel('sensitive')">API: getModel()</button>
          <button v-on:click="setFilterValues('sensitive')">API: setFilterValues() - mismatching case</button>
          <button v-on:click="getValues('sensitive')">API: getFilterValues()</button>
          <button v-on:click="reset('sensitive')">Reset</button>
        </div>
      </div>
      <ag-grid-vue
        style="width: 100%; height: 100%;"
        @grid-ready="onGridReady"
        :columnDefs="columnDefs"
        :defaultColDef="defaultColDef"
        :sideBar="sideBar"
        :rowData="rowData"
        @first-data-rendered="onFirstDataRendered"></ag-grid-vue>
      </div>
        </div>
    `,
  components: {
    "ag-grid-vue": AgGridVue,
  },
  setup(props) {
    const gridApi = shallowRef<GridApi | null>(null);
    const columnDefs = ref<ColDef[]>([
      {
        headerName: "Case Insensitive (default)",
        field: "colour",
        filter: "agSetColumnFilter",
        filterParams: {
          caseSensitive: false,
          cellRenderer: colourCellRenderer,
        } as ISetFilterParams,
      },
      {
        headerName: "Case Sensitive",
        field: "colour",
        filter: "agSetColumnFilter",
        filterParams: {
          caseSensitive: true,
          cellRenderer: colourCellRenderer,
        } as ISetFilterParams,
      },
    ]);
    const defaultColDef = ref<ColDef>({
      flex: 1,
      minWidth: 225,
      cellRenderer: colourCellRenderer,
      floatingFilter: true,
    });
    const sideBar = ref<SideBarDef | string | string[] | boolean | null>(
      "filters",
    );
    const rowData = ref<any[] | null>(getData());

    function onFirstDataRendered(params: FirstDataRenderedEvent) {
      params.api.getToolPanelInstance("filters")!.expandFilters();
    }
    function setModel(type: string) {
      gridApi
        .value!.setColumnFilterModel(FILTER_TYPES[type], {
          values: MANGLED_COLOURS,
        })
        .then(() => {
          gridApi.value!.onFilterChanged();
        });
    }
    function getModel(type: string) {
      alert(
        JSON.stringify(
          gridApi.value!.getColumnFilterModel(FILTER_TYPES[type]),
          null,
          2,
        ),
      );
    }
    function setFilterValues(type: string) {
      gridApi
        .value!.getColumnFilterInstance<ISetFilter>(FILTER_TYPES[type])
        .then((instance) => {
          instance!.setFilterValues(MANGLED_COLOURS);
          instance!.applyModel();
          gridApi.value!.onFilterChanged();
        });
    }
    function getValues(type: string) {
      gridApi
        .value!.getColumnFilterInstance<ISetFilter>(FILTER_TYPES[type])
        .then((instance) => {
          alert(JSON.stringify(instance!.getFilterValues(), null, 2));
        });
    }
    function reset(type: string) {
      gridApi
        .value!.getColumnFilterInstance<ISetFilter>(FILTER_TYPES[type])
        .then((instance) => {
          instance!.resetFilterValues();
          instance!.setModel(null).then(() => {
            gridApi.value!.onFilterChanged();
          });
        });
    }
    const onGridReady = (params: GridReadyEvent) => {
      gridApi.value = params.api;
    };

    return {
      gridApi,
      columnDefs,
      defaultColDef,
      sideBar,
      rowData,
      onGridReady,
      onFirstDataRendered,
      setModel,
      getModel,
      setFilterValues,
      getValues,
      reset,
    };
  },
});

createApp(VueExample).mount("#app");
