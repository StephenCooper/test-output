import {
  createApp,
  defineComponent,
  onBeforeMount,
  ref,
  shallowRef,
} from "vue";
import { AgGridVue } from "ag-grid-vue3";
import {
  CellSelectionOptions,
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  ColumnApiModule,
  GetRowIdFunc,
  GetRowIdParams,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ModuleRegistry,
  RowSelectionModule,
  RowSelectionOptions,
  StatusPanelDef,
  TextFilterModule,
  ValidationModule,
  createGrid,
} from "ag-grid-community";
import {
  CellSelectionModule,
  RowGroupingModule,
  StatusBarModule,
} from "ag-grid-enterprise";
ModuleRegistry.registerModules([
  ColumnApiModule,
  TextFilterModule,
  RowSelectionModule,
  ClientSideRowModelModule,
  CellSelectionModule,
  RowGroupingModule,
  StatusBarModule,
  ValidationModule /* Development Only */,
]);

function getInitialData() {
  const data = [];
  for (let i = 0; i < 5; i++) {
    data.push(createItem());
  }
  return data;
}

let immutableStore: any[] = [];

function filter(list: any[], callback: any) {
  const filteredList: any[] = [];
  list.forEach((item) => {
    if (callback(item)) {
      filteredList.push(item);
    }
  });
  return filteredList;
}

function createItem() {
  const item = {
    group: ["A", "B", "C"][Math.floor(Math.random() * 3)],
    symbol: createUniqueRandomSymbol(),
    price: Math.floor(Math.random() * 100),
  };
  return item;
}

function setGroupingEnabled(enabled: boolean, api: GridApi) {
  if (enabled) {
    api.applyColumnState({
      state: [
        { colId: "group", rowGroup: true, hide: true },
        { colId: "symbol", hide: true },
      ],
    });
  } else {
    api.applyColumnState({
      state: [
        { colId: "group", rowGroup: false, hide: false },
        { colId: "symbol", hide: false },
      ],
    });
  }
  setItemVisible("groupingOn", !enabled);
  setItemVisible("groupingOff", enabled);
}

function setItemVisible(id: string, visible: boolean) {
  const element = document.querySelector("#" + id)! as any;
  element.style.display = visible ? "inline" : "none";
}

// creates a unique symbol, eg 'ADG' or 'ZJD'
function createUniqueRandomSymbol() {
  let symbol: any;
  const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let isUnique = false;
  while (!isUnique) {
    symbol = "";
    // create symbol
    for (let i = 0; i < 3; i++) {
      symbol += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    // check uniqueness
    isUnique = true;
    immutableStore.forEach((oldItem) => {
      if (oldItem.symbol === symbol) {
        isUnique = false;
      }
    });
  }
  return symbol;
}

const VueExample = defineComponent({
  template: `
        <div style="height: 100%">
                <div style="height: 100%; width: 100%; display: flex; flex-direction: column">
      <div>
        <div style="margin-bottom: 5px; min-height: 30px">
          <button v-on:click="reverseItems()">Reverse</button>
          <button v-on:click="addFiveItems(true)">Append</button>
          <button v-on:click="addFiveItems(false)">Prepend</button>
          <button v-on:click="removeSelected()">Remove Selected</button>
          <button v-on:click="updatePrices()">Update Prices</button>
        </div>
        <div style="margin-bottom: 5px; min-height: 30px">
          <button id="groupingOn" v-on:click="onGroupingEnabled(true)">Grouping On</button>
          <button id="groupingOff" v-on:click="onGroupingEnabled(false)">Grouping Off</button>
          <button v-on:click="setSelectedToGroup('A')">Move to Group A</button>
          <button v-on:click="setSelectedToGroup('B')">Move to Group B</button>
          <button v-on:click="setSelectedToGroup('C')">Move to Group C</button>
        </div>
      </div>
      <div style="flex: 1 1 0px">
        <ag-grid-vue
          style="width: 100%; height: 100%;"
          @grid-ready="onGridReady"
          :columnDefs="columnDefs"
          :defaultColDef="defaultColDef"
          :rowSelection="rowSelection"
          :cellSelection="true"
          :autoGroupColumnDef="autoGroupColumnDef"
          :statusBar="statusBar"
          :groupDefaultExpanded="groupDefaultExpanded"
          :rowData="rowData"
          :getRowId="getRowId"></ag-grid-vue>
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
      { headerName: "Symbol", field: "symbol" },
      { headerName: "Price", field: "price" },
      { headerName: "Group", field: "group" },
    ]);
    const defaultColDef = ref<ColDef>({
      width: 250,
    });
    const rowSelection = ref<RowSelectionOptions | "single" | "multiple">({
      mode: "multiRow",
    });
    const autoGroupColumnDef = ref<ColDef>({
      headerName: "Symbol",
      cellRenderer: "agGroupCellRenderer",
      field: "symbol",
    });
    const statusBar = ref<{
      statusPanels: StatusPanelDef[];
    }>({
      statusPanels: [{ statusPanel: "agAggregationComponent", align: "right" }],
    });
    const groupDefaultExpanded = ref(1);
    const rowData = ref<any[] | null>(immutableStore);
    const getRowId = ref<GetRowIdFunc>((params: GetRowIdParams) => {
      return params.data.symbol;
    });

    function addFiveItems(append: boolean) {
      const newStore = immutableStore.slice();
      for (let i = 0; i < 5; i++) {
        const newItem = createItem();
        if (append) {
          newStore.push(newItem);
        } else {
          newStore.splice(0, 0, newItem);
        }
      }
      immutableStore = newStore;
      gridApi.value!.setGridOption("rowData", immutableStore);
    }
    function removeSelected() {
      const selectedRowNodes = gridApi.value!.getSelectedNodes();
      const selectedIds = selectedRowNodes.map(function (rowNode) {
        return rowNode.id;
      });
      immutableStore = immutableStore.filter(function (dataItem) {
        return selectedIds.indexOf(dataItem.symbol) < 0;
      });
      gridApi.value!.setGridOption("rowData", immutableStore);
    }
    function setSelectedToGroup(newGroup: string) {
      const selectedRowNodes = gridApi.value!.getSelectedNodes();
      const selectedIds = selectedRowNodes.map(function (rowNode) {
        return rowNode.id;
      });
      immutableStore = immutableStore.map(function (dataItem) {
        const itemSelected = selectedIds.indexOf(dataItem.symbol) >= 0;
        if (itemSelected) {
          return {
            // symbol and price stay the same
            symbol: dataItem.symbol,
            price: dataItem.price,
            // group gets the group
            group: newGroup,
          };
        } else {
          return dataItem;
        }
      });
      gridApi.value!.setGridOption("rowData", immutableStore);
    }
    function updatePrices() {
      const newStore: any[] = [];
      immutableStore.forEach((item) => {
        newStore.push({
          // use same symbol as last time, this is the unique id
          symbol: item.symbol,
          // group also stays the same
          group: item.group,
          // add random price
          price: Math.floor(Math.random() * 100),
        });
      });
      immutableStore = newStore;
      gridApi.value!.setGridOption("rowData", immutableStore);
    }
    function onGroupingEnabled(enabled: boolean) {
      setGroupingEnabled(enabled, gridApi.value!);
    }
    function reverseItems() {
      immutableStore.reverse();
      gridApi.value!.setGridOption("rowData", immutableStore);
    }
    const onGridReady = (params: GridReadyEvent) => {
      gridApi.value = params.api;

      immutableStore = [];
      immutableStore = getInitialData();
      params.api.setGridOption("rowData", immutableStore);
      setGroupingEnabled(false, params.api);
    };

    return {
      gridApi,
      columnDefs,
      defaultColDef,
      rowSelection,
      autoGroupColumnDef,
      statusBar,
      groupDefaultExpanded,
      rowData,
      getRowId,
      onGridReady,
      addFiveItems,
      removeSelected,
      setSelectedToGroup,
      updatePrices,
      onGroupingEnabled,
      reverseItems,
    };
  },
});

createApp(VueExample).mount("#app");
