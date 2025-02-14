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
};

const createThemedGrid = (colorScheme, selector) => {
  const gridOptions = {
    theme: agGrid.themeQuartz.withPart(colorScheme),
    columnDefs,
    rowData,
    defaultColDef,
  };
  agGrid.createGrid(document.querySelector(selector), gridOptions);
};

createThemedGrid(agGrid.colorSchemeLightWarm, "#grid1");
createThemedGrid(agGrid.colorSchemeLightCold, "#grid2");
createThemedGrid(agGrid.colorSchemeDarkWarm, "#grid3");
createThemedGrid(agGrid.colorSchemeDarkBlue, "#grid4");
