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
  GridApi,
  GridOptions,
  GridReadyEvent,
  ModuleRegistry,
  NumberEditorModule,
  TextEditorModule,
  ValidationModule,
  ValueGetterParams,
  ValueSetterParams,
} from "ag-grid-community";
import { getData } from "./data";
ModuleRegistry.registerModules([
  TextEditorModule,
  NumberEditorModule,
  ClientSideRowModelModule,
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
        headerName: "Name",
        valueGetter: (params: ValueGetterParams) => {
          return params.data.firstName + " " + params.data.lastName;
        },
        valueSetter: (params: ValueSetterParams) => {
          const fullName = params.newValue || "";
          const nameSplit = fullName.split(" ");
          const newFirstName = nameSplit[0];
          const newLastName = nameSplit[1];
          const data = params.data;
          if (
            data.firstName !== newFirstName ||
            data.lastName !== newLastName
          ) {
            data.firstName = newFirstName;
            data.lastName = newLastName;
            // return true to tell grid that the value has changed, so it knows
            // to update the cell
            return true;
          } else {
            // return false, the grid doesn't need to update
            return false;
          }
        },
      },
      {
        headerName: "A",
        field: "a",
      },
      {
        headerName: "B",
        valueGetter: (params: ValueGetterParams) => {
          return params.data.b;
        },
        valueSetter: (params: ValueSetterParams) => {
          const newVal = params.newValue;
          const valueChanged = params.data.b !== newVal;
          if (valueChanged) {
            params.data.b = newVal;
          }
          return valueChanged;
        },
        cellDataType: "number",
      },
      {
        headerName: "C.X",
        valueGetter: (params: ValueGetterParams) => {
          if (params.data.c) {
            return params.data.c.x;
          } else {
            return undefined;
          }
        },
        valueSetter: (params: ValueSetterParams) => {
          const newVal = params.newValue;
          if (!params.data.c) {
            params.data.c = {};
          }
          const valueChanged = params.data.c.x !== newVal;
          if (valueChanged) {
            params.data.c.x = newVal;
          }
          return valueChanged;
        },
        cellDataType: "number",
      },
      {
        headerName: "C.Y",
        valueGetter: (params: ValueGetterParams) => {
          if (params.data.c) {
            return params.data.c.y;
          } else {
            return undefined;
          }
        },
        valueSetter: (params: ValueSetterParams) => {
          const newVal = params.newValue;
          if (!params.data.c) {
            params.data.c = {};
          }
          const valueChanged = params.data.c.y !== newVal;
          if (valueChanged) {
            params.data.c.y = newVal;
          }
          return valueChanged;
        },
        cellDataType: "number",
      },
    ]);
    const defaultColDef = ref<ColDef>({
      flex: 1,
      editable: true,
    });
    const rowData = ref<any[] | null>(getData());

    function onCellValueChanged(event: CellValueChangedEvent) {
      console.log("Data after change is", event.data);
    }
    const onGridReady = (params: GridReadyEvent) => {
      gridApi.value = params.api;
    };

    return {
      gridApi,
      columnDefs,
      defaultColDef,
      rowData,
      onGridReady,
      onCellValueChanged,
    };
  },
});

createApp(VueExample).mount("#app");
