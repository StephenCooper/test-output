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
  RedoEndedEvent,
  RedoStartedEvent,
  TextEditorModule,
  UndoEndedEvent,
  UndoRedoEditModule,
  UndoStartedEvent,
  ValidationModule,
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
      b: "b-" + i,
      c: "c-" + i,
      d: "d-" + i,
      e: "e-" + i,
      f: "f-" + i,
      g: "g-" + i,
      h: "h-" + i,
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
            @cell-value-changed="onCellValueChanged"
            @undo-started="onUndoStarted"
            @undo-ended="onUndoEnded"
            @redo-started="onRedoStarted"
            @redo-ended="onRedoEnded"></ag-grid-vue>
          </div>
        </div>
    `,
  components: {
    "ag-grid-vue": AgGridVue,
  },
  setup(props) {
    const gridApi = shallowRef<GridApi | null>(null);
    const columnDefs = ref<ColDef[]>([
      { field: "a" },
      { field: "b" },
      { field: "c" },
      { field: "d" },
      { field: "e" },
      { field: "f" },
      { field: "g" },
      { field: "h" },
    ]);
    const defaultColDef = ref<ColDef>({
      flex: 1,
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
      console.log("cellValueChanged", params);
      const undoSize = params.api.getCurrentUndoSize();
      setValue("#undoInput", undoSize);
      disable("#undoBtn", undoSize < 1);
      const redoSize = params.api.getCurrentRedoSize();
      setValue("#redoInput", redoSize);
      disable("#redoBtn", redoSize < 1);
    }
    function onUndoStarted(event: UndoStartedEvent) {
      console.log("undoStarted", event);
    }
    function onUndoEnded(event: UndoEndedEvent) {
      console.log("undoEnded", event);
    }
    function onRedoStarted(event: RedoStartedEvent) {
      console.log("redoStarted", event);
    }
    function onRedoEnded(event: RedoEndedEvent) {
      console.log("redoEnded", event);
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
      onUndoStarted,
      onUndoEnded,
      onRedoStarted,
      onRedoEnded,
      undo,
      redo,
    };
  },
});

createApp(VueExample).mount("#app");
