import {
  createApp,
  defineComponent,
  onBeforeMount,
  ref,
  shallowRef,
} from "vue";
import { AgGridVue } from "ag-grid-vue3";
import {
  ClientSideRowModelApiModule,
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ModuleRegistry,
  NumberFilterModule,
  RowDragCallbackParams,
  RowDragEndEvent,
  RowDragModule,
  ValidationModule,
} from "ag-grid-community";
import {
  ColumnMenuModule,
  ColumnsToolPanelModule,
  ContextMenuModule,
  RowGroupingModule,
  SetFilterModule,
} from "ag-grid-enterprise";
import { getData } from "./data";
ModuleRegistry.registerModules([
  RowDragModule,
  ClientSideRowModelApiModule,
  NumberFilterModule,
  ClientSideRowModelModule,
  ColumnsToolPanelModule,
  ColumnMenuModule,
  ContextMenuModule,
  RowGroupingModule,
  SetFilterModule,
  ValidationModule /* Development Only */,
]);

const rowDrag = function (params: RowDragCallbackParams) {
  // only rows that are NOT groups should be draggable
  return !params.node.group;
};

const VueExample = defineComponent({
  template: `
        <div style="height: 100%">
                <ag-grid-vue
      style="width: 100%; height: 100%;"
      @grid-ready="onGridReady"
      :columnDefs="columnDefs"
      :defaultColDef="defaultColDef"
      :groupDefaultExpanded="groupDefaultExpanded"
      :rowData="rowData"
      @row-drag-move="onRowDragMove"></ag-grid-vue>
        </div>
    `,
  components: {
    "ag-grid-vue": AgGridVue,
  },
  setup(props) {
    const gridApi = shallowRef<GridApi | null>(null);
    const columnDefs = ref<ColDef[]>([
      { field: "athlete", rowDrag: rowDrag },
      { field: "country", rowGroup: true },
      { field: "year", width: 100 },
      { field: "date" },
      { field: "sport" },
      { field: "gold" },
      { field: "silver" },
      { field: "bronze" },
    ]);
    const defaultColDef = ref<ColDef>({
      width: 170,
      filter: true,
    });
    const groupDefaultExpanded = ref(1);
    const rowData = ref<any[]>(null);

    function onRowDragMove(event: RowDragEndEvent) {
      const movingNode = event.node!;
      const overNode = event.overNode!;
      // find out what country group we are hovering over
      let groupCountry;
      if (overNode.group) {
        // if over a group, we take the group key (which will be the
        // country as we are grouping by country)
        groupCountry = overNode.key;
      } else {
        // if over a non-group, we take the country directly
        groupCountry = overNode.data.country;
      }
      const needToChangeParent = movingNode.data.country !== groupCountry;
      if (needToChangeParent) {
        const movingData = movingNode.data;
        movingData.country = groupCountry;
        gridApi.value!.applyTransaction({
          update: [movingData],
        });
        gridApi.value!.clearFocusedCell();
      }
    }
    const onGridReady = (params: GridReadyEvent) => {
      gridApi.value = params.api;

      params.api.setGridOption("rowData", getData());
    };

    return {
      gridApi,
      columnDefs,
      defaultColDef,
      groupDefaultExpanded,
      rowData,
      onGridReady,
      onRowDragMove,
    };
  },
});

createApp(VueExample).mount("#app");
