const columnDefs = [
  {
    headerName: "Color (Column as String Type)",
    field: "color",
    width: 250,
    cellEditor: "agRichSelectCellEditor",
    cellEditorParams: {
      formatValue: (v) => v.name,
      parseValue: (v) => v.name,
      values: colors,
      searchType: "matchAny",
      allowTyping: true,
      filterList: true,
      valueListMaxHeight: 220,
    },
  },
  {
    headerName: "Color (Column as Complex Object)",
    field: "detailedColor",
    width: 290,
    valueFormatter: (p) => `${p.value.name} (${p.value.code})`,
    valueParser: (p) => p.newValue,
    cellEditor: "agRichSelectCellEditor",
    cellEditorParams: {
      formatValue: (v) => v.name,
      values: colors,
      searchType: "matchAny",
      allowTyping: true,
      filterList: true,
      valueListMaxHeight: 220,
    },
  },
];

let gridApi;

const gridOptions = {
  defaultColDef: {
    width: 200,
    editable: true,
  },
  columnDefs: columnDefs,
  rowData: colors.map((v) => ({ color: v.name, detailedColor: v })),
};

// setup the grid after the page has finished loading
document.addEventListener("DOMContentLoaded", () => {
  const gridDiv = document.querySelector("#myGrid");
  gridApi = agGrid.createGrid(gridDiv, gridOptions);
});
