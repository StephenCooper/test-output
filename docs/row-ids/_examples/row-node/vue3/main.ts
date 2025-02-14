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
  GetRowIdFunc,
  GetRowIdParams,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ModuleRegistry,
  RowApiModule,
  ValidationModule,
  createGrid,
} from "ag-grid-community";
ModuleRegistry.registerModules([
  RowApiModule,
  ClientSideRowModelModule,
  ValidationModule /* Development Only */,
]);

const VueExample = defineComponent({
  template: `
        <div style="height: 100%">
                <div class="example-wrapper">
      <div style="margin-bottom: 1rem">
        <button v-on:click="getAllRows()">Log All Rows</button>
        <button v-on:click="getRowById()">Get ONE Row</button>
      </div>
      <ag-grid-vue
        style="width: 100%; height: 100%;"
        @grid-ready="onGridReady"
        :columnDefs="columnDefs"
        :rowData="rowData"
        :defaultColDef="defaultColDef"
        :getRowId="getRowId"></ag-grid-vue>
      </div>
        </div>
    `,
  components: {
    "ag-grid-vue": AgGridVue,
  },
  setup(props) {
    const gridApi = shallowRef<GridApi | null>(null);
    const columnDefs = ref<ColDef[]>([
      { field: "id", headerName: "Row ID" },
      { field: "make" },
      { field: "model" },
      { field: "price" },
    ]);
    const rowData = ref<any[] | null>([
      { id: "c1", make: "Toyota", model: "Celica", price: 35000 },
      { id: "c2", make: "Ford", model: "Mondeo", price: 32000 },
      { id: "c8", make: "Porsche", model: "Boxster", price: 72000 },
      { id: "c4", make: "BMW", model: "M50", price: 60000 },
      { id: "c14", make: "Aston Martin", model: "DBX", price: 190000 },
    ]);
    const defaultColDef = ref<ColDef>({
      flex: 1,
    });
    const getRowId = ref<GetRowIdFunc>((params: GetRowIdParams) =>
      String(params.data.id),
    );

    function getAllRows() {
      gridApi.value!.forEachNode((rowNode) => {
        console.log(`=============== ROW ${rowNode.rowIndex}`);
        console.log(`id = ${rowNode.id}`);
        console.log(`rowIndex = ${rowNode.rowIndex}`);
        console.log(`data = ${JSON.stringify(rowNode.data)}`);
        console.log(`group = ${rowNode.group}`);
        console.log(`height = ${rowNode.rowHeight}px`);
        console.log(`isSelected = ${rowNode.isSelected()}`);
      });
      window.alert("Row details printed to developers console");
    }
    function getRowById() {
      const rowNode = gridApi.value!.getRowNode("c2");
      if (rowNode && rowNode.id == "c2") {
        console.log(`################ Got Row Node C2`);
        console.log(`data = ${JSON.stringify(rowNode.data)}`);
      }
      window.alert("Row details printed to developers console");
    }
    const onGridReady = (params: GridReadyEvent) => {
      gridApi.value = params.api;
    };

    return {
      gridApi,
      columnDefs,
      rowData,
      defaultColDef,
      getRowId,
      onGridReady,
      getAllRows,
      getRowById,
    };
  },
});

createApp(VueExample).mount("#app");
