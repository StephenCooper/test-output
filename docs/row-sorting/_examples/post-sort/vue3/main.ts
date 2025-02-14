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
  PostSortRowsParams,
  ValidationModule,
  createGrid,
} from "ag-grid-community";
import { IOlympicData } from "./interfaces";
ModuleRegistry.registerModules([
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
      :postSortRows="postSortRows"
      :rowData="rowData"></ag-grid-vue>
        </div>
    `,
  components: {
    "ag-grid-vue": AgGridVue,
  },
  setup(props) {
    const gridApi = shallowRef<GridApi<IOlympicData> | null>(null);
    const columnDefs = ref<ColDef[]>([
      { field: "athlete" },
      { field: "age", width: 100 },
      { field: "country", sort: "asc" },
      { field: "year" },
      { field: "date" },
      { field: "sport" },
      { field: "gold" },
      { field: "silver" },
      { field: "bronze" },
      { field: "total" },
    ]);
    const defaultColDef = ref<ColDef>({
      width: 170,
    });
    const postSortRows = ref<(params: PostSortRowsParams) => void>(
      (params: PostSortRowsParams<IOlympicData>) => {
        const rowNodes = params.nodes;
        // here we put Ireland rows on top while preserving the sort order
        let nextInsertPos = 0;
        for (let i = 0; i < rowNodes.length; i++) {
          const country = rowNodes[i].data
            ? rowNodes[i].data!.country
            : undefined;
          if (country === "Ireland") {
            rowNodes.splice(nextInsertPos, 0, rowNodes.splice(i, 1)[0]);
            nextInsertPos++;
          }
        }
      },
    );
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
      postSortRows,
      rowData,
      onGridReady,
    };
  },
});

createApp(VueExample).mount("#app");
