import { Component, ViewChild } from "@angular/core";
import { AgGridAngular } from "ag-grid-angular";
import "./style.css";
import { AgChartsEnterpriseModule } from "ag-charts-enterprise";
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
  createGrid,
} from "ag-grid-community";
import {
  ColumnMenuModule,
  ContextMenuModule,
  IntegratedChartsModule,
  RowGroupingModule,
} from "ag-grid-enterprise";
import { generateData } from "./data";
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
      [autoGroupColumnDef]="autoGroupColumnDef"
      [rowData]="rowData"
      [cellSelection]="true"
      [popupParent]="popupParent"
      [enableCharts]="true"
      [groupDefaultExpanded]="groupDefaultExpanded"
      [chartThemeOverrides]="chartThemeOverrides"
      (firstDataRendered)="onFirstDataRendered($event)"
    />
    <div id="myChart" class="my-chart"></div>
  </div> `,
})
export class AppComponent {
  columnDefs: ColDef[] = [
    { field: "division", width: 150, rowGroup: true, hide: true },
    { field: "resource", width: 150, hide: true },
    { field: "revenue" },
    { field: "expenses" },
    { field: "headcount" },
  ];
  defaultColDef: ColDef = {
    flex: 1,
  };
  autoGroupColumnDef: ColDef = {
    field: "resource",
  };
  rowData: any[] | null = generateData();
  popupParent: HTMLElement | null = document.body;
  groupDefaultExpanded = 1;
  chartThemeOverrides: AgChartThemeOverrides = {
    bar: {
      axes: {
        "grouped-category": {
          label: {
            fontSize: 8,
          },
        },
      },
    },
  };

  onFirstDataRendered(params: FirstDataRenderedEvent) {
    params.api.createRangeChart({
      chartContainer: document.querySelector("#myChart") as HTMLElement,
      cellRange: {
        rowStartIndex: 0,
        rowEndIndex: 16,
        columns: ["expenses"],
      },
      chartType: "groupedColumn",
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
