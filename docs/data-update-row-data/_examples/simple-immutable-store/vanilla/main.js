function getInitialData() {
  const data = [];
  for (let i = 0; i < 5; i++) {
    data.push(createItem());
  }

  return data;
}

let immutableStore = [];

function addFiveItems(append) {
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
  gridApi.setGridOption("rowData", immutableStore);
}

function removeSelected() {
  const selectedRowNodes = gridApi.getSelectedNodes();
  const selectedIds = selectedRowNodes.map(function (rowNode) {
    return rowNode.id;
  });
  immutableStore = immutableStore.filter(function (dataItem) {
    return selectedIds.indexOf(dataItem.symbol) < 0;
  });
  gridApi.setGridOption("rowData", immutableStore);
}

function setSelectedToGroup(newGroup) {
  const selectedRowNodes = gridApi.getSelectedNodes();
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
  gridApi.setGridOption("rowData", immutableStore);
}

function updatePrices() {
  const newStore = [];
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
  gridApi.setGridOption("rowData", immutableStore);
}

function filter(list, callback) {
  const filteredList = [];
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

function onGroupingEnabled(enabled) {
  setGroupingEnabled(enabled, gridApi);
}

function setGroupingEnabled(enabled, api) {
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

function setItemVisible(id, visible) {
  const element = document.querySelector("#" + id);
  element.style.display = visible ? "inline" : "none";
}

// creates a unique symbol, eg 'ADG' or 'ZJD'
function createUniqueRandomSymbol() {
  let symbol;
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

function reverseItems() {
  immutableStore.reverse();
  gridApi.setGridOption("rowData", immutableStore);
}

let gridApi;

const gridOptions = {
  columnDefs: [
    { headerName: "Symbol", field: "symbol" },
    { headerName: "Price", field: "price" },
    { headerName: "Group", field: "group" },
  ],
  defaultColDef: {
    width: 250,
  },
  rowSelection: {
    mode: "multiRow",
  },
  cellSelection: true,
  autoGroupColumnDef: {
    headerName: "Symbol",
    cellRenderer: "agGroupCellRenderer",
    field: "symbol",
  },
  statusBar: {
    statusPanels: [{ statusPanel: "agAggregationComponent", align: "right" }],
  },
  groupDefaultExpanded: 1,
  rowData: immutableStore,
  getRowId: (params) => {
    return params.data.symbol;
  },
  onGridReady: (params) => {
    immutableStore = [];
    immutableStore = getInitialData();
    params.api.setGridOption("rowData", immutableStore);
    setGroupingEnabled(false, params.api);
  },
};

// after page is loaded, create the grid.
document.addEventListener("DOMContentLoaded", function () {
  const eGridDiv = document.querySelector("#myGrid");
  gridApi = agGrid.createGrid(eGridDiv, gridOptions);
});
