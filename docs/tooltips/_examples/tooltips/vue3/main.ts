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
  ITooltipParams,
  ModuleRegistry,
  TooltipModule,
  ValidationModule,
} from "ag-grid-community";
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
        headerName: "Athlete",
        field: "athlete",
        // here the Athlete column will tooltip the Country value
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
        headerName: "Hover For Tooltip",
        headerTooltip: "Column Groups can have Tooltips also",
        children: [
          {
            field: "sport",
            tooltipValueGetter: () => "Tooltip text about Sport should go here",
            headerTooltip: "Tooltip for Sport Column Header",
          },
        ],
      },
    ]);
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
      defaultColDef,
      tooltipShowDelay,
      rowData,
      onGridReady,
    };
  },
});

createApp(VueExample).mount("#app");
