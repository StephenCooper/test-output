const filterParams = {
  comparator: (a, b) => {
    const valA = a == null ? 0 : parseInt(a);
    const valB = b == null ? 0 : parseInt(b);
    if (valA === valB) return 0;
    return valA > valB ? 1 : -1;
  },
};

let gridApi;

const gridOptions = {
  columnDefs: [
    {
      headerName: "Age (No Comparator)",
      field: "age",
      filter: "agSetColumnFilter",
    },
    {
      headerName: "Age (With Comparator)",
      field: "age",
      filter: "agSetColumnFilter",
      filterParams: filterParams,
    },
  ],
  defaultColDef: {
    flex: 1,
    filter: true,
    cellDataType: false,
  },
  rowData: getRowData(),
  sideBar: "filters",
  onGridReady: (params) => {
    params.api.getToolPanelInstance("filters").expandFilters();
  },
};

function getRowData() {
  const rows = [];
  for (let i = 1; i < 117; i++) {
    rows.push({ age: i });
  }
  return rows;
}

// setup the grid after the page has finished loading
document.addEventListener("DOMContentLoaded", function () {
  const gridDiv = document.querySelector("#myGrid");
  gridApi = agGrid.createGrid(gridDiv, gridOptions);
});
