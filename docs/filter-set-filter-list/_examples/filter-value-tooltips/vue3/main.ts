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
  GridApi,
  GridOptions,
  GridReadyEvent,
  ISetFilterParams,
  ModuleRegistry,
  SideBarDef,
  TooltipModule,
  ValidationModule,
  createGrid,
} from "ag-grid-community";
import {
  ColumnMenuModule,
  ColumnsToolPanelModule,
  ContextMenuModule,
  FiltersToolPanelModule,
  SetFilterModule,
} from "ag-grid-enterprise";
import { CustomTooltip } from "./customTooltip";
import { getData } from "./data";
ModuleRegistry.registerModules([
  TooltipModule,
  ClientSideRowModelModule,
  ColumnsToolPanelModule,
  FiltersToolPanelModule,
  ColumnMenuModule,
  ContextMenuModule,
  SetFilterModule,
  ValidationModule /* Development Only */,
]);

const VueExample = defineComponent({
  template: `
        <div style="height: 100%">
                <ag-grid-vue
      style="width: 100%; height: 100%;"
      @grid-ready="onGridReady"
      :columnDefs="columnDefs"
      :sideBar="sideBar"
      :defaultColDef="defaultColDef"
      :tooltipShowDelay="tooltipShowDelay"
      :rowData="rowData"></ag-grid-vue>
        </div>
    `,
  components: {
    "ag-grid-vue": AgGridVue,
  },
  setup(props) {
    const gridApi = shallowRef<GridApi | null>(null);
    const columnDefs = ref<ColDef[]>([
      {
        field: "colA",
        tooltipField: "colA",
        filter: "agSetColumnFilter",
      },
      {
        field: "colB",
        tooltipField: "colB",
        filter: "agSetColumnFilter",
        filterParams: {
          showTooltips: true,
        } as ISetFilterParams,
      },
      {
        field: "colC",
        tooltipField: "colC",
        tooltipComponent: CustomTooltip,
        filter: "agSetColumnFilter",
        filterParams: {
          showTooltips: true,
        } as ISetFilterParams,
      },
    ]);
    const sideBar = ref<SideBarDef | string | string[] | boolean | null>(
      "filters",
    );
    const defaultColDef = ref<ColDef>({
      flex: 1,
    });
    const tooltipShowDelay = ref(100);
    const rowData = ref<any[] | null>(getData());

    const onGridReady = (params: GridReadyEvent) => {
      gridApi.value = params.api;
    };

    return {
      gridApi,
      columnDefs,
      sideBar,
      defaultColDef,
      tooltipShowDelay,
      rowData,
      onGridReady,
    };
  },
});

createApp(VueExample).mount("#app");
