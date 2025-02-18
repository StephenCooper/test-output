import {
  createApp,
  defineComponent,
  onBeforeMount,
  ref,
  shallowRef,
} from "vue";
import { AgGridVue } from "ag-grid-vue3";
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
  RowNodeTransaction,
  RowSelectionModule,
  RowSelectionOptions,
  ValidationModule,
} from "ag-grid-community";
import { getData } from "./data";
ModuleRegistry.registerModules([
  ClientSideRowModelApiModule,
  RowSelectionModule,
  RowApiModule,
  ClientSideRowModelModule,
  ValidationModule /* Development Only */,
]);

let newCount = 1;

function createNewRowData() {
  const newData = {
    make: "Toyota " + newCount,
    model: "Celica " + newCount,
    price: 35000 + newCount * 17,
    zombies: "Headless",
    style: "Little",
    clothes: "Airbag",
  };
  newCount++;
  return newData;
}

function printResult(res: RowNodeTransaction) {
  console.log("---------------------------------------");
  if (res.add) {
    res.add.forEach((rowNode) => {
      console.log("Added Row Node", rowNode);
    });
  }
  if (res.remove) {
    res.remove.forEach((rowNode) => {
      console.log("Removed Row Node", rowNode);
    });
  }
  if (res.update) {
    res.update.forEach((rowNode) => {
      console.log("Updated Row Node", rowNode);
    });
  }
}

const VueExample = defineComponent({
  template: `
        <div style="height: 100%">
                <div style="height: 100%; display: flex; flex-direction: column">
      <div style="margin-bottom: 4px">
        <button v-on:click="addItems(undefined)">Add Items</button>
        <button v-on:click="addItems(2)">Add Items addIndex=2</button>
        <button v-on:click="updateItems()">Update Top 2</button>
        <button v-on:click="onRemoveSelected()">Remove Selected</button>
        <button v-on:click="getRowData()">Get Row Data</button>
        <button v-on:click="clearData()">Clear Data</button>
      </div>
      <div style="flex-grow: 1">
        <ag-grid-vue
          style="width: 100%; height: 100%;"
          @grid-ready="onGridReady"
          :columnDefs="columnDefs"
          :defaultColDef="defaultColDef"
          :rowData="rowData"
          :rowSelection="rowSelection"></ag-grid-vue>
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
      { field: "make" },
      { field: "model" },
      { field: "price" },
      { field: "zombies" },
      { field: "style" },
      { field: "clothes" },
    ]);
    const defaultColDef = ref<ColDef>({
      flex: 1,
    });
    const rowData = ref<any[] | null>(getData());
    const rowSelection = ref<RowSelectionOptions | "single" | "multiple">({
      mode: "multiRow",
    });

    function getRowData() {
      const rowData: any[] = [];
      gridApi.value!.forEachNode(function (node) {
        rowData.push(node.data);
      });
      console.log("Row Data:");
      console.table(rowData);
    }
    function clearData() {
      const rowData: any[] = [];
      gridApi.value!.forEachNode(function (node) {
        rowData.push(node.data);
      });
      const res = gridApi.value!.applyTransaction({
        remove: rowData,
      })!;
      printResult(res);
    }
    function addItems(addIndex: number | undefined) {
      const newItems = [
        createNewRowData(),
        createNewRowData(),
        createNewRowData(),
      ];
      const res = gridApi.value!.applyTransaction({
        add: newItems,
        addIndex: addIndex,
      })!;
      printResult(res);
    }
    function updateItems() {
      // update the first 2 items
      const itemsToUpdate: any[] = [];
      gridApi.value!.forEachNodeAfterFilterAndSort(function (rowNode, index) {
        // only do first 2
        if (index >= 2) {
          return;
        }
        const data = rowNode.data;
        data.price = Math.floor(Math.random() * 20000 + 20000);
        itemsToUpdate.push(data);
      });
      const res = gridApi.value!.applyTransaction({ update: itemsToUpdate })!;
      printResult(res);
    }
    function onRemoveSelected() {
      const selectedData = gridApi.value!.getSelectedRows();
      const res = gridApi.value!.applyTransaction({ remove: selectedData })!;
      printResult(res);
    }
    const onGridReady = (params: GridReadyEvent) => {
      gridApi.value = params.api;
    };

    return {
      gridApi,
      columnDefs,
      defaultColDef,
      rowData,
      rowSelection,
      onGridReady,
      getRowData,
      clearData,
      addItems,
      updateItems,
      onRemoveSelected,
    };
  },
});

createApp(VueExample).mount("#app");
