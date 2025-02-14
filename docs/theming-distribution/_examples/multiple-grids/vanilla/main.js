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

const createThemedGrid = (theme, selector) => {
  const gridOptions = {
    theme,
    columnDefs,
    rowData,
    defaultColDef: {
      editable: true,
      flex: 1,
      minWidth: 100,
      filter: true,
    },
  };
  agGrid.createGrid(document.querySelector(selector), gridOptions);
};

createThemedGrid(agGrid.themeQuartz, "#grid1");
createThemedGrid(agGrid.themeAlpine, "#grid2");
createThemedGrid(agGrid.themeBalham, "#grid3");
createThemedGrid(agGrid.themeBalham, "#grid4");
