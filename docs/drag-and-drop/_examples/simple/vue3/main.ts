import {
  createApp,
  defineComponent,
  onBeforeMount,
  ref,
  shallowRef,
} from "vue";
import { AgGridVue } from "ag-grid-vue3";
import "./style.css";
import {
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  DragAndDropModule,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ModuleRegistry,
  RowClassRules,
  RowDragModule,
  RowStyleModule,
  TextFilterModule,
  ValidationModule,
  createGrid,
} from "ag-grid-community";
import { getData } from "./data";
ModuleRegistry.registerModules([
  DragAndDropModule,
  TextFilterModule,
  RowDragModule,
  RowStyleModule,
  ClientSideRowModelModule,
  ValidationModule /* Development Only */,
]);

const VueExample = defineComponent({
  template: `
        <div style="height: 100%">
                <div class="outer">
      <div class="grid-col">
        <ag-grid-vue
          style="width: 100%; height: 100%;"
          @grid-ready="onGridReady"
          :columnDefs="columnDefs"
          :defaultColDef="defaultColDef"
          :rowClassRules="rowClassRules"
          :rowData="rowData"
          :rowDragManaged="true"></ag-grid-vue>
        </div>
        <div class="drop-col" v-on:dragover="onDragOver($event)" v-on:drop="onDrop($event)">
          <span id="eDropTarget" class="drop-target"> ==&gt; Drop to here </span>
          <div id="eJsonDisplay" class="json-display"></div>
        </div>
      </div>
        </div>
    `,
  components: {
    "ag-grid-vue": AgGridVue,
  },
  setup(props) {
    const gridApi = shallowRef<GridApi | null>(null);
    const columnDefs = ref<ColDef[]>([
      { valueGetter: "'Drag'", dndSource: true },
      { field: "id" },
      { field: "color" },
      { field: "value1" },
      { field: "value2" },
    ]);
    const defaultColDef = ref<ColDef>({
      width: 80,
      filter: true,
    });
    const rowClassRules = ref<RowClassRules>({
      "red-row": 'data.color == "Red"',
      "green-row": 'data.color == "Green"',
      "blue-row": 'data.color == "Blue"',
    });
    const rowData = ref<any[] | null>(getData());

    function onDragOver(event: any) {
      const dragSupported = event.dataTransfer.length;
      if (dragSupported) {
        event.dataTransfer.dropEffect = "move";
      }
      event.preventDefault();
    }
    function onDrop(event: any) {
      const jsonData = event.dataTransfer.getData("application/json");
      const eJsonRow = document.createElement("div");
      eJsonRow.classList.add("json-row");
      eJsonRow.innerText = jsonData;
      const eJsonDisplay = document.querySelector("#eJsonDisplay")!;
      eJsonDisplay.appendChild(eJsonRow);
      event.preventDefault();
    }
    const onGridReady = (params: GridReadyEvent) => {
      gridApi.value = params.api;
    };

    return {
      gridApi,
      columnDefs,
      defaultColDef,
      rowClassRules,
      rowData,
      onGridReady,
      onDragOver,
      onDrop,
    };
  },
});

createApp(VueExample).mount("#app");
