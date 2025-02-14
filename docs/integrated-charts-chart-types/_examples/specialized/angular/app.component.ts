import { Component, ViewChild } from "@angular/core";
import { AgGridAngular } from "ag-grid-angular";
import "./style.css";
import { AgChartsEnterpriseModule } from "ag-charts-enterprise";
import {
  CellSelectionOptions,
  ChartRef,
  ChartToolPanelsDef,
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
    <div class="button-container">
      <button (click)="updateChart('heatmap')">Heatmap</button>
      <button (click)="updateChart('waterfall')">Waterfall</button>
    </div>
    <ag-grid-angular
      style="width: 100%; height: 100%;"
      [columnDefs]="columnDefs"
      [defaultColDef]="defaultColDef"
      [popupParent]="popupParent"
      [cellSelection]="true"
      [enableCharts]="true"
      [chartToolPanelsDef]="chartToolPanelsDef"
      [rowData]="rowData"
      (firstDataRendered)="onFirstDataRendered($event)"
      (gridReady)="onGridReady($event)"
    />
    <div id="myChart"></div>
  </div> `,
})
export class AppComponent {
  private gridApi!: GridApi;

  columnDefs: ColDef[] = heatmapColDefs;
  defaultColDef: ColDef = {
    flex: 1,
    minWidth: 100,
  };
  popupParent: HTMLElement | null = document.body;
  chartToolPanelsDef: ChartToolPanelsDef = {
    defaultToolPanel: "settings",
  };
  rowData!: any[];

  onFirstDataRendered(params: FirstDataRenderedEvent) {
    chartRef = params.api.createRangeChart({
      chartContainer: document.querySelector("#myChart") as any,
      chartType: "heatmap",
      cellRange: {
        columns: heatmapColIds,
      },
    })!;
  }

  updateChart(chartType: "heatmap" | "waterfall") {
    getData(chartType).then((rowData) => {
      this.gridApi.updateGridOptions({
        columnDefs: chartType === "heatmap" ? heatmapColDefs : waterfallColDefs,
        rowData,
      });
      setTimeout(() => {
        this.gridApi.updateChart({
          type: "rangeChartUpdate",
          chartId: chartRef.chartId,
          chartType,
          cellRange: {
            columns: chartType === "heatmap" ? heatmapColIds : waterfallColIds,
          },
        });
      });
    });
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;

    getData("heatmap").then((rowData) =>
      params.api.setGridOption("rowData", rowData),
    );
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

let chartRef: ChartRef;
const heatmapColIds: string[] = [
  "year",
  "jan",
  "feb",
  "mar",
  "apr",
  "may",
  "jun",
  "jul",
  "aug",
  "sep",
  "oct",
  "nov",
  "dec",
];
const heatmapColDefs: ColDef[] = [
  { field: "year", width: 150, chartDataType: "category" },
  { field: "jan" },
  { field: "feb" },
  { field: "mar" },
  { field: "apr" },
  { field: "may" },
  { field: "jun" },
  { field: "jul" },
  { field: "aug" },
  { field: "sep" },
  { field: "oct" },
  { field: "nov" },
  { field: "dec" },
];
const waterfallColIds: string[] = ["financials", "amount"];
const waterfallColDefs: ColDef[] = [
  { field: "financials", width: 150, chartDataType: "category" },
  { field: "amount", chartDataType: "series" },
];
