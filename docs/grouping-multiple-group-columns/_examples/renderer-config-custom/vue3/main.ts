import {
  createApp,
  defineComponent,
  onBeforeMount,
  ref,
  shallowRef,
} from "vue";
import { AgGridVue } from "ag-grid-vue3";
import {
  CellDoubleClickedEvent,
  CellKeyDownEvent,
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ModuleRegistry,
  RowGroupingDisplayType,
  ValidationModule,
} from "ag-grid-community";
import { RowGroupingModule } from "ag-grid-enterprise";
import CustomGroupCellRenderer from "./customGroupCellRendererVue";
import { IOlympicData } from "./interfaces";
ModuleRegistry.registerModules([
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
      :autoGroupColumnDef="autoGroupColumnDef"
      :defaultColDef="defaultColDef"
      :groupDefaultExpanded="groupDefaultExpanded"
      :groupDisplayType="groupDisplayType"
      :rowData="rowData"
      @cell-double-clicked="onCellDoubleClicked"
      @cell-key-down="onCellKeyDown"></ag-grid-vue>
        </div>
    `,
  components: {
    "ag-grid-vue": AgGridVue,
    CustomGroupCellRenderer,
  },
  setup(props) {
    const gridApi = shallowRef<GridApi<IOlympicData> | null>(null);
    const columnDefs = ref<ColDef[]>([
      {
        field: "country",
        rowGroup: true,
        hide: true,
      },
      {
        field: "year",
        rowGroup: true,
        hide: true,
      },
      {
        field: "athlete",
      },
      {
        field: "total",
        aggFunc: "sum",
      },
    ]);
    const autoGroupColumnDef = ref<ColDef>({
      cellRenderer: "CustomGroupCellRenderer",
    });
    const defaultColDef = ref<ColDef>({
      flex: 1,
      minWidth: 120,
    });
    const groupDefaultExpanded = ref(1);
    const groupDisplayType = ref<RowGroupingDisplayType>("multipleColumns");
    const rowData = ref<IOlympicData[]>(null);

    function onCellDoubleClicked(
      params: CellDoubleClickedEvent<IOlympicData, any>,
    ) {
      if (params.colDef.showRowGroup) {
        params.node.setExpanded(!params.node.expanded);
      }
    }
    function onCellKeyDown(params: CellKeyDownEvent<IOlympicData, any>) {
      if (!("colDef" in params)) {
        return;
      }
      if (!(params.event instanceof KeyboardEvent)) {
        return;
      }
      if (params.event.code !== "Enter") {
        return;
      }
      if (params.colDef.showRowGroup) {
        params.node.setExpanded(!params.node.expanded);
      }
    }
    const onGridReady = (params: GridReadyEvent) => {
      gridApi.value = params.api;

      const updateData = (data) => (rowData.value = data);

      fetch("https://www.ag-grid.com/example-assets/small-olympic-winners.json")
        .then((resp) => resp.json())
        .then((data) => updateData(data));
    };

    return {
      gridApi,
      columnDefs,
      autoGroupColumnDef,
      defaultColDef,
      groupDefaultExpanded,
      groupDisplayType,
      rowData,
      onGridReady,
      onCellDoubleClicked,
      onCellKeyDown,
    };
  },
});

createApp(VueExample).mount("#app");
