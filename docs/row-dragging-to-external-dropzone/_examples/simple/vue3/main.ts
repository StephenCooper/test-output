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
  RowDropZoneParams,
  RowStyleModule,
  TextFilterModule,
  ValidationModule,
} from "ag-grid-community";
ModuleRegistry.registerModules([
  TextFilterModule,
  RowDragModule,
  RowStyleModule,
  ClientSideRowModelModule,
  ValidationModule /* Development Only */,
]);

let rowIdSequence = 100;

function addCheckboxListener(params: GridReadyEvent) {
  const checkbox = document.querySelector("input[type=checkbox]")! as any;
  checkbox.addEventListener("change", () => {
    params.api.setGridOption("suppressMoveWhenRowDragging", checkbox.checked);
  });
}

function createRowData() {
  const data: any[] = [];
  [
    "Red",
    "Green",
    "Blue",
    "Red",
    "Green",
    "Blue",
    "Red",
    "Green",
    "Blue",
  ].forEach((color) => {
    const newDataItem = {
      id: rowIdSequence++,
      color: color,
      value1: Math.floor(Math.random() * 100),
      value2: Math.floor(Math.random() * 100),
    };
    data.push(newDataItem);
  });
  return data;
}

function createTile(data: any) {
  const el = document.createElement("div");
  el.classList.add("tile");
  el.classList.add(data.color.toLowerCase());
  el.innerHTML =
    '<div class="id">' +
    data.id +
    "</div>" +
    '<div class="value">' +
    data.value1 +
    "</div>" +
    '<div class="value">' +
    data.value2 +
    "</div>";
  return el;
}

function addDropZones(params: GridReadyEvent) {
  const tileContainer = document.querySelector(".tile-container") as any;
  const dropZone: RowDropZoneParams = {
    getContainer: () => {
      return tileContainer as any;
    },
    onDragStop: (params) => {
      const tile = createTile(params.node.data);
      tileContainer.appendChild(tile);
    },
  };
  params.api.addRowDropZone(dropZone);
}

const VueExample = defineComponent({
  template: `
        <div style="height: 100%">
                <div class="example-wrapper">
      <div class="toolbar">
        <label><input type="checkbox"> Enable suppressMoveWhenRowDragging</label>
      </div>
      <div class="drop-containers">
        <div class="grid-wrapper">
          <ag-grid-vue
            style="width: 100%; height: 100%;"
            @grid-ready="onGridReady"
            :columnDefs="columnDefs"
            :defaultColDef="defaultColDef"
            :rowClassRules="rowClassRules"
            :rowData="rowData"
            :rowDragManaged="true"></ag-grid-vue>
          </div>
          <div class="drop-col">
            <span id="eDropTarget" class="drop-target">==&gt; Drop to here</span>
            <div class="tile-container"></div>
          </div>
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
      { field: "id", rowDrag: true },
      { field: "color" },
      { field: "value1" },
      { field: "value2" },
    ]);
    const defaultColDef = ref<ColDef>({
      filter: true,
      flex: 1,
    });
    const rowClassRules = ref<RowClassRules>({
      "red-row": 'data.color == "Red"',
      "green-row": 'data.color == "Green"',
      "blue-row": 'data.color == "Blue"',
    });
    const rowData = ref<any[] | null>(createRowData());

    const onGridReady = (params: GridReadyEvent) => {
      gridApi.value = params.api;

      addDropZones(params);
      addCheckboxListener(params);
    };

    return {
      gridApi,
      columnDefs,
      defaultColDef,
      rowClassRules,
      rowData,
      onGridReady,
    };
  },
});

createApp(VueExample).mount("#app");
