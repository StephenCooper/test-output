import { AgChartsEnterpriseModule } from "ag-charts-enterprise";
import {
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  FirstDataRenderedEvent,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ModuleRegistry,
  NumberEditorModule,
  TextEditorModule,
  TextFilterModule,
  ValidationModule,
  createGrid,
} from "ag-grid-community";
import {
  ColumnMenuModule,
  ColumnsToolPanelModule,
  ContextMenuModule,
  FiltersToolPanelModule,
  IntegratedChartsModule,
  MultiFilterModule,
  RowGroupingModule,
  SetFilterModule,
} from "ag-grid-enterprise";
import { getData } from "./data";

ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  IntegratedChartsModule.with(AgChartsEnterpriseModule),
  ColumnsToolPanelModule,
  FiltersToolPanelModule,
  ColumnMenuModule,
  ContextMenuModule,
  MultiFilterModule,
  SetFilterModule,
  RowGroupingModule,
  TextFilterModule,
  TextEditorModule,
  NumberEditorModule,
  ValidationModule /* Development Only */,
]);

let gridApi: GridApi;

const gridOptions: GridOptions = {
  columnDefs: [
    { field: "city", chartDataType: "category" },
    { field: "country", chartDataType: "category" },
    { field: "longitude", chartDataType: "series" },
    { field: "latitude", chartDataType: "series" },
    { field: "population", chartDataType: "series" },
  ],
  defaultColDef: {
    flex: 1,
    editable: true,
    filter: "agMultiColumnFilter",
    floatingFilter: true,
  },
  enableCharts: true,
  onGridReady: (params: GridReadyEvent) => {
    getData().then((rowData) => params.api.setGridOption("rowData", rowData));
  },
  onFirstDataRendered,
};

function onFirstDataRendered(params: FirstDataRenderedEvent) {
  createColumnChart(params.api);
  createBubbleChart(params.api);
}

function createColumnChart(api: GridApi) {
  api.createCrossFilterChart({
    chartType: "column",
    cellRange: {
      columns: ["country", "population"],
    },
    aggFunc: "count",
    chartThemeOverrides: {
      common: {
        title: {
          enabled: true,
          text: "Number of Most Populous Cities by Country",
        },
        legend: {
          enabled: false,
        },
      },
      bar: {
        axes: {
          category: {
            label: {
              rotation: 325,
            },
          },
        },
      },
    },
    chartContainer: document.querySelector("#barChart") as any,
  });
}

function createBubbleChart(api: GridApi) {
  api.createCrossFilterChart({
    chartType: "bubble",
    cellRange: {
      columns: ["longitude", "latitude", "population"],
    },
    chartThemeOverrides: {
      common: {
        title: {
          enabled: true,
          text: "Latitude vs Longitude of Most Populous Cities",
        },
        legend: {
          enabled: false,
        },
      },
    },
    chartContainer: document.querySelector("#bubbleChart") as any,
  });
}

// setup the grid after the page has finished loading
gridApi = createGrid(
  document.querySelector<HTMLElement>("#myGrid")!,
  gridOptions,
);
/** DARK INTEGRATED START **/
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
