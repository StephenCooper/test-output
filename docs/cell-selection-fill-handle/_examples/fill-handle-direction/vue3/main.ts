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
  createGrid,
} from "ag-grid-community";
import { CellSelectionModule } from "ag-grid-enterprise";
import { IOlympicData } from "./interfaces";
ModuleRegistry.registerModules([
  NumberEditorModule,
  TextEditorModule,
  ClientSideRowModelModule,
  CellSelectionModule,
  ValidationModule /* Development Only */,
]);

const VueExample = defineComponent({
  template: `
        <div style="height: 100%">
                <div class="example-wrapper">
      <div style="margin-bottom: 5px">
        <label>Axis: </label>
        <button class="ag-fill-direction xy" v-on:click="fillHandleAxis('xy')">xy</button>
        <button class="ag-fill-direction x selected" v-on:click="fillHandleAxis('x')">x only</button>
        <button class="ag-fill-direction y" v-on:click="fillHandleAxis('y')">y only</button>
      </div>
      <ag-grid-vue
        style="width: 100%; height: 100%;"
        @grid-ready="onGridReady"
        :columnDefs="columnDefs"
        :defaultColDef="defaultColDef"
        :cellSelection="cellSelection"
        :rowData="rowData"></ag-grid-vue>
      </div>
        </div>
    `,
  components: {
    "ag-grid-vue": AgGridVue,
  },
  setup(props) {
    const gridApi = shallowRef<GridApi<IOlympicData> | null>(null);
    const columnDefs = ref<ColDef[]>([
      { field: "athlete", minWidth: 150 },
      { field: "age", maxWidth: 90 },
      { field: "country", minWidth: 150 },
      { field: "year", maxWidth: 90 },
      { field: "date", minWidth: 150 },
      { field: "sport", minWidth: 150 },
      { field: "gold" },
      { field: "silver" },
      { field: "bronze" },
      { field: "total" },
    ]);
    const defaultColDef = ref<ColDef>({
      flex: 1,
      minWidth: 100,
      editable: true,
      cellDataType: false,
    });
    const cellSelection = ref<boolean | CellSelectionOptions>({
      handle: {
        mode: "fill",
        direction: "x",
      },
    });
    const rowData = ref<IOlympicData[]>(null);

    function fillHandleAxis(direction: "x" | "y" | "xy") {
      const buttons = Array.prototype.slice.call(
        document.querySelectorAll(".ag-fill-direction"),
      );
      const button = document.querySelector(".ag-fill-direction." + direction)!;
      buttons.forEach((btn) => {
        btn.classList.remove("selected");
      });
      button.classList.add("selected");
      gridApi.value.setGridOption("cellSelection", {
        handle: {
          mode: "fill",
          direction,
        },
      });
    }
    const onGridReady = (params: GridReadyEvent) => {
      gridApi.value = params.api;

      const updateData = (data) => (rowData.value = data);

      fetch("https://www.ag-grid.com/example-assets/small-olympic-winners.json")
        .then((resp) => resp.json())
        .then((data) => updateData(data));
    };

    return {
      gridApi,
      columnDefs,
      defaultColDef,
      cellSelection,
      rowData,
      onGridReady,
      fillHandleAxis,
    };
  },
});

createApp(VueExample).mount("#app");
