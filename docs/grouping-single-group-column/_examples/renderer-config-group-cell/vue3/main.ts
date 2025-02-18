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
  RowGroupingDisplayType,
  RowSelectionModule,
  RowSelectionOptions,
  ValidationModule,
} from "ag-grid-community";
import { RowGroupingModule } from "ag-grid-enterprise";
import CustomMedalCellRenderer from "./customMedalCellRendererVue";
import { IOlympicData } from "./interfaces";
ModuleRegistry.registerModules([
  RowSelectionModule,
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
      :defaultColDef="defaultColDef"
      :autoGroupColumnDef="autoGroupColumnDef"
      :groupDisplayType="groupDisplayType"
      :rowSelection="rowSelection"
      :rowData="rowData"></ag-grid-vue>
        </div>
    `,
  components: {
    "ag-grid-vue": AgGridVue,
    CustomMedalCellRenderer,
  },
  setup(props) {
    const gridApi = shallowRef<GridApi<IOlympicData> | null>(null);
    const columnDefs = ref<ColDef[]>([
      {
        field: "total",
        rowGroup: true,
        cellRenderer: "CustomMedalCellRenderer",
      },
      { field: "year" },
      { field: "athlete" },
      { field: "sport" },
    ]);
    const defaultColDef = ref<ColDef>({
      flex: 1,
      minWidth: 100,
    });
    const autoGroupColumnDef = ref<ColDef>({
      headerName: "Gold Medals",
      minWidth: 240,
      cellRendererParams: {
        suppressCount: true,
      },
    });
    const groupDisplayType = ref<RowGroupingDisplayType>("singleColumn");
    const rowSelection = ref<RowSelectionOptions | "single" | "multiple">({
      mode: "singleRow",
      checkboxLocation: "autoGroupColumn",
    });
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
      autoGroupColumnDef,
      groupDisplayType,
      rowSelection,
      rowData,
      onGridReady,
    };
  },
});

createApp(VueExample).mount("#app");
