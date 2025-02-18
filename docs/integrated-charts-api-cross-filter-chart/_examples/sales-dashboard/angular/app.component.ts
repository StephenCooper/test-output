import { Component, ViewChild } from "@angular/core";
import { AgGridAngular } from "ag-grid-angular";
import "./style.css";
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
  TextEditorModule,
  DateEditorModule,
  NumberEditorModule,
  ValidationModule /* Development Only */,
]);

@Component({
  selector: "my-app",
  standalone: true,
  imports: [AgGridAngular],
  template: `<div id="wrapper">
    <div id="top">
      <div id="columnChart"></div>
      <div id="pieChart"></div>
    </div>
    <div id="barChart"></div>
    <ag-grid-angular
      style="width: 100%; height: 100%;"
      [columnDefs]="columnDefs"
      [defaultColDef]="defaultColDef"
      [enableCharts]="true"
      [chartThemeOverrides]="chartThemeOverrides"
      [rowData]="rowData"
      (firstDataRendered)="onFirstDataRendered($event)"
      (gridReady)="onGridReady($event)"
    />
  </div> `,
})
export class AppComponent {
  columnDefs: ColDef[] = [
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
  ];
  defaultColDef: ColDef = {
    flex: 1,
    editable: true,
    filter: "agMultiColumnFilter",
    floatingFilter: true,
  };
  chartThemeOverrides: AgChartThemeOverrides = {
    bar: {
      axes: {
        category: {
          label: {
            rotation: 0,
          },
        },
      },
    },
  };
  rowData!: any[];

  onFirstDataRendered(params: FirstDataRenderedEvent) {
    createQuarterlySalesChart(params.api);
    createSalesByRefChart(params.api);
    createHandsetSalesChart(params.api);
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

function createQuarterlySalesChart(api: GridApi) {
  api.createCrossFilterChart({
    chartType: "column",
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
        legend: { enabled: false },
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
    chartContainer: document.querySelector("#columnChart") as any,
  });
}
function createSalesByRefChart(api: GridApi) {
  api.createCrossFilterChart({
    chartType: "pie",
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
        series: {
          title: {
            enabled: false,
          },
          calloutLabel: {
            enabled: false,
          },
        },
        legend: {
          position: "right",
        },
      },
    },
    chartContainer: document.querySelector("#pieChart") as any,
  });
}
function createHandsetSalesChart(api: GridApi) {
  api.createCrossFilterChart({
    chartType: "bar",
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
        legend: { enabled: false },
      },
    },
    chartContainer: document.querySelector("#barChart") as any,
  });
}
