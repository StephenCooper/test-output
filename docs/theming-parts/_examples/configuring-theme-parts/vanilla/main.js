const baseThemes = {
  quartz: agGrid.themeQuartz,
  balham: agGrid.themeBalham,
  alpine: agGrid.themeAlpine,
};
let baseTheme = agGrid.themeQuartz;

const colorSchemes = {
  light: agGrid.colorSchemeLight,
  lightCold: agGrid.colorSchemeLightCold,
  lightWarm: agGrid.colorSchemeLightWarm,
  dark: agGrid.colorSchemeDark,
  darkWarm: agGrid.colorSchemeDarkWarm,
  darkBlue: agGrid.colorSchemeDarkBlue,
};
let colorScheme = null;

const iconSets = {
  quartzLight: agGrid.iconSetQuartzLight,
  quartzRegular: agGrid.iconSetQuartzRegular,
  quartzBold: agGrid.iconSetQuartzBold,
  alpine: agGrid.iconSetAlpine,
  material: agGrid.iconSetMaterial,
};
let iconSet = null;

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
  theme: buildTheme(),
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
  baseTheme = baseThemes[id];
  gridApi.setGridOption("theme", buildTheme());
}

function setIconSet(id) {
  iconSet = iconSets[id] || null;
  gridApi.setGridOption("theme", buildTheme());
}

function setColorScheme(id) {
  colorScheme = colorSchemes[id] || null;
  gridApi.setGridOption("theme", buildTheme());
}

function buildTheme() {
  let theme = baseTheme;
  if (iconSet) {
    theme = theme.withPart(iconSet);
  }
  if (colorScheme) {
    theme = theme.withPart(colorScheme);
  }
  return theme;
}
