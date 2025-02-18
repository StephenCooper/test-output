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
  GridApi,
  GridOptions,
  GridReadyEvent,
  ModuleRegistry,
  RowClassRules,
  RowDragModule,
  RowStyleModule,
  TextFilterModule,
  ValidationModule,
} from "ag-grid-community";
import DragSourceRenderer from "./dragSourceRendererVue";
import { getData } from "./data";
ModuleRegistry.registerModules([
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
          :rowClassRules="rowClassRules"
          :defaultColDef="defaultColDef"
          :rowData="rowData"
          :rowDragManaged="true"
          :columnDefs="columnDefs"></ag-grid-vue>
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
    DragSourceRenderer,
  },
  setup(props) {
    const gridApi = shallowRef<GridApi | null>(null);
    const rowClassRules = ref<RowClassRules>({
      "red-row": 'data.color == "Red"',
      "green-row": 'data.color == "Green"',
      "blue-row": 'data.color == "Blue"',
    });
    const defaultColDef = ref<ColDef>({
      width: 80,
      filter: true,
    });
    const rowData = ref<any[] | null>(getData());
    const columnDefs = ref<ColDef[]>([
      { cellRenderer: "DragSourceRenderer", minWidth: 100 },
      { field: "id" },
      { field: "color" },
      { field: "value1" },
      { field: "value2" },
    ]);

    function onDragOver(event: any) {
      const types = event.dataTransfer.types;
      const dragSupported = types.length;
      if (dragSupported) {
        event.dataTransfer.dropEffect = "move";
      }
      event.preventDefault();
    }
    function onDrop(event: any) {
      event.preventDefault();
      const textData = event.dataTransfer.getData("text/plain");
      const eJsonRow = document.createElement("div");
      eJsonRow.classList.add("json-row");
      eJsonRow.innerText = textData;
      const eJsonDisplay = document.querySelector("#eJsonDisplay")!;
      eJsonDisplay.appendChild(eJsonRow);
    }
    const onGridReady = (params: GridReadyEvent) => {
      gridApi.value = params.api;
    };

    return {
      gridApi,
      rowClassRules,
      defaultColDef,
      rowData,
      columnDefs,
      onGridReady,
      onDragOver,
      onDrop,
    };
  },
});

createApp(VueExample).mount("#app");
