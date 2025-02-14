import {
  createApp,
  defineComponent,
  onBeforeMount,
  ref,
  shallowRef,
} from "vue";
import { AgGridVue } from "ag-grid-vue3";
import "./style.css";
import {
  CellStyleModule,
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
  FiltersToolPanelModule,
} from "ag-grid-enterprise";
import { IOlympicData } from "./interfaces";
ModuleRegistry.registerModules([
  CellStyleModule,
  ClientSideRowModelModule,
  ColumnsToolPanelModule,
  FiltersToolPanelModule,
  ValidationModule /* Development Only */,
]);

const VueExample = defineComponent({
  template: `
        <div style="height: 100%">
                <div class="example-wrapper">
      <div class="legend-bar"><span class="legend-box locked-visible"></span> Locked Visible Column</div>
      <ag-grid-vue
        style="width: 100%; height: 100%;"
        @grid-ready="onGridReady"
        :columnDefs="columnDefs"
        :sideBar="sideBar"
        :defaultColDef="defaultColDef"
        :allowDragFromColumnsToolPanel="true"
        :rowData="rowData"></ag-grid-vue>
      </div>
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
        children: [
          { field: "athlete", width: 150 },
          { field: "age", lockVisible: true, cellClass: "locked-visible" },
          { field: "country", width: 150 },
          { field: "year" },
          { field: "date" },
          { field: "sport" },
        ],
      },
      {
        headerName: "Medals",
        children: [
          { field: "gold", lockVisible: true, cellClass: "locked-visible" },
          { field: "silver", lockVisible: true, cellClass: "locked-visible" },
          { field: "bronze", lockVisible: true, cellClass: "locked-visible" },
          {
            field: "total",
            lockVisible: true,
            cellClass: "locked-visible",
            hide: true,
          },
        ],
      },
    ]);
    const sideBar = ref<SideBarDef | string | string[] | boolean | null>({
      toolPanels: [
        {
          id: "columns",
          labelDefault: "Columns",
          labelKey: "columns",
          iconKey: "columns",
          toolPanel: "agColumnsToolPanel",
          toolPanelParams: {
            suppressRowGroups: true,
            suppressValues: true,
            suppressPivots: true,
            suppressPivotMode: true,
          },
        },
      ],
    });
    const defaultColDef = ref<ColDef>({
      width: 100,
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
      sideBar,
      defaultColDef,
      rowData,
      onGridReady,
    };
  },
});

createApp(VueExample).mount("#app");
