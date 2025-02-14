let rowIdSequence = 100;

const leftColumnDefs = [
  { field: "id", dndSource: true },
  { field: "color" },
  { field: "value1" },
  { field: "value2" },
];

const rightColumnDefs = [
  { field: "id", dndSource: true },
  { field: "color" },
  { field: "value1" },
  { field: "value2" },
];

let leftApi;
const leftGridOptions = {
  defaultColDef: {
    flex: 1,
    filter: true,
  },
  rowClassRules: {
    "red-row": 'data.color == "Red"',
    "green-row": 'data.color == "Green"',
    "blue-row": 'data.color == "Blue"',
  },
  getRowId: (params) => {
    return String(params.data.id);
  },
  rowData: createLeftRowData(),
  rowDragManaged: true,
  columnDefs: leftColumnDefs,
};

let rightApi;
const rightGridOptions = {
  defaultColDef: {
    flex: 1,
    filter: true,
  },
  rowClassRules: {
    "red-row": 'data.color == "Red"',
    "green-row": 'data.color == "Green"',
    "blue-row": 'data.color == "Blue"',
  },
  getRowId: (params) => {
    return String(params.data.id);
  },
  rowData: [],
  rowDragManaged: true,
  columnDefs: rightColumnDefs,
};

function createLeftRowData() {
  return ["Red", "Green", "Blue"].map(function (color) {
    return createDataItem(color);
  });
}

function createDataItem(color) {
  return {
    id: rowIdSequence++,
    color: color,
    value1: Math.floor(Math.random() * 100),
    value2: Math.floor(Math.random() * 100),
  };
}

function binDragOver(event) {
  const dragSupported = event.dataTransfer.types.length;

  if (dragSupported) {
    event.dataTransfer.dropEffect = "move";
    event.preventDefault();
  }
}

function binDrop(event) {
  event.preventDefault();

  const jsonData = event.dataTransfer.getData("application/json");
  const data = JSON.parse(jsonData);

  // if data missing or data has no id, do nothing
  if (!data || data.id == null) {
    return;
  }

  const transaction = {
    remove: [data],
  };

  const rowIsInLeftGrid = !!leftApi.getRowNode(data.id);
  if (rowIsInLeftGrid) {
    leftApi.applyTransaction(transaction);
  }

  const rowIsInRightGrid = !!rightApi.getRowNode(data.id);
  if (rowIsInRightGrid) {
    rightApi.applyTransaction(transaction);
  }
}

function dragStart(event, color) {
  const newItem = createDataItem(color);
  const jsonData = JSON.stringify(newItem);

  event.dataTransfer.setData("application/json", jsonData);
}

function gridDragOver(event) {
  const dragSupported = event.dataTransfer.types.length;

  if (dragSupported) {
    event.dataTransfer.dropEffect = "copy";
    event.preventDefault();
  }
}

function gridDrop(event, grid) {
  event.preventDefault();

  const jsonData = event.dataTransfer.getData("application/json");
  const data = JSON.parse(jsonData);

  // if data missing or data has no it, do nothing
  if (!data || data.id == null) {
    return;
  }

  const gridApi = grid == "left" ? leftApi : rightApi;

  // do nothing if row is already in the grid, otherwise we would have duplicates
  const rowAlreadyInGrid = !!gridApi.getRowNode(data.id);
  if (rowAlreadyInGrid) {
    console.log("not adding row to avoid duplicates in the grid");
    return;
  }

  const transaction = {
    add: [data],
  };
  gridApi.applyTransaction(transaction);
}

const leftGridDiv = document.querySelector("#eLeftGrid");
leftApi = agGrid.createGrid(leftGridDiv, leftGridOptions);

const rightGridDiv = document.querySelector("#eRightGrid");
rightApi = agGrid.createGrid(rightGridDiv, rightGridOptions);

if (typeof window !== "undefined") {
  // Attach external event handlers to window so they can be called from index.html
  window.binDragOver = binDragOver;
  window.binDrop = binDrop;
  window.dragStart = dragStart;
  window.gridDragOver = gridDragOver;
  window.gridDrop = gridDrop;
}
