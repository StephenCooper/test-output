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
  ClientSideRowModelApiModule,
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  FirstDataRenderedEvent,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ModuleRegistry,
  RowGroupingDisplayType,
  ValidationModule,
} from "ag-grid-community";
import { RowGroupingModule } from "ag-grid-enterprise";
import { getData } from "./data";
ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  ClientSideRowModelApiModule,
  RowGroupingModule,
  ValidationModule /* Development Only */,
]);

function setPrinterFriendly(api: GridApi) {
  const eGridDiv = document.querySelector<HTMLElement>("#myGrid")! as any;
  eGridDiv.style.width = "";
  eGridDiv.style.height = "";
  api.setGridOption("domLayout", "print");
}

function setNormal(api: GridApi) {
  const eGridDiv = document.querySelector<HTMLElement>("#myGrid")! as any;
  eGridDiv.style.width = "700px";
  eGridDiv.style.height = "200px";
  api.setGridOption("domLayout", undefined);
}

const VueExample = defineComponent({
  template: `
        <div style="height: 100%">
                <button v-on:click="onBtPrint()">Print</button>
    <h3>Latin Text</h3>
    <p>
      Lorem ipsum dolor sit amet, ne cum repudiare abhorreant. Atqui molestiae neglegentur ad nam, mei amet eros ea,
      populo deleniti scaevola et pri. Pro no ubique explicari, his reque nulla consequuntur in. His soleat doctus
      constituam te, sed at alterum repudiandae. Suas ludus electram te ius.
    </p>
    <ag-grid-vue
      id="myGrid"
      style="width: 700px; height: 200px;"
      @grid-ready="onGridReady"
      :columnDefs="columnDefs"
      :rowData="rowData"
      :groupDisplayType="groupDisplayType"
      @first-data-rendered="onFirstDataRendered"></ag-grid-vue>
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
      { field: "group", rowGroup: true, hide: true },
      { field: "id", pinned: "left", width: 70 },
      { field: "model", width: 180 },
      { field: "color", width: 100 },
      {
        field: "price",
        valueFormatter: "'$' + value.toLocaleString()",
        width: 100,
      },
      { field: "year", width: 100 },
      { field: "country", width: 120 },
    ]);
    const rowData = ref<any[] | null>(getData());
    const groupDisplayType = ref<RowGroupingDisplayType>("groupRows");

    function onFirstDataRendered(params: FirstDataRenderedEvent) {
      params.api.expandAll();
    }
    function onBtPrint() {
      setPrinterFriendly(gridApi.value);
      setTimeout(() => {
        print();
        setNormal(gridApi.value);
      }, 2000);
    }
    const onGridReady = (params: GridReadyEvent) => {
      gridApi.value = params.api;
    };

    return {
      gridApi,
      columnDefs,
      rowData,
      groupDisplayType,
      onGridReady,
      onFirstDataRendered,
      onBtPrint,
    };
  },
});

createApp(VueExample).mount("#app");
