const columnDefs = [
  {
    headerName: "Number Editor",
    field: "number",
    cellEditor: "agNumberCellEditor",
    cellEditorParams: {
      precision: 0,
    },
  },
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
  {
    headerName: "Date as String Editor",
    field: "dateString",
    cellEditor: "agDateStringCellEditor",
  },
  {
    headerName: "Checkbox Cell Editor",
    field: "boolean",
    cellEditor: "agCheckboxCellEditor",
  },
];

const data = Array.from(Array(20).keys()).map((val, index) => ({
  number: index,

  date: new Date(2023, 5, index + 1),
  dateString: `2023-06-${index < 9 ? "0" + (index + 1) : index + 1}`,
  boolean: !!(index % 2),
}));

let gridApi;

const gridOptions = {
  defaultColDef: {
    flex: 1,
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
