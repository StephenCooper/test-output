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
  ValidationModule,
} from "ag-grid-community";
import {
  ColumnMenuModule,
  ColumnsToolPanelModule,
  ContextMenuModule,
} from "ag-grid-enterprise";
import { IOlympicData } from "./interfaces";
ModuleRegistry.registerModules([
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
        groupId: "athleteGroupId",
        headerName: "Athlete",
        children: [
          {
            headerName: "Name",
            field: "athlete",
            minWidth: 200,
            columnChooserParams: {
              // hides the Column Filter section
              suppressColumnFilter: true,
              // hides the Select / Un-select all widget
              suppressColumnSelectAll: true,
              // hides the Expand / Collapse all widget
              suppressColumnExpandAll: true,
            },
          },
          {
            field: "age",
            minWidth: 200,
            columnChooserParams: {
              // contracts all column groups
              contractColumnSelection: true,
            },
          },
        ],
      },
      {
        groupId: "medalsGroupId",
        headerName: "Medals",
        children: [{ field: "gold" }, { field: "silver" }, { field: "bronze" }],
      },
    ]);
    const defaultColDef = ref<ColDef>({
      flex: 1,
      columnChooserParams: {
        // suppresses updating the layout of columns as they are rearranged in the grid
        suppressSyncLayoutWithGrid: true,
      },
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
      rowData,
      onGridReady,
    };
  },
});

createApp(VueExample).mount("#app");
