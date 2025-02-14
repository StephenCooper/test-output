let editableYear = 2012;

function isCellEditable(params) {
  return params.data.year === editableYear;
}

let gridApi;

const gridOptions = {
  columnDefs: [
    { field: "athlete", type: "editableColumn" },
    { field: "age", type: "editableColumn" },
    { field: "year" },
    { field: "country" },
    { field: "sport" },
    { field: "total" },
  ],
  columnTypes: {
    editableColumn: {
      editable: (params) => {
        return isCellEditable(params);
      },
      cellStyle: (params) => {
        if (isCellEditable(params)) {
          return { backgroundColor: "#2244CC44" };
        }
      },
    },
  },
};

function setEditableYear(year) {
  editableYear = year;
  // Redraw to re-apply the new cell style
  gridApi.redrawRows();
}

// setup the grid after the page has finished loading
document.addEventListener("DOMContentLoaded", () => {
  const gridDiv = document.querySelector("#myGrid");
  gridApi = agGrid.createGrid(gridDiv, gridOptions);

  fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
    .then((response) => response.json())
    .then((data) => gridApi.setGridOption("rowData", data));
});
