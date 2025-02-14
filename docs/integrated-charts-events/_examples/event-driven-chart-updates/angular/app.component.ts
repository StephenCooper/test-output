import { Component, ViewChild } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { AgGridAngular } from "ag-grid-angular";
import "./style.css";
import { AgChartsEnterpriseModule } from "ag-charts-enterprise";
import {
  AgChartThemeOverrides,
  CellSelectionOptions,
  ChartCreatedEvent,
  ChartOptionsChangedEvent,
  ChartRangeSelectionChangedEvent,
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  CreateRangeChartParams,
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
      class="my-grid"
      [columnDefs]="columnDefs"
      [defaultColDef]="defaultColDef"
      [cellSelection]="true"
      [popupParent]="popupParent"
      [enableCharts]="true"
      [chartThemeOverrides]="chartThemeOverrides"
      [rowData]="rowData"
      (firstDataRendered)="onFirstDataRendered($event)"
      (chartCreated)="onChartCreated($event)"
      (chartRangeSelectionChanged)="onChartRangeSelectionChanged($event)"
      (chartOptionsChanged)="onChartOptionsChanged($event)"
      (gridReady)="onGridReady($event)"
    />
    <div id="myChart" class="my-chart"></div>
  </div> `,
})
export class AppComponent {
  private gridApi!: GridApi;

  columnDefs: ColDef[] = [
    { field: "Month", width: 150, chartDataType: "category" },
    { field: "Sunshine (hours)", chartDataType: "series" },
    { field: "Rainfall (mm)", chartDataType: "series" },
  ];
  defaultColDef: ColDef = { flex: 1 };
  popupParent: HTMLElement | null = document.body;
  chartThemeOverrides: AgChartThemeOverrides = {
    common: {
      title: { enabled: true, text: "Monthly Weather" },
      subtitle: { enabled: true },
      legend: { enabled: true },
    },
  };
  rowData!: any[];

  constructor(private http: HttpClient) {}

  onFirstDataRendered(params: FirstDataRenderedEvent) {
    const createRangeChartParams: CreateRangeChartParams = {
      cellRange: {
        rowStartIndex: 0,
        rowEndIndex: 3,
        columns: ["Month", "Sunshine (hours)"],
      },
      chartType: "stackedColumn",
      chartContainer: document.querySelector("#myChart") as any,
    };
    params.api.createRangeChart(createRangeChartParams);
  }

  onChartCreated(event: ChartCreatedEvent) {
    console.log("Created chart with ID " + event.chartId);
    updateTitle(this.gridApi, event.chartId);
  }

  onChartRangeSelectionChanged(event: ChartRangeSelectionChangedEvent) {
    console.log("Changed range selection of chart with ID " + event.chartId);
    updateTitle(this.gridApi, event.chartId);
  }

  onChartOptionsChanged(event: ChartOptionsChangedEvent) {
    console.log("Changed options of chart with ID " + event.chartId);
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;

    this.http
      .get<
        any[]
      >("https://www.ag-grid.com/example-assets/weather-se-england.json")
      .subscribe((data) => {
        this.rowData = data;
      });
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

function updateTitle(api: GridApi, chartId: string) {
  const cellRange = api.getCellRanges()![1];
  if (!cellRange) return;
  const columnCount = cellRange.columns.length;
  const rowCount =
    cellRange.endRow!.rowIndex - cellRange.startRow!.rowIndex + 1;
  const subtitle = `Using series data from ${columnCount} column(s) and ${rowCount} row(s)`;
  api!.updateChart({
    type: "rangeChartUpdate",
    chartId: chartId,
    chartThemeOverrides: {
      common: {
        subtitle: { text: subtitle },
      },
    },
  });
}
