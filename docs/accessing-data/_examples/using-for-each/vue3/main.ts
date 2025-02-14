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
  IRowNode,
  ModuleRegistry,
  NumberFilterModule,
  RowApiModule,
  ValidationModule,
  createGrid,
} from "ag-grid-community";
import {
  ColumnMenuModule,
  ContextMenuModule,
  RowGroupingModule,
  SetFilterModule,
} from "ag-grid-enterprise";
import { IOlympicData } from "./interfaces";
ModuleRegistry.registerModules([
  ClientSideRowModelApiModule,
  NumberFilterModule,
  RowApiModule,
  ClientSideRowModelModule,
  ColumnMenuModule,
  ContextMenuModule,
  RowGroupingModule,
  SetFilterModule,
  ValidationModule /* Development Only */,
]);

const printNode = (node: IRowNode<IOlympicData>, index?: number) => {
  if (node.group) {
    console.log(index + " -> group: " + node.key);
  } else {
    console.log(
      index + " -> data: " + node.data!.country + ", " + node.data!.athlete,
    );
  }
};

const VueExample = defineComponent({
  template: `
        <div style="height: 100%">
                <div class="example-wrapper">
      <div style="margin-bottom: 1rem">
        <button v-on:click="onBtForEachNode()">For-Each Node</button>
        <button v-on:click="onBtForEachNodeAfterFilter()">For-Each Node After Filter</button>
        <button v-on:click="onBtForEachNodeAfterFilterAndSort()">For-Each Node After Filter and Sort</button>
        <button v-on:click="onBtForEachLeafNode()">For-Each Leaf Node</button>
      </div>
      <ag-grid-vue
        style="width: 100%; height: 100%;"
        @grid-ready="onGridReady"
        :columnDefs="columnDefs"
        :defaultColDef="defaultColDef"
        :autoGroupColumnDef="autoGroupColumnDef"
        :groupDefaultExpanded="groupDefaultExpanded"
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
      { field: "country", rowGroup: true, hide: true },
      { field: "athlete", minWidth: 180 },
      { field: "age" },
      { field: "year" },
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
      filter: true,
    });
    const autoGroupColumnDef = ref<ColDef>({
      minWidth: 200,
    });
    const groupDefaultExpanded = ref(1);
    const rowData = ref<IOlympicData[]>(null);

    function onBtForEachNode() {
      console.log("### api.forEachNode() ###");
      gridApi.value!.forEachNode(printNode);
    }
    function onBtForEachNodeAfterFilter() {
      console.log("### api.forEachNodeAfterFilter() ###");
      gridApi.value!.forEachNodeAfterFilter(printNode);
    }
    function onBtForEachNodeAfterFilterAndSort() {
      console.log("### api.forEachNodeAfterFilterAndSort() ###");
      gridApi.value!.forEachNodeAfterFilterAndSort(printNode);
    }
    function onBtForEachLeafNode() {
      console.log("### api.forEachLeafNode() ###");
      gridApi.value!.forEachLeafNode(printNode);
    }
    const onGridReady = (params: GridReadyEvent) => {
      gridApi.value = params.api;

      const updateData = (data) => (rowData.value = data.slice(0, 50));

      fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
        .then((resp) => resp.json())
        .then((data) => updateData(data));
    };

    return {
      gridApi,
      columnDefs,
      defaultColDef,
      autoGroupColumnDef,
      groupDefaultExpanded,
      rowData,
      onGridReady,
      onBtForEachNode,
      onBtForEachNodeAfterFilter,
      onBtForEachNodeAfterFilterAndSort,
      onBtForEachLeafNode,
    };
  },
});

createApp(VueExample).mount("#app");
