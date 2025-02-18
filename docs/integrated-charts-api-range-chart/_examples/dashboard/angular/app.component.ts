import { Component, ViewChild } from "@angular/core";
import { AgGridAngular } from "ag-grid-angular";
import { AgChartsEnterpriseModule } from "ag-charts-enterprise";
import {
  CellSelectionOptions,
  ChartToolPanelsDef,
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  FirstDataRenderedEvent,
  GetChartToolbarItems,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ModuleRegistry,
  NumberEditorModule,
  NumberFilterModule,
  TextEditorModule,
  TextFilterModule,
  ValidationModule,
} from "ag-grid-community";
import {
  ColumnMenuModule,
  ContextMenuModule,
  IntegratedChartsModule,
  RowGroupingModule,
} from "ag-grid-enterprise";
import { getData } from "./data";
ModuleRegistry.registerModules([
  NumberEditorModule,
  TextEditorModule,
  TextFilterModule,
  NumberFilterModule,
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
  template: `<div
    style="display: flex; flex-direction: column; height: 100%; width: 100%; overflow: hidden"
  >
    <ag-grid-angular
      style="width: 100%; height: 30%;"
      [columnDefs]="columnDefs"
      [defaultColDef]="defaultColDef"
      [cellSelection]="true"
      [enableCharts]="true"
      [chartToolPanelsDef]="chartToolPanelsDef"
      [popupParent]="popupParent"
      [getChartToolbarItems]="getChartToolbarItems"
      [rowData]="rowData"
      (firstDataRendered)="onFirstDataRendered($event)"
      (gridReady)="onGridReady($event)"
    />
    <div id="chart1" class="my-chart" style="flex: 1 1 auto; height: 30%"></div>
    <div style="display: flex; flex: 1 1 auto; height: 30%; gap: 8px">
      <div
        id="chart2"
        class="my-chart"
        style="flex: 1 1 auto; width: 50%"
      ></div>
      <div
        id="chart3"
        class="my-chart"
        style="flex: 1 1 auto; width: 50%"
      ></div>
    </div>
  </div> `,
})
export class AppComponent {
  columnDefs: ColDef[] = [
    { field: "country", width: 150, chartDataType: "category" },
    { field: "group", chartDataType: "category" },
    { field: "gold", chartDataType: "series" },
    { field: "silver", chartDataType: "series" },
    { field: "bronze", chartDataType: "series" },
  ];
  defaultColDef: ColDef = {
    editable: true,
    flex: 1,
    minWidth: 100,
    filter: true,
  };
  chartToolPanelsDef: ChartToolPanelsDef = { panels: [] };
  popupParent: HTMLElement | null = document.body;
  getChartToolbarItems: GetChartToolbarItems = () => [];
  rowData!: any[];

  onFirstDataRendered(event: FirstDataRenderedEvent) {
    createGroupedBarChart(event, "#chart1", ["country", "gold", "silver"]);
    createPieChart(event, "#chart2", ["group", "gold"]);
    createPieChart(event, "#chart3", ["group", "silver"]);
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

function createGroupedBarChart(
  params: FirstDataRenderedEvent,
  selector: string,
  columns: string[],
) {
  params.api.createRangeChart({
    chartContainer: document.querySelector(selector) as HTMLElement,
    cellRange: {
      rowStartIndex: 0,
      rowEndIndex: 4,
      columns,
    },
    suppressChartRanges: true,
    chartType: "groupedBar",
  });
}
function createPieChart(
  params: FirstDataRenderedEvent,
  selector: string,
  columns: string[],
) {
  params.api.createRangeChart({
    chartContainer: document.querySelector(selector) as HTMLElement,
    cellRange: { columns },
    suppressChartRanges: true,
    chartType: "pie",
    aggFunc: "sum",
    chartThemeOverrides: {
      common: {
        padding: {
          top: 20,
          left: 10,
          bottom: 30,
          right: 10,
        },
        legend: {
          position: "right",
        },
      },
    },
  });
}
