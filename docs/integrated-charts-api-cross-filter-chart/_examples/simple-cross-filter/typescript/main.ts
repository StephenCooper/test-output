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
  ValidationModule /* Development Only */,
]);

let gridApi: GridApi;

const gridOptions: GridOptions = {
  columnDefs: [
    { field: "salesRep", chartDataType: "category" },
    { field: "handset", chartDataType: "category" },
    { field: "sale", chartDataType: "series" },
    { field: "saleDate", chartDataType: "category" },
  ],
  defaultColDef: {
    flex: 1,
    filter: "agSetColumnFilter",
    floatingFilter: true,
  },
  enableCharts: true,
  onGridReady: (params: GridReadyEvent) => {
    getData().then((rowData) => params.api.setGridOption("rowData", rowData));
  },
  onFirstDataRendered,
};

function onFirstDataRendered(params: FirstDataRenderedEvent) {
  params.api.createCrossFilterChart({
    chartType: "pie",
    cellRange: {
      columns: ["salesRep", "sale"],
    },
    aggFunc: "sum",
    chartThemeOverrides: {
      common: {
        title: {
          enabled: true,
          text: "Sales by Representative ($)",
        },
      },
      pie: {
        series: {
          title: {
            enabled: false,
          },
          calloutLabel: {
            enabled: false,
          },
        },
        legend: {
          position: "right",
        },
      },
    },
    chartContainer: document.querySelector("#pieChart") as any,
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
