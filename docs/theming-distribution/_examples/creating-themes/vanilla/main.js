const myCustomTheme = agGrid
  .createTheme()
  // add just the parts you want
  .withPart(agGrid.iconSetMaterial)
  .withPart(agGrid.colorSchemeVariable)
  // set default param values
  .withParams({
    accentColor: "red",
    iconSize: 18,
  });

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

const gridOptions = {
  theme: myCustomTheme,
  columnDefs,
  rowData,
  defaultColDef: {
    editable: true,
    flex: 1,
    minWidth: 100,
    filter: true,
  },
  rowSelection: { mode: "multiRow", checkboxes: true },
};

agGrid.createGrid(document.querySelector("#myGrid"), gridOptions);
