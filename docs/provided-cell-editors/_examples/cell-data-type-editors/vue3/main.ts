import {
  createApp,
  defineComponent,
  onBeforeMount,
  ref,
  shallowRef,
} from "vue";
import { AgGridVue } from "ag-grid-vue3";
import {
  CheckboxEditorModule,
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  DateEditorModule,
  GridApi,
  GridOptions,
  GridReadyEvent,
  INumberCellEditorParams,
  ModuleRegistry,
  NumberEditorModule,
  ValidationModule,
  ValueFormatterParams,
} from "ag-grid-community";
ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  NumberEditorModule,
  DateEditorModule,
  CheckboxEditorModule,
  ValidationModule /* Development Only */,
]);

const data = Array.from(Array(20).keys()).map((val: any, index: number) => ({
  number: index,
  date: new Date(2023, 5, index + 1),
  dateString: `2023-06-${index < 9 ? "0" + (index + 1) : index + 1}`,
  boolean: !!(index % 2),
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
        headerName: "Number Editor",
        field: "number",
        cellEditor: "agNumberCellEditor",
        cellEditorParams: {
          precision: 0,
        } as INumberCellEditorParams,
      },
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
      {
        headerName: "Date as String Editor",
        field: "dateString",
        cellEditor: "agDateStringCellEditor",
      },
      {
        headerName: "Checkbox Cell Editor",
        field: "boolean",
        cellEditor: "agCheckboxCellEditor",
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
