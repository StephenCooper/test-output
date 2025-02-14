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
  GetRowIdFunc,
  GetRowIdParams,
  GridApi,
  GridOptions,
  GridReadyEvent,
  HighlightChangesModule,
  ModuleRegistry,
  NumberEditorModule,
  NumberFilterModule,
  RowApiModule,
  TextEditorModule,
  TextFilterModule,
  ValidationModule,
  createGrid,
} from "ag-grid-community";
ModuleRegistry.registerModules([
  ClientSideRowModelApiModule,
  RowApiModule,
  TextEditorModule,
  TextFilterModule,
  HighlightChangesModule,
  ClientSideRowModelModule,
  NumberFilterModule,
  NumberEditorModule,
  ValidationModule /* Development Only */,
]);

function generateNewFordData() {
  const newPrice = Math.floor(Math.random() * 100000);
  const newModel = "T-" + Math.floor(Math.random() * 1000);
  return {
    id: "bb",
    make: "Ford",
    model: newModel,
    price: newPrice,
  };
}

const VueExample = defineComponent({
  template: `
        <div style="height: 100%">
                <div class="example-wrapper">
      <div style="margin-bottom: 1rem">
        <button v-on:click="setPriceOnToyota()">Set Price on Toyota</button>
        <button v-on:click="setDataOnFord()">Set Data on Ford</button>
        <button v-on:click="updateDataOnFord()">Update Data on Ford</button>
        <button v-on:click="updateSort()" style="margin-left: 15px">Sort</button>
        <button v-on:click="updateFilter()">Filter</button>
      </div>
      <ag-grid-vue
        style="width: 100%; height: 100%;"
        @grid-ready="onGridReady"
        :rowData="rowData"
        :columnDefs="columnDefs"
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
    const rowData = ref<any[] | null>([
      { id: "aa", make: "Toyota", model: "Celica", price: 35000 },
      { id: "bb", make: "Ford", model: "Mondeo", price: 32000 },
      { id: "cc", make: "Porsche", model: "Boxster", price: 72000 },
      { id: "dd", make: "BMW", model: "5 Series", price: 59000 },
      { id: "ee", make: "Dodge", model: "Challanger", price: 35000 },
      { id: "ff", make: "Mazda", model: "MX5", price: 28000 },
      { id: "gg", make: "Horse", model: "Outside", price: 99000 },
    ]);
    const columnDefs = ref<ColDef[]>([
      { field: "make" },
      { field: "model" },
      { field: "price", filter: "agNumberColumnFilter" },
    ]);
    const defaultColDef = ref<ColDef>({
      flex: 1,
      editable: true,
      filter: true,
      enableCellChangeFlash: true,
    });
    const getRowId = ref<GetRowIdFunc>((params: GetRowIdParams) => {
      return params.data.id;
    });

    function updateSort() {
      gridApi.value!.refreshClientSideRowModel("sort");
    }
    function updateFilter() {
      gridApi.value!.refreshClientSideRowModel("filter");
    }
    function setPriceOnToyota() {
      const rowNode = gridApi.value!.getRowNode("aa")!;
      const newPrice = Math.floor(Math.random() * 100000);
      rowNode.setDataValue("price", newPrice);
    }
    function setDataOnFord() {
      const rowNode = gridApi.value!.getRowNode("bb")!;
      const newData = generateNewFordData();
      rowNode.setData(newData);
    }
    function updateDataOnFord() {
      const rowNode = gridApi.value!.getRowNode("bb")!;
      const newData = generateNewFordData();
      rowNode.updateData(newData);
    }
    const onGridReady = (params: GridReadyEvent) => {
      gridApi.value = params.api;
    };

    return {
      gridApi,
      rowData,
      columnDefs,
      defaultColDef,
      getRowId,
      onGridReady,
      updateSort,
      updateFilter,
      setPriceOnToyota,
      setDataOnFord,
      updateDataOnFord,
    };
  },
});

createApp(VueExample).mount("#app");
