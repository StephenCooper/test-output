const myTheme = agGrid.themeQuartz
  .withParams(
    {
      backgroundColor: "#FFE8E0",
      foregroundColor: "#361008CC",
      browserColorScheme: "light",
    },
    "light-red",
  )
  .withParams(
    {
      backgroundColor: "#201008",
      foregroundColor: "#FFFFFFCC",
      browserColorScheme: "dark",
    },
    "dark-red",
  );

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
  flex: 1,
  minWidth: 100,
  filter: true,
  enableValue: true,
  enableRowGroup: true,
  enablePivot: true,
};

const gridOptions = {
  theme: myTheme,
  columnDefs,
  rowData,
  defaultColDef,
  sideBar: true,
};

const gridApi = agGrid.createGrid(
  document.querySelector("#myGrid"),
  gridOptions,
);

function setDarkMode(enabled) {
  document.body.dataset.agThemeMode = enabled ? "dark-red" : "light-red";
}
setDarkMode(false);
