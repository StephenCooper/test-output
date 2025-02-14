const themes = {
  quartz: agGrid.themeQuartz,
  material: agGrid.themeMaterial,
  balham: agGrid.themeBalham,
  alpine: agGrid.themeAlpine,
};
const theme = agGrid.themeQuartz;

const columnDefs = [{ field: "make" }, { field: "model" }, { field: "price" }];

const rowData = (() => {
  const rowData = [];
  for (let i = 0; i < 10; i++) {
    rowData.push({ make: "Toyota", model: "Celica", price: 35000 + i * 1000 });
    rowData.push({ make: "Ford", model: "Mondeo", price: 32000 + i * 1000 });
    rowData.push({
      make: "Porsche",
      model: "Boxster",
      price: 72000 + i * 1000,
    });
  }
  return rowData;
})();

const defaultColDef = {
  editable: true,
  flex: 1,
  minWidth: 100,
  filter: true,
  enableRowGroup: true,
  enablePivot: true,
  enableValue: true,
};

const gridOptions = {
  theme: theme,
  columnDefs,
  rowData,
  defaultColDef,
  sideBar: true,
};

const gridApi = agGrid.createGrid(
  document.querySelector("#myGrid"),
  gridOptions,
);

function setBaseTheme(id) {
  gridApi.setGridOption("theme", themes[id]);
}
