import { Component, ViewChild } from "@angular/core";
import { AgGridAngular } from "ag-grid-angular";
import "./style.css";
import { AgChartsEnterpriseModule } from "ag-charts-enterprise";
import {
  AgAxisCaptionFormatterParams,
  AgCartesianSeriesTooltipRendererParams,
  AgCrosshairLabelRendererParams,
} from "ag-charts-types";
import {
  AgChartThemeOverrides,
  CellSelectionOptions,
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  FirstDataRenderedEvent,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ModuleRegistry,
  ValidationModule,
  ValueParserParams,
} from "ag-grid-community";
import {
  ColumnMenuModule,
  ContextMenuModule,
  IntegratedChartsModule,
  RowGroupingModule,
} from "ag-grid-enterprise";
import { getData } from "./data";
ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  IntegratedChartsModule.with(AgChartsEnterpriseModule),
  ColumnMenuModule,
  ContextMenuModule,
  RowGroupingModule,
  ValidationModule /* Development Only */,
]);

@Component({
  selector: "my-app",
  standalone: true,
  imports: [AgGridAngular],
  template: `<div class="wrapper">
    <ag-grid-angular
      style="width: 100%; height: 100%;"
      [columnDefs]="columnDefs"
      [defaultColDef]="defaultColDef"
      [cellSelection]="true"
      [popupParent]="popupParent"
      [enableCharts]="true"
      [chartThemeOverrides]="chartThemeOverrides"
      [rowData]="rowData"
      (firstDataRendered)="onFirstDataRendered($event)"
      (gridReady)="onGridReady($event)"
    />
    <div id="myChart"></div>
  </div> `,
})
export class AppComponent {
  columnDefs: ColDef[] = [
    {
      field: "date",
      chartDataType: "time",
      valueFormatter: (params) => params.value.toISOString().substring(0, 10),
    },
    { field: "rain", chartDataType: "series", valueParser: numberParser },
    { field: "pressure", chartDataType: "series", valueParser: numberParser },
    { field: "temp", chartDataType: "series", valueParser: numberParser },
  ];
  defaultColDef: ColDef = { flex: 1 };
  popupParent: HTMLElement | null = document.body;
  chartThemeOverrides: AgChartThemeOverrides = {
    common: {
      padding: {
        top: 45,
      },
      axes: {
        number: {
          title: {
            enabled: true,
            formatter: (params: AgAxisCaptionFormatterParams) => {
              return params.boundSeries.map((s) => s.name).join(" / ");
            },
          },
        },
        time: {
          crosshair: {
            label: {
              renderer: (params: AgCrosshairLabelRendererParams) => ({
                text: formatDate(params.value),
              }),
            },
          },
        },
      },
    },
    bar: {
      series: {
        strokeWidth: 2,
        fillOpacity: 0.8,
        tooltip: {
          renderer: chartTooltipRenderer,
        },
      },
    },
    line: {
      series: {
        strokeWidth: 5,
        strokeOpacity: 0.8,
        tooltip: {
          renderer: chartTooltipRenderer,
        },
      },
    },
  };
  rowData!: any[];

  onFirstDataRendered(params: FirstDataRenderedEvent) {
    params.api.createRangeChart({
      chartContainer: document.querySelector("#myChart") as HTMLElement,
      cellRange: {
        columns: ["date", "rain", "pressure", "temp"],
      },
      suppressChartRanges: true,
      seriesChartTypes: [
        { colId: "rain", chartType: "groupedColumn", secondaryAxis: false },
        { colId: "pressure", chartType: "line", secondaryAxis: true },
        { colId: "temp", chartType: "line", secondaryAxis: true },
      ],
      chartType: "customCombo",
      aggFunc: "sum",
    });
  }

  onGridReady(params: GridReadyEvent) {
    getData().then((rowData) => params.api.setGridOption("rowData", rowData));
  }
  /** DARK INTEGRATED START **/
  @ViewChild(AgGridAngular)
  set agGrid(grid) {
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
      const currentThemes = grid?.api.getGridOption("chartThemes");
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
      grid?.api.setGridOption("chartThemes", modifiedThemes);
    };

    // update chart themes when example first loads
    let initialSet = false;
    const maxTries = 5;
    let tries = 0;
    const trySetInitial = (delay) => {
      if (grid?.api) {
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
  } /** DARK INTEGRATED END **/
}

function numberParser(params: ValueParserParams) {
  const value = params.newValue;
  if (value === null || value === undefined || value === "") {
    return null;
  }
  return parseFloat(value);
}
function chartTooltipRenderer({
  datum,
  xKey,
  yKey,
}: AgCartesianSeriesTooltipRendererParams) {
  return {
    content: `${formatDate(datum[xKey])}: ${datum[yKey]}`,
  };
}
function formatDate(date: Date | number) {
  return Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: undefined,
  }).format(new Date(date));
}
