import {
  createApp,
  defineComponent,
  onBeforeMount,
  ref,
  shallowRef,
} from "vue";
import { AgGridVue } from "ag-grid-vue3";
import {
  CellEditingStartedEvent,
  CellEditingStoppedEvent,
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ICellRendererParams,
  ModuleRegistry,
  RowEditingStartedEvent,
  RowEditingStoppedEvent,
  ValidationModule,
  createGrid,
} from "ag-grid-community";
import GenderRenderer from "./genderRendererVue";
import MoodRenderer from "./moodRendererVue";
ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  ValidationModule /* Development Only */,
]);

interface IRow {
  value: number | string;
  type: "age" | "gender" | "mood";
}

const VueExample = defineComponent({
  template: `
        <div style="height: 100%">
                <ag-grid-vue
      style="width: 100%; height: 100%;"
      @grid-ready="onGridReady"
      :rowData="rowData"
      :columnDefs="columnDefs"
      :defaultColDef="defaultColDef"
      @row-editing-started="onRowEditingStarted"
      @row-editing-stopped="onRowEditingStopped"
      @cell-editing-started="onCellEditingStarted"
      @cell-editing-stopped="onCellEditingStopped"></ag-grid-vue>
        </div>
    `,
  components: {
    "ag-grid-vue": AgGridVue,
    GenderRenderer,
    MoodRenderer,
  },
  setup(props) {
    const gridApi = shallowRef<GridApi<IRow> | null>(null);
    const rowData = ref<IRow[] | null>([
      { value: 14, type: "age" },
      { value: "Female", type: "gender" },
      { value: "Happy", type: "mood" },
      { value: 21, type: "age" },
      { value: "Male", type: "gender" },
      { value: "Sad", type: "mood" },
    ]);
    const columnDefs = ref<ColDef[]>([
      { field: "value" },
      {
        headerName: "Rendered Value",
        field: "value",
        cellRendererSelector: (params: ICellRendererParams<IRow>) => {
          const moodDetails = {
            component: "MoodRenderer",
          };
          const genderDetails = {
            component: "GenderRenderer",
            params: { values: ["Male", "Female"] },
          };
          if (params.data) {
            if (params.data.type === "gender") return genderDetails;
            else if (params.data.type === "mood") return moodDetails;
          }
          return undefined;
        },
      },
      { field: "type" },
    ]);
    const defaultColDef = ref<ColDef>({
      flex: 1,
      cellDataType: false,
    });

    function onRowEditingStarted(event: RowEditingStartedEvent<IRow>) {
      console.log("never called - not doing row editing");
    }
    function onRowEditingStopped(event: RowEditingStoppedEvent<IRow>) {
      console.log("never called - not doing row editing");
    }
    function onCellEditingStarted(event: CellEditingStartedEvent<IRow>) {
      console.log("cellEditingStarted");
    }
    function onCellEditingStopped(event: CellEditingStoppedEvent<IRow>) {
      console.log("cellEditingStopped");
    }
    const onGridReady = (params: GridReadyEvent) => {
      gridApi.value = params.api;
    };

    return {
      gridApi,
      rowData,
      columnDefs,
      defaultColDef,
      onGridReady,
      onRowEditingStarted,
      onRowEditingStopped,
      onCellEditingStarted,
      onCellEditingStopped,
    };
  },
});

createApp(VueExample).mount("#app");
