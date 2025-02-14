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
  ClientSideRowModelApiModule,
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ModuleRegistry,
  RowApiModule,
  RowHeightParams,
  ValidationModule,
  createGrid,
} from "ag-grid-community";
import {
  ColumnMenuModule,
  ColumnsToolPanelModule,
  ContextMenuModule,
  RowGroupingModule,
} from "ag-grid-enterprise";
import { getData } from "./data";
import { IOlympicData } from "./interfaces";
ModuleRegistry.registerModules([
  ClientSideRowModelApiModule,
  RowApiModule,
  ClientSideRowModelModule,
  ColumnsToolPanelModule,
  ColumnMenuModule,
  ContextMenuModule,
  RowGroupingModule,
  ValidationModule /* Development Only */,
]);

let swimmingHeight: number;

let groupHeight: number;

let usaHeight: number;

const VueExample = defineComponent({
  template: `
        <div style="height: 100%">
                <div class="example-wrapper">
      <div style="margin-bottom: 5px; font-family: Verdana, Geneva, Tahoma, sans-serif; font-size: 13px">
        <div>
          Top Level Groups:
          <button v-on:click="setGroupHeight(42)">42px</button>
          <button v-on:click="setGroupHeight(75)">75px</button>
          <button v-on:click="setGroupHeight(125)">125px</button>
        </div>
        <div style="margin-top: 5px">
          Swimming Leaf Rows:
          <button v-on:click="setSwimmingHeight(42)">42px</button>
          <button v-on:click="setSwimmingHeight(75)">75px</button>
          <button v-on:click="setSwimmingHeight(125)">125px</button>
        </div>
        <div style="margin-top: 5px">
          United States Leaf Rows:
          <button v-on:click="setUsaHeight(42)">42px</button>
          <button v-on:click="setUsaHeight(75)">75px</button>
          <button v-on:click="setUsaHeight(125)">125px</button>
        </div>
      </div>
      <ag-grid-vue
        style="width: 100%; height: 100%;"
        @grid-ready="onGridReady"
        :columnDefs="columnDefs"
        :rowData="rowData"
        :groupDefaultExpanded="groupDefaultExpanded"
        :getRowHeight="getRowHeight"></ag-grid-vue>
      </div>
        </div>
    `,
  components: {
    "ag-grid-vue": AgGridVue,
  },
  setup(props) {
    const gridApi = shallowRef<GridApi<IOlympicData> | null>(null);
    const columnDefs = ref<ColDef[]>([
      { field: "country", rowGroup: true },
      { field: "athlete" },
      { field: "date" },
      { field: "sport" },
      { field: "gold" },
      { field: "silver" },
      { field: "bronze" },
      { field: "total" },
    ]);
    const rowData = ref<IOlympicData[] | null>(getData());
    const groupDefaultExpanded = ref(1);

    function setSwimmingHeight(height: number) {
      swimmingHeight = height;
      gridApi.value!.resetRowHeights();
    }
    function setGroupHeight(height: number) {
      groupHeight = height;
      gridApi.value!.resetRowHeights();
    }
    function setUsaHeight(height: number) {
      // this is used next time resetRowHeights is called
      usaHeight = height;
      gridApi.value!.forEachNode(function (rowNode) {
        if (rowNode.data && rowNode.data.country === "United States") {
          rowNode.setRowHeight(height);
        }
      });
      gridApi.value!.onRowHeightChanged();
    }
    const onGridReady = (params: GridReadyEvent) => {
      gridApi.value = params.api;
    };
    const getRowHeight: (
      params: RowHeightParams<IOlympicData>,
    ) => number | undefined | null = (
      params: RowHeightParams<IOlympicData>,
    ) => {
      if (params.node.group && groupHeight != null) {
        return groupHeight;
      } else if (
        params.data &&
        params.data.country === "United States" &&
        usaHeight != null
      ) {
        return usaHeight;
      } else if (
        params.data &&
        params.data.sport === "Swimming" &&
        swimmingHeight != null
      ) {
        return swimmingHeight;
      }
    };

    return {
      gridApi,
      columnDefs,
      rowData,
      groupDefaultExpanded,
      getRowHeight,
      onGridReady,
      setSwimmingHeight,
      setGroupHeight,
      setUsaHeight,
    };
  },
});

createApp(VueExample).mount("#app");
