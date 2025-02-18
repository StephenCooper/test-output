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
  SideBarDef,
  ValidationModule,
} from "ag-grid-community";
import {
  ColumnsToolPanelModule,
  PivotModule,
  RowGroupingPanelModule,
  SideBarModule,
} from "ag-grid-enterprise";
import { IOlympicData } from "./interfaces";
ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  PivotModule,
  SideBarModule,
  ColumnsToolPanelModule,
  RowGroupingPanelModule,
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
      :pivotMode="true"
      :pivotPanelShow="pivotPanelShow"
      :sideBar="sideBar"
      :rowData="rowData"></ag-grid-vue>
        </div>
    `,
  components: {
    "ag-grid-vue": AgGridVue,
  },
  setup(props) {
    const gridApi = shallowRef<GridApi<IOlympicData> | null>(null);
    const columnDefs = ref<ColDef[]>([
      { field: "country", rowGroup: true, enableRowGroup: true },
      { field: "sport", pivot: true, enablePivot: true },
      { field: "year", pivot: true, enablePivot: true },
      { field: "gold", aggFunc: "sum", enableValue: true },
    ]);
    const defaultColDef = ref<ColDef>({
      flex: 1,
      minWidth: 130,
    });
    const autoGroupColumnDef = ref<ColDef>({
      minWidth: 200,
    });
    const pivotPanelShow = ref<"always" | "onlyWhenPivoting" | "never">(
      "onlyWhenPivoting",
    );
    const sideBar = ref<SideBarDef | string | string[] | boolean | null>({
      defaultToolPanel: "columns",
      toolPanels: [
        {
          id: "columns",
          labelDefault: "Columns",
          labelKey: "columns",
          iconKey: "columns",
          toolPanel: "agColumnsToolPanel",
          toolPanelParams: {
            suppressPivots: true,
            suppressPivotMode: true,
          },
        },
      ],
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
      pivotPanelShow,
      sideBar,
      rowData,
      onGridReady,
    };
  },
});

createApp(VueExample).mount("#app");
