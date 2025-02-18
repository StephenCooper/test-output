import { Component, ViewChild } from "@angular/core";
import { AgGridAngular } from "ag-grid-angular";
import "./styles.css";
import { AgChartsEnterpriseModule } from "ag-charts-enterprise";
import {
  CellSelectionOptions,
  ChartModel,
  ChartRef,
  ChartRefParams,
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
} from "ag-grid-community";
import {
  ColumnMenuModule,
  ContextMenuModule,
  IntegratedChartsModule,
  RowGroupingModule,
} from "ag-grid-enterprise";
import { getData } from "./data";
ModuleRegistry.registerModules([
  TextEditorModule,
  TextFilterModule,
  NumberEditorModule,
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
    <div id="buttons">
      <button (click)="saveChart()">Save chart</button>
      <button (click)="clearChart()">Clear chart</button>
      <button (click)="restoreChart()">Restore chart</button>
    </div>
    <ag-grid-angular
      id="myGrid"
      style="width: 100%; height: 100%;"
      [columnDefs]="columnDefs"
      [defaultColDef]="defaultColDef"
      [cellSelection]="true"
      [popupParent]="popupParent"
      [enableCharts]="true"
      [createChartContainer]="createChartContainer"
      [rowData]="rowData"
      (firstDataRendered)="onFirstDataRendered($event)"
      (gridReady)="onGridReady($event)"
    />
    <div id="myChart" class="my-chart"></div>
  </div> `,
})
export class AppComponent {
  private gridApi!: GridApi;

  columnDefs: ColDef[] = [
    { field: "country", chartDataType: "category" },
    { field: "sugar", chartDataType: "series" },
    { field: "fat", chartDataType: "series" },
    { field: "weight", chartDataType: "series" },
  ];
  defaultColDef: ColDef = {
    editable: true,
    flex: 1,
    minWidth: 100,
    filter: true,
  };
  popupParent: HTMLElement | null = document.body;
  rowData!: any[];

  onFirstDataRendered(params: FirstDataRenderedEvent) {
    currentChartRef = params.api.createRangeChart({
      chartContainer: document.querySelector("#myChart") as any,
      cellRange: {
        columns: ["country", "sugar", "fat", "weight"],
        rowStartIndex: 0,
        rowEndIndex: 2,
      },
      chartType: "groupedColumn",
    });
  }

  saveChart() {
    const chartModels = this.gridApi.getChartModels() || [];
    if (chartModels.length > 0) {
      chartModel = chartModels[0];
    }
  }

  clearChart() {
    if (currentChartRef) {
      currentChartRef.destroyChart();
      currentChartRef = undefined;
    }
  }

  restoreChart() {
    if (!chartModel) return;
    currentChartRef = this.gridApi.restoreChart(chartModel)!;
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;

    getData().then((rowData) => params.api.setGridOption("rowData", rowData));
  }

  createChartContainer = (chartRef: ChartRef) => {
    if (currentChartRef) {
      currentChartRef.destroyChart();
    }
    const eChart = chartRef.chartElement;
    const eParent = document.querySelector<HTMLElement>("#myChart")!;
    eParent.appendChild(eChart);
    currentChartRef = chartRef;
  };
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

let chartModel: ChartModel | undefined;
let currentChartRef: ChartRef | undefined;
