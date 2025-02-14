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
  ModuleRegistry,
  TooltipModule,
  ValidationModule,
  createGrid,
} from "ag-grid-community";
import {
  ColumnMenuModule,
  ColumnsToolPanelModule,
  ContextMenuModule,
  RowGroupingModule,
  SetFilterModule,
} from "ag-grid-enterprise";
import { IOlympicData } from "./interfaces";
ModuleRegistry.registerModules([
  TooltipModule,
  ClientSideRowModelModule,
  ColumnsToolPanelModule,
  ColumnMenuModule,
  ContextMenuModule,
  RowGroupingModule,
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
      :autoGroupColumnDef="autoGroupColumnDef"
      :defaultColDef="defaultColDef"
      :tooltipShowDelay="tooltipShowDelay"
      :rowData="rowData"></ag-grid-vue>
        </div>
    `,
  components: {
    "ag-grid-vue": AgGridVue,
  },
  setup(props) {
    const gridApi = shallowRef<GridApi<IOlympicData> | null>(null);
    const columnDefs = ref<ColDef[]>([
      { field: "country", width: 120, rowGroup: true, hide: true },
      { field: "year", width: 90, rowGroup: true, hide: true },
      { field: "athlete", width: 200 },
      { field: "age", width: 90 },
      { field: "sport", width: 110 },
    ]);
    const autoGroupColumnDef = ref<ColDef>({
      headerTooltip: "Group",
      minWidth: 190,
      tooltipValueGetter: (params) => {
        const count = params.node && params.node.allChildrenCount;
        if (count != null) {
          return "Tooltip text - " + params.value + " (" + count + ")";
        }
        return params.value;
      },
    });
    const defaultColDef = ref<ColDef>({
      flex: 1,
      minWidth: 100,
    });
    const tooltipShowDelay = ref(500);
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
      autoGroupColumnDef,
      defaultColDef,
      tooltipShowDelay,
      rowData,
      onGridReady,
    };
  },
});

createApp(VueExample).mount("#app");
