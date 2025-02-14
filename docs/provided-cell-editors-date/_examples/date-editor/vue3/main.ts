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
  DateEditorModule,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ModuleRegistry,
  ValidationModule,
  ValueFormatterParams,
} from "ag-grid-community";
ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  DateEditorModule,
  ValidationModule /* Development Only */,
]);

const data = Array.from(Array(20).keys()).map((val: any, index: number) => ({
  date: new Date(2023, 5, index + 1),
}));

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
    const gridApi = shallowRef<GridApi | null>(null);
    const columnDefs = ref<ColDef[]>([
      {
        headerName: "Date Editor",
        field: "date",
        valueFormatter: (params: ValueFormatterParams<any, Date>) => {
          if (!params.value) {
            return "";
          }
          const month = params.value.getMonth() + 1;
          const day = params.value.getDate();
          return `${params.value.getFullYear()}-${month < 10 ? "0" + month : month}-${day < 10 ? "0" + day : day}`;
        },
        cellEditor: "agDateCellEditor",
      },
    ]);
    const defaultColDef = ref<ColDef>({
      width: 200,
      editable: true,
    });
    const rowData = ref<any[] | null>(data);

    const onGridReady = (params: GridReadyEvent) => {
      gridApi.value = params.api;
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
