import { AgChartsCommunityModule } from "ag-charts-community";
import {
  ClientSideRowModelApiModule,
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  GridApi,
  GridOptions,
  ModuleRegistry,
  ValidationModule,
  createGrid,
} from "ag-grid-community";
import { SparklinesModule } from "ag-grid-enterprise";
import { getData } from "./data";

ModuleRegistry.registerModules([
  ClientSideRowModelApiModule,
  ClientSideRowModelModule,
  SparklinesModule.with(AgChartsCommunityModule),
  ValidationModule /* Development Only */,
]);

let gridApi: GridApi;

const gridOptions: GridOptions = {
  columnDefs: [
    { field: "symbol", maxWidth: 120 },
    { field: "name", minWidth: 250 },
    {
      field: "change",
      cellRenderer: "agSparklineCellRenderer",
    },
    {
      field: "volume",

      maxWidth: 140,
    },
  ],
  defaultColDef: {
    flex: 1,
    minWidth: 100,
  },
  rowData: getData(),
  rowHeight: 50,
};

let intervalId: any;

function start() {
  if (intervalId) {
    return;
  }

  const updateData = () => {
    const itemsToUpdate: any[] = [];
    gridApi!.forEachNodeAfterFilterAndSort(function (rowNode) {
      const data = rowNode.data;
      if (!data) {
        return;
      }
      const n = data.change.length;
      const v =
        Math.random() > 0.5 ? Number(Math.random()) : -Number(Math.random());
      data.change = [...data.change.slice(1, n), v];
      itemsToUpdate.push(data);
    });
    gridApi!.applyTransaction({ update: itemsToUpdate });
  };

  intervalId = setInterval(updateData, 300);
}

function stop() {
  if (intervalId === undefined) {
    return;
  }
  clearInterval(intervalId);
  intervalId = undefined;
}

// setup the grid after the page has finished loading

const gridDiv = document.querySelector<HTMLElement>("#myGrid")!;
gridApi = createGrid(gridDiv, gridOptions);

if (typeof window !== "undefined") {
  // Attach external event handlers to window so they can be called from index.html
  (<any>window).start = start;
  (<any>window).stop = stop;
} /** DARK INTEGRATED START **/
const isInitialModeDark =
  document.documentElement.dataset.agThemeMode?.includes("dark");

// update chart themes based on dark mode status
const updateChartThemes = (isDark: boolean): void => {
  const themes: string[] = [
    "ag-default",
    "ag-material",
    "ag-sheets",
    "ag-polychroma",
    "ag-vivid",
  ];
  const currentThemes = gridApi.getGridOption("chartThemes");
  const customTheme =
    currentThemes &&
    currentThemes.some((theme) => theme.startsWith("my-custom-theme"));

  let modifiedThemes: string[] = customTheme
    ? isDark
      ? ["my-custom-theme-dark", "my-custom-theme-light"]
      : ["my-custom-theme-light", "my-custom-theme-dark"]
    : Array.from(
        new Set(themes.map((theme) => theme + (isDark ? "-dark" : ""))),
      );

  // updating the 'chartThemes' grid option will cause the chart to reactively update!
  gridApi.setGridOption("chartThemes", modifiedThemes);
};

// update chart themes when example first loads
let initialSet = false;
const maxTries = 5;
let tries = 0;
const trySetInitial = (delay) => {
  if (gridApi) {
    initialSet = true;
    updateChartThemes(isInitialModeDark);
  } else {
    if (tries < maxTries) {
      setTimeout(() => trySetInitial(), 250);
      tries++;
    }
  }
};
trySetInitial(0);

interface ColorSchemeChangeEventDetail {
  darkMode: boolean;
}

// event handler for color scheme changes
const handleColorSchemeChange = (
  event: CustomEvent<ColorSchemeChangeEventDetail>,
): void => {
  const { darkMode } = event.detail;
  updateChartThemes(darkMode);
};

// listen for user-triggered dark mode changes (not removing listener is fine here!)
document.addEventListener(
  "color-scheme-change",
  handleColorSchemeChange as EventListener,
);
/** DARK INTEGRATED END **/
