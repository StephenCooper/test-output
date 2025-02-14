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
  ITooltipParams,
  ModuleRegistry,
  TooltipModule,
  ValidationModule,
  createGrid,
} from "ag-grid-community";
import CustomTooltip from "./customTooltipVue";
import { IOlympicData } from "./interfaces";
ModuleRegistry.registerModules([
  TooltipModule,
  ClientSideRowModelModule,
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
      :tooltipShowDelay="tooltipShowDelay"
      :tooltipHideDelay="tooltipHideDelay"
      :rowData="rowData"></ag-grid-vue>
        </div>
    `,
  components: {
    "ag-grid-vue": AgGridVue,
    CustomTooltip,
  },
  setup(props) {
    const gridApi = shallowRef<GridApi<IOlympicData> | null>(null);
    const columnDefs = ref<ColDef[]>([
      {
        headerName: "Athlete",
        field: "athlete",
        tooltipComponentParams: { color: "#55AA77" },
        tooltipField: "country",
        headerTooltip: "Tooltip for Athlete Column Header",
      },
      {
        field: "age",
        tooltipValueGetter: (p: ITooltipParams) =>
          "Create any fixed message, e.g. This is the Athlete’s Age ",
        headerTooltip: "Tooltip for Age Column Header",
      },
      {
        field: "year",
        tooltipValueGetter: (p: ITooltipParams) =>
          "This is a dynamic tooltip using the value of " + p.value,
        headerTooltip: "Tooltip for Year Column Header",
      },
      {
        field: "sport",
        tooltipValueGetter: () => "Tooltip text about Sport should go here",
        headerTooltip: "Tooltip for Sport Column Header",
      },
    ]);
    const defaultColDef = ref<ColDef>({
      flex: 1,
      minWidth: 100,
      tooltipComponent: "CustomTooltip",
    });
    const tooltipShowDelay = ref(0);
    const tooltipHideDelay = ref(2000);
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
      tooltipShowDelay,
      tooltipHideDelay,
      rowData,
      onGridReady,
    };
  },
});

createApp(VueExample).mount("#app");
