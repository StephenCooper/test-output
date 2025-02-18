import { AgChartsEnterpriseModule } from "ag-charts-enterprise";
import {
  AgChartThemeOverrides,
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  DateEditorModule,
  FirstDataRenderedEvent,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ModuleRegistry,
  NumberEditorModule,
  NumberFilterModule,
  TextEditorModule,
  TextFilterModule,
  ValidationModule,
  ValueFormatterParams,
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
  NumberFilterModule,
  TextFilterModule,
  NumberEditorModule,
  TextEditorModule,
  DateEditorModule,
  ValidationModule /* Development Only */,
]);

let gridApi: GridApi;

const gridOptions: GridOptions = {
  columnDefs: [
    { field: "salesRep", chartDataType: "category" },
    { field: "handset", chartDataType: "category" },
    {
      headerName: "Sale Price",
      field: "sale",
      maxWidth: 160,
      aggFunc: "sum",
      filter: "agNumberColumnFilter",
      chartDataType: "series",
    },
    {
      field: "saleDate",
      chartDataType: "category",
      filter: "agSetColumnFilter",
      filterParams: {
        valueFormatter: (params: ValueFormatterParams) => `${params.value}`,
      },
      sort: "asc",
    },
    {
      field: "quarter",
      maxWidth: 160,
      filter: "agSetColumnFilter",
      chartDataType: "category",
    },
  ],
  defaultColDef: {
    flex: 1,
    editable: true,
    filter: "agMultiColumnFilter",
    floatingFilter: true,
  },
  enableCharts: true,
  chartThemeOverrides: {
    bar: {
      axes: {
        category: {
          label: {
            rotation: 0,
          },
        },
      },
    },
  },
  onGridReady: (params: GridReadyEvent) => {
    getData().then((rowData) => params.api.setGridOption("rowData", rowData));
  },
  onFirstDataRendered,
};

function onFirstDataRendered(params: FirstDataRenderedEvent) {
  createQuarterlySalesChart(params.api);
  createSalesByRefChart(params.api);
  createHandsetSalesChart(params.api);
}

function createQuarterlySalesChart(api: GridApi) {
  api.createCrossFilterChart({
    chartType: "line",
    cellRange: {
      columns: ["quarter", "sale"],
    },
    aggFunc: "sum",
    chartThemeOverrides: {
      common: {
        title: {
          enabled: true,
          text: "Quarterly Sales ($)",
        },
        axes: {
          category: {
            label: {
              rotation: 0,
            },
          },
          number: {
            label: {
              formatter: (params: any) => {
                return params.value / 1000 + "k";
              },
            },
          },
        },
      },
    },
    chartContainer: document.querySelector("#lineChart") as any,
  });
}

function createSalesByRefChart(api: GridApi) {
  api.createCrossFilterChart({
    chartType: "donut",
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
        legend: {
          position: "right",
        },
        series: {
          title: {
            enabled: false,
          },
          calloutLabel: {
            enabled: false,
          },
        },
      },
    },
    chartContainer: document.querySelector("#donutChart") as any,
  });
}

function createHandsetSalesChart(api: GridApi) {
  api.createCrossFilterChart({
    chartType: "area",
    cellRange: {
      columns: ["handset", "sale"],
    },
    aggFunc: "count",
    chartThemeOverrides: {
      common: {
        title: {
          enabled: true,
          text: "Handsets Sold (Units)",
        },
        padding: { left: 47, right: 80 },
      },
    },
    chartContainer: document.querySelector("#areaChart") as any,
  });
}

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
