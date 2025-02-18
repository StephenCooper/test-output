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
  ISelectCellEditorParams,
  ModuleRegistry,
  SelectEditorModule,
  ValidationModule,
} from "ag-grid-community";
import { colors } from "./colors";
ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  SelectEditorModule,
  ValidationModule /* Development Only */,
]);

function getRandomNumber(min: number, max: number) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}

const data = Array.from(Array(20).keys()).map(() => {
  const color = colors[getRandomNumber(0, colors.length - 1)];
  return { color };
});

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
        headerName: "Select Editor Without Max Height and Max Width",
        field: "color",
        cellEditor: "agSelectCellEditor",
        cellEditorParams: {
          values: colors,
        } as ISelectCellEditorParams,
      },
      {
        headerName: "Select Editor With Max Height and Max Width",
        field: "color",
        cellEditor: "agSelectCellEditor",
        cellEditorParams: {
          values: colors,
          valueListMaxHeight: 200,
          valueListMaxWidth: 150,
        } as ISelectCellEditorParams,
      },
    ]);
    const defaultColDef = ref<ColDef>({
      flex: 1,
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
