const columnDefs = [
  {
    field: "mood",
    headerName: "Inline",
    cellRenderer: MoodRenderer,
    cellEditor: MoodEditor,
  },
  {
    field: "mood",
    headerName: "Popup Over",
    cellRenderer: MoodRenderer,
    cellEditor: MoodEditor,
    cellEditorPopup: true,
  },
  {
    field: "mood",
    headerName: "Popup Under",
    cellRenderer: MoodRenderer,
    cellEditor: MoodEditor,
    cellEditorPopup: true,
    cellEditorPopupPosition: "under",
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
