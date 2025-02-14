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
  ValidationModule,
  createGrid,
} from "ag-grid-community";
import { getData } from "./data";
ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  ValidationModule /* Development Only */,
]);

const VueExample = defineComponent({
  template: `
        <div style="height: 100%">
                <button v-on:click="onBtPrinterFriendly()">Printer Friendly Layout</button>
    <button v-on:click="onBtNormal()">Normal Layout</button>
    <h3>Latin Text</h3>
    <p>
      Lorem ipsum dolor sit amet, ne cum repudiare abhorreant. Atqui molestiae neglegentur ad nam, mei amet eros ea,
      populo deleniti scaevola et pri. Pro no ubique explicari, his reque nulla consequuntur in. His soleat doctus
      constituam te, sed at alterum repudiandae. Suas ludus electram te ius.
    </p>
    <ag-grid-vue
      id="myGrid"
      style="width: 400px; height: 200px;"
      @grid-ready="onGridReady"
      :columnDefs="columnDefs"
      :rowData="rowData"
      :defaultColDef="defaultColDef"></ag-grid-vue>
      <h3>More Latin Text</h3>
      <p>
        Lorem ipsum dolor sit amet, ne cum repudiare abhorreant. Atqui molestiae neglegentur ad nam, mei amet eros ea,
        populo deleniti scaevola et pri. Pro no ubique explicari, his reque nulla consequuntur in. His soleat doctus
        constituam te, sed at alterum repudiandae. Suas ludus electram te ius.
      </p>
        </div>
    `,
  components: {
    "ag-grid-vue": AgGridVue,
  },
  setup(props) {
    const gridApi = shallowRef<GridApi | null>(null);
    const columnDefs = ref<ColDef[]>([
      { headerName: "ID", valueGetter: "node.rowIndex + 1", width: 70 },
      { field: "model", width: 150 },
      { field: "color" },
      { field: "price", valueFormatter: '"$" + value.toLocaleString()' },
      { field: "year" },
      { field: "country" },
    ]);
    const rowData = ref<any[] | null>(getData());
    const defaultColDef = ref<ColDef>({
      width: 100,
    });

    function onBtPrinterFriendly() {
      const eGridDiv = document.querySelector<HTMLElement>("#myGrid")! as any;
      eGridDiv.style.width = "";
      eGridDiv.style.height = "";
      gridApi.value!.setGridOption("domLayout", "print");
    }
    function onBtNormal() {
      const eGridDiv = document.querySelector<HTMLElement>("#myGrid")! as any;
      eGridDiv.style.width = "400px";
      eGridDiv.style.height = "200px";
      // Same as setting to 'normal' as it is the default
      gridApi.value!.setGridOption("domLayout", undefined);
    }
    const onGridReady = (params: GridReadyEvent) => {
      gridApi.value = params.api;
    };

    return {
      gridApi,
      columnDefs,
      rowData,
      defaultColDef,
      onGridReady,
      onBtPrinterFriendly,
      onBtNormal,
    };
  },
});

createApp(VueExample).mount("#app");
