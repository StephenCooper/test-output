import { AgChartsEnterpriseModule } from "ag-charts-enterprise";
import {
  AgChartThemeOverrides,
  CellSelectionOptions,
  ChartToolPanelsDef,
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  ColumnApiModule,
  FirstDataRenderedEvent,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ModuleRegistry,
  ValidationModule,
  ValueFormatterParams,
  createGrid,
} from "ag-grid-community";
import {
  ColumnMenuModule,
  ContextMenuModule,
  IntegratedChartsModule,
  RowGroupingModule,
} from "ag-grid-enterprise";
import { getData } from "./data";

ModuleRegistry.registerModules([
  ColumnApiModule,
  ClientSideRowModelModule,
  IntegratedChartsModule.with(AgChartsEnterpriseModule),
  ColumnMenuModule,
  ContextMenuModule,
  RowGroupingModule,
  ValidationModule /* Development Only */,
]);

let gridApi: GridApi;
let currentChartRef: any;

function getColumnDefs() {
  return [
    { field: "date", valueFormatter: dateFormatter },
    { field: "avgTemp" },
  ];
}

const gridOptions: GridOptions = {
  columnDefs: getColumnDefs(),
  defaultColDef: { flex: 1 },
  cellSelection: true,
  enableCharts: true,
  chartThemeOverrides: {
    line: {
      title: {
        enabled: true,
        text: "Average Daily Temperatures",
      },
      navigator: {
        enabled: true,
        height: 20,
        spacing: 25,
      },
      axes: {
        time: {
          label: {
            rotation: 0,
            format: "%d %b",
          },
        },
        category: {
          label: {
            rotation: 0,
            formatter: (params: any) => {
              // charts typings
              return formatDate(params.value);
            },
          },
        },
        number: {
          label: {
            formatter: (params: any) => {
              // charts typings
              return params.value + "°C";
            },
          },
        },
      },
      series: {
        tooltip: {
          renderer: ({ datum, xKey, yKey }) => {
            return {
              content: `${formatDate(datum[xKey])}: ${Math.round(datum[yKey])}°C`,
            };
          },
        },
      },
    },
  },
  chartToolPanelsDef: {
    panels: ["data", "format"],
  },
  onGridReady: (params: GridReadyEvent) => {
    getData().then((rowData) => params.api.setGridOption("rowData", rowData));
  },
  onFirstDataRendered,
};

function onFirstDataRendered(params: FirstDataRenderedEvent) {
  if (currentChartRef) {
    currentChartRef.destroyChart();
  }

  currentChartRef = params.api.createRangeChart({
    chartContainer: document.querySelector("#myChart") as HTMLElement,
    cellRange: {
      columns: ["date", "avgTemp"],
    },
    suppressChartRanges: true,
    chartType: "line",
  });
}

function dateFormatter(params: ValueFormatterParams) {
  return params.value
    ? params.value.toISOString().substring(0, 10)
    : params.value;
}

function toggleAxis() {
  const axisBtn = document.querySelector("#axisBtn") as any;
  axisBtn.textContent = axisBtn.value;
  axisBtn.value = axisBtn.value === "time" ? "category" : "time";

  const columnDefs: ColDef[] = getColumnDefs();
  columnDefs.forEach((colDef) => {
    if (colDef.field === "date") {
      colDef.chartDataType = axisBtn.value;
    }
  });

  gridApi!.setGridOption("columnDefs", columnDefs);
}

function formatDate(date: Date | number) {
  return Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: undefined,
  }).format(new Date(date));
}

// setup the grid after the page has finished loading
const gridDiv = document.querySelector<HTMLElement>("#myGrid")!;
gridApi = createGrid(gridDiv, gridOptions);

if (typeof window !== "undefined") {
  // Attach external event handlers to window so they can be called from index.html
  (<any>window).toggleAxis = toggleAxis;
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
