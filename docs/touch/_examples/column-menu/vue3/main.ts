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
  NumberFilterModule,
  TextFilterModule,
  ValidationModule,
} from "ag-grid-community";
import {
  ColumnMenuModule,
  ColumnsToolPanelModule,
  ContextMenuModule,
} from "ag-grid-enterprise";
import { IOlympicData } from "./interfaces";
ModuleRegistry.registerModules([
  TextFilterModule,
  NumberFilterModule,
  ClientSideRowModelModule,
  ColumnsToolPanelModule,
  ColumnMenuModule,
  ContextMenuModule,
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
      :suppressMenuHide="true"
      :columnMenu="columnMenu"
      :rowData="rowData"></ag-grid-vue>
        </div>
    `,
  components: {
    "ag-grid-vue": AgGridVue,
  },
  setup(props) {
    const gridApi = shallowRef<GridApi<IOlympicData> | null>(null);
    const columnDefs = ref<ColDef[]>([
      { field: "athlete", minWidth: 200 },
      { field: "age" },
      { field: "country", minWidth: 200 },
      { field: "year" },
      { field: "sport" },
      { field: "gold" },
      { field: "silver" },
      { field: "bronze" },
    ]);
    const defaultColDef = ref<ColDef>({
      minWidth: 100,
      filter: true,
    });
    const columnMenu = ref<"legacy" | "new">("legacy");
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
      columnMenu,
      rowData,
      onGridReady,
    };
  },
});

createApp(VueExample).mount("#app");
