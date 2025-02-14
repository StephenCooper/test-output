const list1 = ["Elephant", "Lion", "Monkey"];
const list2 = ["Elephant", "Giraffe", "Tiger"];

const valuesArray = list1.slice();
let valuesCallbackList = list1;

function valuesCallback(params) {
  setTimeout(() => {
    params.success(valuesCallbackList);
  }, 1000);
}

const arrayFilterParams = {
  values: valuesArray,
};

const callbackFilterParams = {
  values: valuesCallback,
  refreshValuesOnOpen: true,
};

let gridApi;

const gridOptions = {
  columnDefs: [
    {
      colId: "array",
      headerName: "Values Array",
      field: "animal",
      filter: "agSetColumnFilter",
      filterParams: arrayFilterParams,
    },
    {
      colId: "callback",
      headerName: "Values Callback",
      field: "animal",
      filter: "agSetColumnFilter",
      filterParams: callbackFilterParams,
    },
  ],
  defaultColDef: {
    flex: 1,
    filter: true,
  },
  sideBar: "filters",
  rowData: getData(),
  onFirstDataRendered: onFirstDataRendered,
};

function onFirstDataRendered(params) {
  params.api.getToolPanelInstance("filters").expandFilters();
}

function useList1() {
  console.log("Updating values to " + list1);
  valuesArray.length = 0;
  list1.forEach((value) => {
    valuesArray.push(value);
  });

  gridApi.getColumnFilterInstance("array").then((filter) => {
    filter.refreshFilterValues();

    valuesCallbackList = list1;
  });
}

function useList2() {
  console.log("Updating values to " + list2);
  valuesArray.length = 0;
  list2.forEach((value) => {
    valuesArray.push(value);
  });

  gridApi.getColumnFilterInstance("array").then((filter) => {
    filter.refreshFilterValues();

    valuesCallbackList = list2;
  });
}

// setup the grid after the page has finished loading
document.addEventListener("DOMContentLoaded", function () {
  const gridDiv = document.querySelector("#myGrid");
  gridApi = agGrid.createGrid(gridDiv, gridOptions);
});
