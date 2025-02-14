import { Component, ViewChild } from "@angular/core";
import { AgGridAngular } from "ag-grid-angular";
import { AgChartsEnterpriseModule } from "ag-charts-enterprise";
import {
  AgChartTheme,
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
} from "ag-grid-community";
import {
  ColumnMenuModule,
  ContextMenuModule,
  IntegratedChartsModule,
  RowGroupingModule,
} from "ag-grid-enterprise";
import { deepMerge, getData } from "./data";
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
  template: `<ag-grid-angular
    style="width: 100%; height: 100%;"
    [columnDefs]="columnDefs"
    [defaultColDef]="defaultColDef"
    [popupParent]="popupParent"
    [cellSelection]="true"
    [enableCharts]="true"
    [chartThemes]="chartThemes"
    [customChartThemes]="customChartThemes"
    [rowData]="rowData"
    (firstDataRendered)="onFirstDataRendered($event)"
    (gridReady)="onGridReady($event)"
  /> `,
})
export class AppComponent {
  columnDefs: ColDef[] = [
    { field: "country", width: 150, chartDataType: "category" },
    { field: "gold", chartDataType: "series" },
    { field: "silver", chartDataType: "series" },
    { field: "bronze", chartDataType: "series" },
  ];
  defaultColDef: ColDef = {
    flex: 1,
    minWidth: 100,
  };
  popupParent: HTMLElement | null = document.body;
  chartThemes: string[] = ["my-custom-theme-light", "my-custom-theme-dark"];
  customChartThemes: {
    [name: string]: AgChartTheme;
  } = {
    "my-custom-theme-light": myCustomThemeLight,
    "my-custom-theme-dark": myCustomThemeDark,
  };
  rowData!: any[];

  onFirstDataRendered(params: FirstDataRenderedEvent) {
    params.api.createRangeChart({
      cellRange: {
        rowStartIndex: 0,
        rowEndIndex: 4,
        columns: ["country", "gold", "silver", "bronze"],
      },
      chartType: "groupedBar",
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

const commonThemeProperties = {
  overrides: {
    common: {
      legend: {
        position: "top",
        spacing: 25,
        item: {
          label: {
            fontStyle: "italic",
            fontWeight: "bold",
            fontSize: 18,
            fontFamily: "Palatino, serif",
          },
          marker: {
            shape: "circle",
            size: 14,
            padding: 8,
            strokeWidth: 2,
          },
        },
      },
    },
    bar: {
      axes: {
        number: {
          line: {
            width: 4,
          },
        },
        category: {
          line: {
            width: 2,
          },
          rotation: 0,
        },
      },
    },
  },
};
const myCustomThemeLight = deepMerge(commonThemeProperties, {
  palette: {
    fills: ["#42a5f5", "#ffa726", "#81c784"],
    strokes: ["#000000", "#424242"],
  },
  overrides: {
    common: {
      background: {
        fill: "#f4f4f4",
      },
      legend: {
        item: {
          label: {
            color: "#333333",
          },
        },
      },
    },
    bar: {
      axes: {
        number: {
          bottom: {
            line: {
              stroke: "#424242",
            },
            label: {
              color: "#555555",
              fontStyle: "italic",
              fontWeight: "bold",
              fontSize: 12,
              spacing: 5,
            },
          },
        },
        category: {
          left: {
            line: {
              stroke: "#424242",
            },
            label: {
              color: "#555555",
              fontStyle: "italic",
              fontWeight: "bold",
              fontSize: 14,
              spacing: 8,
            },
          },
        },
      },
    },
  },
});
const myCustomThemeDark = deepMerge(commonThemeProperties, {
  palette: {
    fills: ["#42a5f5", "#ffa726", "#81c784"],
    strokes: ["#ffffff", "#B0BEC5"],
  },
  overrides: {
    common: {
      background: {
        fill: "#15181c",
      },
      legend: {
        item: {
          label: {
            color: "#ECEFF1",
          },
        },
      },
    },
    bar: {
      axes: {
        number: {
          bottom: {
            line: {
              stroke: "#757575",
            },
            label: {
              color: "#B0BEC5",
              fontStyle: "italic",
              fontWeight: "bold",
              fontSize: 12,
              spacing: 5,
            },
          },
        },
        category: {
          left: {
            line: {
              stroke: "#757575",
            },
            label: {
              color: "#B0BEC5",
              fontStyle: "italic",
              fontWeight: "bold",
              fontSize: 14,
              spacing: 8,
            },
          },
        },
      },
    },
  },
});
