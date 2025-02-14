const columnDefs = [
  {
    headerName: "Date Editor",
    field: "date",
    valueFormatter: (params) => {
      if (!params.value) {
        return "";
      }
      const month = params.value.getMonth() + 1;
      const day = params.value.getDate();
      return `${params.value.getFullYear()}-${month < 10 ? "0" + month : month}-${day < 10 ? "0" + day : day}`;
    },
    cellEditor: "agDateCellEditor",
  },
];

const data = Array.from(Array(20).keys()).map((val, index) => ({
  date: new Date(2023, 5, index + 1),
}));

let gridApi;

const gridOptions = {
  defaultColDef: {
    width: 200,
    editable: true,
  },
  columnDefs: columnDefs,
  rowData: data,
};

// setup the grid after the page has finished loading
document.addEventListener("DOMContentLoaded", () => {
  const gridDiv = document.querySelector("#myGrid");
  gridApi = agGrid.createGrid(gridDiv, gridOptions);
});
