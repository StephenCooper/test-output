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
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ModuleRegistry,
  NumberFilterModule,
  TextFilterModule,
  ValidationModule,
  createGrid,
} from "ag-grid-community";
import { PivotModule } from "ag-grid-enterprise";
import { IOlympicData } from "./interfaces";
ModuleRegistry.registerModules([
  TextFilterModule,
  ClientSideRowModelModule,
  PivotModule,
  NumberFilterModule,
  ValidationModule /* Development Only */,
]);

function setIdText(id: string, value: string | number | undefined) {
  document.getElementById(id)!.textContent =
    value == undefined ? "undefined" : value + "";
}

const VueExample = defineComponent({
  template: `
        <div style="height: 100%">
                <div class="example-wrapper">
      <div class="button-bar example-header">
        <table>
          <tbody><tr>
            <td class="labels">pivot<br />(<span id="pivot">off</span>)</td>
            <td class="buttons-container">
              <button v-on:click="setPivotOn()">on</button>
              <button v-on:click="setPivotOff()">off</button>
            </td>
          </tr>
          <tr>
            <td class="labels">groupHeaderHeight<br />(<span id="groupHeaderHeight">undefined</span>)</td>
            <td class="buttons-container">
              <button v-on:click="setGroupHeaderHeight(40)">40px</button>
              <button v-on:click="setGroupHeaderHeight(60)">60px</button>
              <button v-on:click="setGroupHeaderHeight(undefined)">undefined</button>
            </td>
            <td class="labels">headerHeight<br />(<span id="headerHeight">undefined</span>)</td>
            <td class="buttons-container">
              <button v-on:click="setHeaderHeight(70)">70px</button>
              <button v-on:click="setHeaderHeight(80)">80px</button>
              <button v-on:click="setHeaderHeight(undefined)">undefined</button>
            </td>
          </tr>
          <tr id="requiresPivot" class="hidden">
            <td class="labels">pivotGroupHeaderHeight<br />(<span id="pivotGroupHeaderHeight">undefined</span>)</td>
            <td class="buttons-container">
              <button v-on:click="setPivotGroupHeaderHeight(50)">50px</button>
              <button v-on:click="setPivotGroupHeaderHeight(70)">70px</button>
              <button v-on:click="setPivotGroupHeaderHeight(undefined)">undefined</button>
            </td>
            <td class="labels">pivotHeaderHeight<br />(<span id="pivotHeaderHeight">undefined</span>)</td>
            <td class="buttons-container">
              <button v-on:click="setPivotHeaderHeight(60)">60px</button>
              <button v-on:click="setPivotHeaderHeight(80)">80px</button>
              <button v-on:click="setPivotHeaderHeight(undefined)">undefined</button>
            </td>
          </tr>
          <tr id="requiresNotPivot">
            <td class="labels">floatingFiltersHeight<br />(<span id="floatingFiltersHeight">undefined</span>)</td>
            <td class="buttons-container">
              <button v-on:click="setFloatingFiltersHeight(35)">35px</button>
              <button v-on:click="setFloatingFiltersHeight(55)">55px</button>
              <button v-on:click="setFloatingFiltersHeight(undefined)">undefined</button>
            </td>
          </tr>
          </tbody></table>
        </div>
        <ag-grid-vue
          style="width: 100%; height: 100%;"
          @grid-ready="onGridReady"
          :columnDefs="columnDefs"
          :defaultColDef="defaultColDef"
          :autoGroupColumnDef="autoGroupColumnDef"
          :rowData="rowData"></ag-grid-vue>
        </div>
        </div>
    `,
  components: {
    "ag-grid-vue": AgGridVue,
  },
  setup(props) {
    const gridApi = shallowRef<GridApi<IOlympicData> | null>(null);
    const columnDefs = ref<(ColDef | ColGroupDef)[]>([
      {
        headerName: "Athlete Details",
        children: [
          {
            field: "athlete",
            width: 150,
            suppressSizeToFit: true,
            enableRowGroup: true,
            rowGroupIndex: 0,
          },
          {
            field: "age",
            width: 90,
            minWidth: 75,
            maxWidth: 100,
            enableRowGroup: true,
          },
          {
            field: "country",
            enableRowGroup: true,
          },
          {
            field: "year",
            width: 90,
            enableRowGroup: true,
            pivotIndex: 0,
          },
          { field: "sport", width: 110, enableRowGroup: true },
          {
            field: "gold",
            enableValue: true,
            suppressHeaderMenuButton: true,
            filter: "agNumberColumnFilter",
            aggFunc: "sum",
          },
          {
            field: "silver",
            enableValue: true,
            suppressHeaderMenuButton: true,
            filter: "agNumberColumnFilter",
            aggFunc: "sum",
          },
          {
            field: "bronze",
            enableValue: true,
            suppressHeaderMenuButton: true,
            filter: "agNumberColumnFilter",
            aggFunc: "sum",
          },
          {
            field: "total",
            enableValue: true,
            suppressHeaderMenuButton: true,
            filter: "agNumberColumnFilter",
            aggFunc: "sum",
          },
        ],
      },
    ]);
    const defaultColDef = ref<ColDef>({
      floatingFilter: true,
      width: 120,
    });
    const autoGroupColumnDef = ref<ColDef>({
      width: 200,
    });
    const rowData = ref<IOlympicData[]>(null);

    function setPivotOn() {
      document.querySelector("#requiresPivot")!.className = "";
      document.querySelector("#requiresNotPivot")!.className = "hidden";
      gridApi.value!.setGridOption("pivotMode", true);
      setIdText("pivot", "on");
    }
    function setPivotOff() {
      document.querySelector("#requiresPivot")!.className = "hidden";
      document.querySelector("#requiresNotPivot")!.className = "";
      gridApi.value!.setGridOption("pivotMode", false);
      setIdText("pivot", "off");
    }
    function setHeaderHeight(value?: number) {
      gridApi.value!.setGridOption("headerHeight", value);
      setIdText("headerHeight", value);
    }
    function setGroupHeaderHeight(value?: number) {
      gridApi.value!.setGridOption("groupHeaderHeight", value);
      setIdText("groupHeaderHeight", value);
    }
    function setFloatingFiltersHeight(value?: number) {
      gridApi.value!.setGridOption("floatingFiltersHeight", value);
      setIdText("floatingFiltersHeight", value);
    }
    function setPivotGroupHeaderHeight(value?: number) {
      gridApi.value!.setGridOption("pivotGroupHeaderHeight", value);
      setIdText("pivotGroupHeaderHeight", value);
    }
    function setPivotHeaderHeight(value?: number) {
      gridApi.value!.setGridOption("pivotHeaderHeight", value);
      setIdText("pivotHeaderHeight", value);
    }
    const onGridReady = (params: GridReadyEvent) => {
      gridApi.value = params.api;

      const updateData = (data) => (rowData.value = data);

      fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
        .then((resp) => resp.json())
        .then((data) => updateData(data));
    };

    return {
      gridApi,
      columnDefs,
      defaultColDef,
      autoGroupColumnDef,
      rowData,
      onGridReady,
      setPivotOn,
      setPivotOff,
      setHeaderHeight,
      setGroupHeaderHeight,
      setFloatingFiltersHeight,
      setPivotGroupHeaderHeight,
      setPivotHeaderHeight,
    };
  },
});

createApp(VueExample).mount("#app");
