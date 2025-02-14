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
  CellSelectionOptions,
  CellValueChangedEvent,
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  GridApi,
  GridOptions,
  GridReadyEvent,
  HighlightChangesModule,
  ModuleRegistry,
  TextEditorModule,
  UndoRedoEditModule,
  ValidationModule,
  ValueFormatterParams,
  ValueGetterParams,
  ValueParserParams,
  ValueSetterParams,
  createGrid,
} from "ag-grid-community";
import { CellSelectionModule, ClipboardModule } from "ag-grid-enterprise";
ModuleRegistry.registerModules([
  UndoRedoEditModule,
  TextEditorModule,
  HighlightChangesModule,
  ClientSideRowModelModule,
  ClipboardModule,
  CellSelectionModule,
  ValidationModule /* Development Only */,
]);

function createValueA(value: string, data: any) {
  return value == null
    ? null
    : {
        actualValueA: value,
        anotherPropertyA: data.anotherPropertyA,
      };
}

function valueFormatterA(params: ValueFormatterParams) {
  // Convert complex object to string
  return params.value ? params.value.actualValueA : "";
}

function valueGetterA(params: ValueGetterParams) {
  // Create complex object from underlying data
  return createValueA(params.data[params.colDef.field!], params.data);
}

function valueParserA(params: ValueParserParams) {
  // Convert string `newValue` back into complex object (reverse of `valueFormatterA`). `newValue` is string.
  // We have access to `data` (as well as `oldValue`) to retrieve any other properties we need to recreate the complex object.
  // For undo/redo to work, we need immutable data, so can't mutate `oldValue`
  return createValueA(params.newValue, params.data);
}

function valueSetterA(params: ValueSetterParams) {
  // Update data from complex object (reverse of `valueGetterA`)
  params.data[params.colDef.field!] = params.newValue
    ? params.newValue.actualValueA
    : null;
  return true;
}

function equalsA(valueA: any, valueB: any) {
  // Used to detect whether cell value has changed for refreshing. Needed as `valueGetter` returns different references.
  return (
    (valueA == null && valueB == null) ||
    (valueA != null &&
      valueB != null &&
      valueA.actualValueA === valueB.actualValueA)
  );
}

function createValueB(value: string, data: any) {
  return value == null
    ? null
    : {
        actualValueB: value,
        anotherPropertyB: data.anotherPropertyB,
      };
}

function valueFormatterB(params: ValueFormatterParams) {
  // Convert complex object to string
  return params.value ? params.value.actualValueB : "";
}

function valueParserB(params: ValueParserParams) {
  // Convert string `newValue` back into complex object (reverse of `valueFormatterB`). `newValue` is string
  return createValueB(params.newValue, params.data);
}

function disable(id: string, disabled: boolean) {
  (document.querySelector(id) as any).disabled = disabled;
}

function setValue(id: string, value: number) {
  (document.querySelector(id) as any).value = value;
}

function getRows() {
  return Array.apply(null, Array(100)).map(function (_, i) {
    return {
      a: "a-" + i,
      b: {
        actualValueB: "b-" + i,
        anotherPropertyB: "b",
      },
      anotherPropertyA: "a",
    };
  });
}

const VueExample = defineComponent({
  template: `
        <div style="height: 100%">
                <div class="example-wrapper">
      <div>
        <span class="button-group">
          <label>Available Undo's</label>
          <input id="undoInput" class="undo-redo-input">
            <label>Available Redo's</label>
            <input id="redoInput" class="undo-redo-input">
              <button id="undoBtn" class="undo-btn" v-on:click="undo()">Undo</button>
              <button id="redoBtn" class="redo-btn" v-on:click="redo()">Redo</button>
            </span>
          </div>
          <ag-grid-vue
            style="width: 100%; height: 100%;"
            @grid-ready="onGridReady"
            :columnDefs="columnDefs"
            :defaultColDef="defaultColDef"
            :rowData="rowData"
            :cellSelection="cellSelection"
            :undoRedoCellEditing="true"
            :undoRedoCellEditingLimit="undoRedoCellEditingLimit"
            @first-data-rendered="onFirstDataRendered"
            @cell-value-changed="onCellValueChanged"></ag-grid-vue>
          </div>
        </div>
    `,
  components: {
    "ag-grid-vue": AgGridVue,
  },
  setup(props) {
    const gridApi = shallowRef<GridApi | null>(null);
    const columnDefs = ref<ColDef[]>([
      {
        field: "a",
        valueFormatter: valueFormatterA,
        valueGetter: valueGetterA,
        valueParser: valueParserA,
        valueSetter: valueSetterA,
        equals: equalsA,
        cellDataType: "object",
      },
      {
        field: "b",
        valueFormatter: valueFormatterB,
        valueParser: valueParserB,
        cellDataType: "object",
      },
    ]);
    const defaultColDef = ref<ColDef>({
      editable: true,
      enableCellChangeFlash: true,
    });
    const rowData = ref<any[] | null>(getRows());
    const cellSelection = ref<boolean | CellSelectionOptions>({
      handle: {
        mode: "fill",
      },
    });
    const undoRedoCellEditingLimit = ref(5);

    function onFirstDataRendered() {
      setValue("#undoInput", 0);
      disable("#undoInput", true);
      disable("#undoBtn", true);
      setValue("#redoInput", 0);
      disable("#redoInput", true);
      disable("#redoBtn", true);
    }
    function onCellValueChanged(params: CellValueChangedEvent) {
      const undoSize = params.api.getCurrentUndoSize();
      setValue("#undoInput", undoSize);
      disable("#undoBtn", undoSize < 1);
      const redoSize = params.api.getCurrentRedoSize();
      setValue("#redoInput", redoSize);
      disable("#redoBtn", redoSize < 1);
    }
    function undo() {
      gridApi.value!.undoCellEditing();
    }
    function redo() {
      gridApi.value!.redoCellEditing();
    }
    const onGridReady = (params: GridReadyEvent) => {
      gridApi.value = params.api;
    };

    return {
      gridApi,
      columnDefs,
      defaultColDef,
      rowData,
      cellSelection,
      undoRedoCellEditingLimit,
      onGridReady,
      onFirstDataRendered,
      onCellValueChanged,
      undo,
      redo,
    };
  },
});

createApp(VueExample).mount("#app");
