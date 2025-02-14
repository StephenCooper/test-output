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
        headerName: "Name & Country",
        headerTooltip: "Name & Country Group",
        children: [{ field: "athlete" }, { field: "country" }],
      },
      {
        headerName: "Sports Results",
        headerTooltip: "Sports Results Group",
        children: [
          { columnGroupShow: "closed", field: "total" },
          { columnGroupShow: "open", field: "gold" },
          { columnGroupShow: "open", field: "silver" },
          { columnGroupShow: "open", field: "bronze" },
        ],
      },
    ]);
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
      rowData,
      onGridReady,
    };
  },
});

createApp(VueExample).mount("#app");
