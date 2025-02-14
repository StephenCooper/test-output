import { Component, ViewChild } from "@angular/core";
import { AgGridAngular } from "ag-grid-angular";
import "./styles.css";
import { AgChartsEnterpriseModule } from "ag-charts-enterprise";
import {
  AgChartThemeOverrides,
  CellSelectionOptions,
  ChartCreatedEvent,
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  CreateRangeChartParams,
  FirstDataRenderedEvent,
  GetChartImageDataUrlParams,
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
      <button (click)="downloadChartImage('image/png')">
        Download Chart Image (PNG)
      </button>
      <button (click)="downloadChart({ width: 800, height: 500 })">
        Download Chart Image (JPG 800x500)
      </button>
      <button (click)="openChartImage('image/jpeg')">
        Open Chart Image (JPG)
      </button>
    </div>
    <ag-grid-angular
      id="myGrid"
      style="width: 100%; height: 100%;"
      [columnDefs]="columnDefs"
      [defaultColDef]="defaultColDef"
      [cellSelection]="true"
      [popupParent]="popupParent"
      [enableCharts]="true"
      [chartThemeOverrides]="chartThemeOverrides"
      [rowData]="rowData"
      (firstDataRendered)="onFirstDataRendered($event)"
      (chartCreated)="onChartCreated($event)"
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
  chartThemeOverrides: AgChartThemeOverrides = {
    bar: {
      axes: {
        category: {
          label: {
            rotation: 335,
          },
        },
      },
    },
  };
  rowData!: any[];

  onFirstDataRendered(params: FirstDataRenderedEvent) {
    const createRangeChartParams: CreateRangeChartParams = {
      cellRange: {
        columns: ["country", "sugar", "fat", "weight"],
      },
      chartType: "groupedColumn",
      chartContainer: document.querySelector("#myChart") as any,
    };
    params.api.createRangeChart(createRangeChartParams);
  }

  onChartCreated(event: ChartCreatedEvent) {
    chartId = event.chartId;
  }

  downloadChart(dimensions: { width: number; height: number }) {
    if (!chartId) return;
    this.gridApi.downloadChart({
      fileName: "resizedImage",
      fileFormat: "image/jpeg",
      chartId,
      dimensions,
    });
  }

  downloadChartImage(fileFormat: string) {
    if (!chartId) return;
    const params: GetChartImageDataUrlParams = { fileFormat, chartId };
    const imageDataURL = this.gridApi.getChartImageDataURL(params);
    if (imageDataURL) {
      const a = document.createElement("a");
      a.href = imageDataURL;
      a.download = "image";
      a.style.display = "none";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  }

  openChartImage(fileFormat: string) {
    if (!chartId) return;
    const params: GetChartImageDataUrlParams = { fileFormat, chartId };
    const imageDataURL = this.gridApi.getChartImageDataURL(params);
    if (imageDataURL) {
      const image = new Image();
      image.src = imageDataURL;
      const w = window.open("")!;
      w.document.write(image.outerHTML);
      w.document.close();
    }
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;

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

let chartId: string | undefined;
