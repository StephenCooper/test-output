let gridApi;

const gridOptions = {
  columnDefs: [
    { headerName: "Student ID", field: "student" },
    { headerName: "Year Group", field: "yearGroup", rowGroup: true },
    { headerName: "Age", field: "age" },
    { headerName: "Course", field: "course", pivot: true },
    {
      headerName: "Age Range",
      valueGetter: ageRangeValueGetter,
      pivot: true,
    },
    { headerName: "Points", field: "points", aggFunc: "sum" },
  ],
  defaultColDef: {
    flex: 1,
    minWidth: 150,
    cellRenderer: "agAnimateShowChangeCellRenderer",
  },
  rowData: getRowData(),
  pivotMode: true,
  groupDefaultExpanded: 1,
  getRowId: (params) => String(params.data.student),
  onGridReady: (params) => {
    document.getElementById("pivot-mode").checked = true;
  },
};

function ageRangeValueGetter(params) {
  const age = params.getValue("age");
  if (age === undefined) {
    return null;
  }
  if (age < 20) {
    return "< 20";
  } else if (age > 30) {
    return "> 30";
  } else {
    return "20 to 30";
  }
}

// pretty basic, but deterministic (so same numbers each time we run), random number generator
var seed;
function random() {
  seed = ((seed || 1) * 16807) % 2147483647;
  return seed;
}

function getRowData() {
  const rowData = [];
  for (let i = 1; i <= 100; i++) {
    const row = createRow();
    rowData.push(row);
  }
  return rowData;
}

var studentId;
function createRow() {
  studentId = studentId ? studentId : 10023;
  const randomNumber = random();
  return {
    student: studentId++,
    points: (randomNumber % 60) + 40,
    course: ["Science", "History"][randomNumber % 3 === 0 ? 0 : 1],
    yearGroup: "Year " + ((randomNumber % 4) + 1), // 'Year 1' to 'Year 4'
    age: (randomNumber % 25) + 15, // 15 to 40
  };
}

function pivotMode() {
  const pivotModeOn = document.getElementById("pivot-mode").checked;

  gridApi.setGridOption("pivotMode", pivotModeOn);

  gridApi.applyColumnState({
    state: [
      { colId: "yearGroup", rowGroup: pivotModeOn },
      { colId: "course", pivot: pivotModeOn, pivotIndex: 1 },
      { colId: "ageRange", pivot: pivotModeOn, pivotIndex: 0 },
    ],
  });
}

function updateOneRecord() {
  const rowNodeToUpdate = pickExistingRowNodeAtRandom(gridApi);
  if (!rowNodeToUpdate) return;

  const randomValue = createNewRandomScore(rowNodeToUpdate.data);
  console.log(
    "updating points to " + randomValue + " on ",
    rowNodeToUpdate.data,
  );
  rowNodeToUpdate.setDataValue("points", randomValue);
}

function createNewRandomScore(data) {
  let randomValue = createRandomNumber();
  // make sure random number is not actually the same number again
  while (randomValue === data.points) {
    randomValue = createRandomNumber();
  }
  return randomValue;
}

function createRandomNumber() {
  return Math.floor(Math.random() * 100);
}

function pickExistingRowNodeAtRandom(api) {
  const allItems = [];
  api.forEachLeafNode(function (rowNode) {
    allItems.push(rowNode);
  });

  if (allItems.length === 0) {
    return;
  }
  const result = allItems[Math.floor(Math.random() * allItems.length)];

  return result;
}

function pickExistingRowItemAtRandom(api) {
  const rowNode = pickExistingRowNodeAtRandom(api);
  return rowNode ? rowNode.data : null;
}

function updateUsingTransaction() {
  const itemToUpdate = pickExistingRowItemAtRandom(gridApi);
  if (!itemToUpdate) {
    return;
  }

  console.log("updating - before", itemToUpdate);
  itemToUpdate.points = createNewRandomScore(itemToUpdate);
  const transaction = {
    update: [itemToUpdate],
  };
  console.log("updating - after", itemToUpdate);
  gridApi.applyTransaction(transaction);
}

function addNewGroupUsingTransaction() {
  const item1 = createRow();
  const item2 = createRow();
  item1.yearGroup = "Year 5";
  item2.yearGroup = "Year 5";
  const transaction = {
    add: [item1, item2],
  };
  console.log("add - ", item1);
  console.log("add - ", item2);
  gridApi.applyTransaction(transaction);
}

function addNewCourse() {
  const item1 = createRow();
  item1.course = "Physics";
  const transaction = {
    add: [item1],
  };
  console.log("add - ", item1);
  gridApi.applyTransaction(transaction);
}

function removePhysics() {
  const allPhysics = [];
  gridApi.forEachLeafNode(function (rowNode) {
    if (rowNode.data.course === "Physics") {
      allPhysics.push(rowNode.data);
    }
  });
  const transaction = {
    remove: allPhysics,
  };
  console.log("removing " + allPhysics.length + " physics items.");
  gridApi.applyTransaction(transaction);
}

function moveCourse() {
  const item = pickExistingRowItemAtRandom(gridApi);
  if (!item) {
    return;
  }
  item.course = item.course === "History" ? "Science" : "History";
  const transaction = {
    update: [item],
  };
  console.log("moving ", item);
  gridApi.applyTransaction(transaction);
}

// setup the grid after the page has finished loading
document.addEventListener("DOMContentLoaded", function () {
  const gridDiv = document.querySelector("#myGrid");
  gridApi = agGrid.createGrid(gridDiv, gridOptions);
});
