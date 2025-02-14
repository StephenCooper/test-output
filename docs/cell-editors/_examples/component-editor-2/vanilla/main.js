const columnDefs = [
  { field: "first_name", headerName: "Provided Text" },
  {
    field: "last_name",
    headerName: "Custom Text",
    cellEditor: SimpleTextEditor,
  },
  {
    field: "age",
    headerName: "Provided Number",
    cellEditor: "agNumberCellEditor",
  },
  {
    field: "gender",
    headerName: "Provided Rich Select",
    cellRenderer: GenderRenderer,
    cellEditor: "agRichSelectCellEditor",
    cellEditorParams: {
      cellRenderer: GenderRenderer,
      values: ["Male", "Female"],
    },
  },
  {
    field: "mood",
    headerName: "Custom Mood",
    cellRenderer: MoodRenderer,
    cellEditor: MoodEditor,
    cellEditorPopup: true,
  },
];

let gridApi;

const gridOptions = {
  columnDefs: columnDefs,
  rowData: getData(),
  defaultColDef: {
    editable: true,
    flex: 1,
    minWidth: 100,
  },
};

// setup the grid after the page has finished loading
document.addEventListener("DOMContentLoaded", () => {
  const gridDiv = document.querySelector("#myGrid");
  gridApi = agGrid.createGrid(gridDiv, gridOptions);
});
