import {
  createApp,
  defineComponent,
  onBeforeMount,
  ref,
  shallowRef,
} from "vue";
import { AgGridVue } from "ag-grid-vue3";
import "./styles.css";
import {
  CellValueChangedEvent,
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  CustomEditorModule,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ModuleRegistry,
  RowValueChangedEvent,
  SelectEditorModule,
  TextEditorModule,
  ValidationModule,
} from "ag-grid-community";
import {
  ColumnMenuModule,
  ColumnsToolPanelModule,
  ContextMenuModule,
} from "ag-grid-enterprise";
import NumericCellEditor from "./numericCellEditorVue";
ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  ColumnsToolPanelModule,
  ColumnMenuModule,
  ContextMenuModule,
  SelectEditorModule,
  TextEditorModule,
  CustomEditorModule,
  ValidationModule /* Development Only */,
]);

function getRowData() {
  const rowData = [];
  for (let i = 0; i < 10; i++) {
    rowData.push({
      make: "Toyota",
      model: "Celica",
      price: 35000 + i * 1000,
      field4: "Sample XX",
      field5: "Sample 22",
      field6: "Sample 23",
    });
    rowData.push({
      make: "Ford",
      model: "Mondeo",
      price: 32000 + i * 1000,
      field4: "Sample YY",
      field5: "Sample 24",
      field6: "Sample 25",
    });
    rowData.push({
      make: "Porsche",
      model: "Boxster",
      price: 72000 + i * 1000,
      field4: "Sample ZZ",
      field5: "Sample 26",
      field6: "Sample 27",
    });
  }
  return rowData;
}

const VueExample = defineComponent({
  template: `
        <div style="height: 100%">
                <div class="example-wrapper">
      <div style="margin-bottom: 5px">
        <button style="font-size: 12px" v-on:click="onBtStartEditing()">Start Editing Line 2</button>
        <button style="font-size: 12px" v-on:click="onBtStopEditing()">Stop Editing</button>
      </div>
      <ag-grid-vue
        style="width: 100%; height: 100%;"
        @grid-ready="onGridReady"
        :columnDefs="columnDefs"
        :defaultColDef="defaultColDef"
        :editType="editType"
        :rowData="rowData"
        @cell-value-changed="onCellValueChanged"
        @row-value-changed="onRowValueChanged"></ag-grid-vue>
      </div>
        </div>
    `,
  components: {
    "ag-grid-vue": AgGridVue,
    NumericCellEditor,
  },
  setup(props) {
    const gridApi = shallowRef<GridApi | null>(null);
    const columnDefs = ref<ColDef[]>([
      {
        field: "make",
        cellEditor: "agSelectCellEditor",
        cellEditorParams: {
          values: ["Porsche", "Toyota", "Ford", "AAA", "BBB", "CCC"],
        },
      },
      { field: "model" },
      { field: "field4", headerName: "Read Only", editable: false },
      { field: "price", cellEditor: "NumericCellEditor" },
      {
        headerName: "Suppress Navigable",
        field: "field5",
        suppressNavigable: true,
        minWidth: 200,
      },
      { headerName: "Read Only", field: "field6", editable: false },
    ]);
    const defaultColDef = ref<ColDef>({
      flex: 1,
      editable: true,
      cellDataType: false,
    });
    const editType = ref<"fullRow">("fullRow");
    const rowData = ref<any[] | null>(getRowData());

    function onCellValueChanged(event: CellValueChangedEvent) {
      console.log(
        "onCellValueChanged: " + event.colDef.field + " = " + event.newValue,
      );
    }
    function onRowValueChanged(event: RowValueChangedEvent) {
      const data = event.data;
      console.log(
        "onRowValueChanged: (" +
          data.make +
          ", " +
          data.model +
          ", " +
          data.price +
          ", " +
          data.field5 +
          ")",
      );
    }
    function onBtStopEditing() {
      gridApi.value!.stopEditing();
    }
    function onBtStartEditing() {
      gridApi.value!.setFocusedCell(1, "make");
      gridApi.value!.startEditingCell({
        rowIndex: 1,
        colKey: "make",
      });
    }
    const onGridReady = (params: GridReadyEvent) => {
      gridApi.value = params.api;
    };

    return {
      gridApi,
      columnDefs,
      defaultColDef,
      editType,
      rowData,
      onGridReady,
      onCellValueChanged,
      onRowValueChanged,
      onBtStopEditing,
      onBtStartEditing,
    };
  },
});

createApp(VueExample).mount("#app");
