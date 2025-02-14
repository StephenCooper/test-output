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
  ModuleRegistry,
  PinnedRowModule,
  RowClassParams,
  RowStyle,
  RowStyleModule,
  ValidationModule,
  createGrid,
} from "ag-grid-community";
import CustomPinnedRowRenderer from "./customPinnedRowRendererVue";
import { IOlympicData } from "./interfaces";
ModuleRegistry.registerModules([
  PinnedRowModule,
  RowStyleModule,
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
      :getRowStyle="getRowStyle"
      :pinnedTopRowData="pinnedTopRowData"
      :pinnedBottomRowData="pinnedBottomRowData"
      :rowData="rowData"></ag-grid-vue>
        </div>
    `,
  components: {
    "ag-grid-vue": AgGridVue,
    CustomPinnedRowRenderer,
  },
  setup(props) {
    const gridApi = shallowRef<GridApi<IOlympicData> | null>(null);
    const columnDefs = ref<ColDef[]>([
      {
        field: "athlete",
        cellRendererSelector: (params) => {
          if (params.node.rowPinned) {
            return {
              component: "CustomPinnedRowRenderer",
              params: {
                style: { color: "#5577CC" },
              },
            };
          } else {
            // rows that are not pinned don't use any cell renderer
            return undefined;
          }
        },
      },
      {
        field: "country",
        cellRendererSelector: (params) => {
          if (params.node.rowPinned) {
            return {
              component: "CustomPinnedRowRenderer",
              params: {
                style: { fontStyle: "italic" },
              },
            };
          } else {
            // rows that are not pinned don't use any cell renderer
            return undefined;
          }
        },
      },
      { field: "sport" },
    ]);
    const defaultColDef = ref<ColDef>({
      flex: 1,
    });
    const getRowStyle = ref<(params: RowClassParams) => RowStyle | undefined>(
      (params: RowClassParams): RowStyle | undefined => {
        if (params.node.rowPinned) {
          return { fontWeight: "bold" };
        }
      },
    );
    const pinnedTopRowData = ref<any[]>([
      {
        athlete: "TOP 1 (athlete)",
        country: "TOP 1 (country)",
        sport: "TOP 1 (sport)",
      },
      {
        athlete: "TOP 2 (athlete)",
        country: "TOP 2 (country)",
        sport: "TOP 2 (sport)",
      },
    ]);
    const pinnedBottomRowData = ref<any[]>([
      {
        athlete: "BOTTOM 1 (athlete)",
        country: "BOTTOM 1 (country)",
        sport: "BOTTOM 1 (sport)",
      },
      {
        athlete: "BOTTOM 2 (athlete)",
        country: "BOTTOM 2 (country)",
        sport: "BOTTOM 2 (sport)",
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
      defaultColDef,
      getRowStyle,
      pinnedTopRowData,
      pinnedBottomRowData,
      rowData,
      onGridReady,
    };
  },
});

createApp(VueExample).mount("#app");
