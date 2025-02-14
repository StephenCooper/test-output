const columnDefs = [
  {
    field: "athlete",
  },
  {
    field: "country",
    filter: "agTextColumnFilter",
    filterParams: {
      filterPlaceholder: "Country...",
    },
  },
  {
    field: "sport",
    filter: "agTextColumnFilter",
    filterParams: {
      filterPlaceholder: (params) => {
        const { filterOptionKey, placeholder } = params;
        return `${filterOptionKey} - ${placeholder}`;
      },
    },
  },
  {
    field: "total",
    filter: "agNumberColumnFilter",
    filterParams: {
      filterPlaceholder: (params) => {
        const { filterOption } = params;
        return `${filterOption} total`;
      },
    },
  },
];

let gridApi;

const gridOptions = {
  defaultColDef: {
    flex: 1,
    filter: true,
  },
  columnDefs: columnDefs,
};

// setup the grid after the page has finished loading
document.addEventListener("DOMContentLoaded", function () {
  const gridDiv = document.querySelector("#myGrid");
  gridApi = agGrid.createGrid(gridDiv, gridOptions);

  fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
    .then((response) => response.json())
    .then((data) => gridApi.setGridOption("rowData", data));
});
