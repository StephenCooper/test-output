import {
  AgChartsCommunityModule,
  AgSparklineOptions,
} from "ag-charts-community";
import {
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  GridApi,
  GridOptions,
  ModuleRegistry,
  ValidationModule,
  ValueGetterParams,
  createGrid,
} from "ag-grid-community";
import { SparklinesModule } from "ag-grid-enterprise";
import { getData } from "./data";

ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  SparklinesModule.with(AgChartsCommunityModule),
  ValidationModule /* Development Only */,
]);

let gridApi: GridApi;

const gridOptions: GridOptions = {
  columnDefs: [
    { field: "symbol", maxWidth: 110 },
    { field: "name", minWidth: 250 },
    {
      headerName: "Rate of Change",
      cellRenderer: "agSparklineCellRenderer",
      cellRendererParams: {
        sparklineOptions: {
          type: "area",
        } as AgSparklineOptions,
      },
      valueGetter: (params: ValueGetterParams) => {
        const formattedData: any = [];
        const rateOfChange = params.data.rateOfChange;
        const { x, y } = rateOfChange;
        x.map((xVal: any, i: number) => formattedData.push([xVal, y[i]]));
        return formattedData;
      },
    },
    { field: "volume", maxWidth: 140 },
  ],
  defaultColDef: {
    flex: 1,
    minWidth: 100,
  },
  rowData: getData(),
  rowHeight: 50,
};

const gridDiv = document.querySelector<HTMLElement>("#myGrid")!;
gridApi = createGrid(gridDiv, gridOptions);
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
