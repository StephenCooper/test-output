import {
  createApp,
  defineComponent,
  onBeforeMount,
  ref,
  shallowRef,
} from "vue";
import { AgGridVue } from "ag-grid-vue3";
import {
  CellValueChangedEvent,
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  ColumnAutoSizeModule,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ModuleRegistry,
  NumberEditorModule,
  SizeColumnsToContentStrategy,
  SizeColumnsToFitGridStrategy,
  SizeColumnsToFitProvidedWidthStrategy,
  TextEditorModule,
  ValidationModule,
} from "ag-grid-community";
import { getData } from "./data";
ModuleRegistry.registerModules([
  TextEditorModule,
  ColumnAutoSizeModule,
  ClientSideRowModelModule,
  NumberEditorModule,
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
      :rowData="rowData"
      :autoSizeStrategy="autoSizeStrategy"
      @cell-value-changed="onCellValueChanged"></ag-grid-vue>
        </div>
    `,
  components: {
    "ag-grid-vue": AgGridVue,
  },
  setup(props) {
    const gridApi = shallowRef<GridApi | null>(null);
    const columnDefs = ref<ColDef[]>([
      {
        headerName: "String (editable)",
        field: "simple",
        editable: true,
      },
      {
        headerName: "Number (editable)",
        field: "number",
        editable: true,
        valueFormatter: `"£" + Math.floor(value).toString().replace(/(\\d)(?=(\\d{3})+(?!\\d))/g, "$1,")`,
      },
      {
        headerName: "Name (editable)",
        editable: true,
        valueGetter: 'data.firstName + " " + data.lastName',
        valueSetter:
          // an expression can span multiple lines!!!
          `var nameSplit = newValue.split(" ");
             var newFirstName = nameSplit[0];
             var newLastName = nameSplit[1];
             if (data.firstName !== newFirstName || data.lastName !== newLastName) {  
                data.firstName = newFirstName;  
                data.lastName = newLastName;  
                return true;
            } else {  
                return false;
            }`,
      },
      { headerName: "A", field: "a", width: 100 },
      { headerName: "B", field: "b", width: 100 },
      { headerName: "A + B", valueGetter: "data.a + data.b" },
    ]);
    const defaultColDef = ref<ColDef>({
      flex: 1,
      sortable: false,
    });
    const rowData = ref<any[] | null>(getData());
    const autoSizeStrategy = ref<
      | SizeColumnsToFitGridStrategy
      | SizeColumnsToFitProvidedWidthStrategy
      | SizeColumnsToContentStrategy
    >({ type: "fitGridWidth" });

    function onCellValueChanged(event: CellValueChangedEvent) {
      console.log("data after changes is: ", event.data);
    }
    const onGridReady = (params: GridReadyEvent) => {
      gridApi.value = params.api;
    };

    return {
      gridApi,
      columnDefs,
      defaultColDef,
      rowData,
      autoSizeStrategy,
      onGridReady,
      onCellValueChanged,
    };
  },
});

createApp(VueExample).mount("#app");
