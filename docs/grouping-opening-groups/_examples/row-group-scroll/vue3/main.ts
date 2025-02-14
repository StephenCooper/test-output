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
  NumberEditorModule,
  RowGroupOpenedEvent,
  RowGroupingDisplayType,
  ScrollApiModule,
  TextEditorModule,
  TextFilterModule,
  ValidationModule,
  createGrid,
} from "ag-grid-community";
import { RowGroupingModule } from "ag-grid-enterprise";
import { IOlympicData } from "./interfaces";
ModuleRegistry.registerModules([
  ScrollApiModule,
  NumberEditorModule,
  TextEditorModule,
  TextFilterModule,
  ClientSideRowModelModule,
  RowGroupingModule,
  ValidationModule /* Development Only */,
]);

const VueExample = defineComponent({
  template: `
        <div style="height: 100%">
                <ag-grid-vue
      style="width: 100%; height: 100%;"
      @grid-ready="onGridReady"
      :columnDefs="columnDefs"
      :animateRows="false"
      :groupDisplayType="groupDisplayType"
      :defaultColDef="defaultColDef"
      :rowData="rowData"
      @row-group-opened="onRowGroupOpened"></ag-grid-vue>
        </div>
    `,
  components: {
    "ag-grid-vue": AgGridVue,
  },
  setup(props) {
    const gridApi = shallowRef<GridApi<IOlympicData> | null>(null);
    const columnDefs = ref<ColDef[]>([
      { field: "athlete", width: 150, rowGroupIndex: 0 },
      { field: "age", width: 90, rowGroupIndex: 1 },
      { field: "country", width: 120, rowGroupIndex: 2 },
      { field: "year", width: 90 },
      { field: "date", width: 110, rowGroupIndex: 2 },
    ]);
    const groupDisplayType = ref<RowGroupingDisplayType>("groupRows");
    const defaultColDef = ref<ColDef>({
      editable: true,
      filter: true,
      flex: 1,
      minWidth: 100,
    });
    const rowData = ref<IOlympicData[]>(null);

    function onRowGroupOpened(event: RowGroupOpenedEvent<IOlympicData>) {
      if (event.expanded) {
        const rowNodeIndex = event.node.rowIndex!;
        // factor in child nodes so we can scroll to correct position
        const childCount = event.node.childrenAfterSort
          ? event.node.childrenAfterSort.length
          : 0;
        const newIndex = rowNodeIndex + childCount;
        gridApi.value!.ensureIndexVisible(newIndex);
      }
    }
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
      groupDisplayType,
      defaultColDef,
      rowData,
      onGridReady,
      onRowGroupOpened,
    };
  },
});

createApp(VueExample).mount("#app");
