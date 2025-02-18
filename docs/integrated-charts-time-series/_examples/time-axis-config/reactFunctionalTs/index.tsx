"use client";

import React, {
  useCallback,
  useMemo,
  useRef,
  useState,
  useEffect,
  StrictMode,
} from "react";
import { createRoot } from "react-dom/client";
import { AgGridReact } from "ag-grid-react";
import "./style.css";
import { AgChartsEnterpriseModule } from "ag-charts-enterprise";
import {
  AgChartThemeOverrides,
  CellSelectionOptions,
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

function formatTime(date: Date | number) {
  return Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(new Date(date));
}

const GridExample = () => {
  const gridRef = useRef<AgGridReact>(null);
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);

  const [columnDefs, setColumnDefs] = useState<ColDef[]>([
    { field: "timestamp", chartDataType: "time" },
    { field: "cpuUsage" },
  ]);
  const defaultColDef = useMemo<ColDef>(() => {
    return { flex: 1 };
  }, []);
  const popupParent = useMemo<HTMLElement | null>(() => {
    return document.body;
  }, []);
  const chartThemeOverrides = useMemo<AgChartThemeOverrides>(() => {
    return {
      area: {
        title: {
          enabled: true,
          text: "CPU Usage",
        },
        navigator: {
          enabled: true,
          height: 20,
          spacing: 25,
        },
        axes: {
          time: {
            label: {
              rotation: 315,
              format: "%H:%M",
            },
          },
          number: {
            label: {
              formatter: (params: any) => {
                // charts typings
                return params.value + "%";
              },
            },
          },
        },
        series: {
          tooltip: {
            renderer: ({ datum, xKey, yKey }) => {
              return {
                content: `${formatTime(datum[xKey])}: ${datum[yKey]}%`,
              };
            },
          },
        },
      },
    };
  }, []);
  const chartToolPanelsDef = useMemo<ChartToolPanelsDef>(() => {
    return {
      panels: ["data", "format"],
    };
  }, []);

  const onGridReady = useCallback((params: GridReadyEvent) => {
    getData().then((rowData) => params.api.setGridOption("rowData", rowData));
  }, []);
  /** DARK INTEGRATED START **/ const [tick, setTick] = useState(0);
  useEffect(() => {
    setTick(1);
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
      const currentThemes = gridRef.current?.api.getGridOption("chartThemes");
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
      gridRef.current?.api.setGridOption("chartThemes", modifiedThemes);
    };

    // update chart themes when example first loads
    let initialSet = false;
    const maxTries = 5;
    let tries = 0;
    const trySetInitial = (delay) => {
      if (gridRef.current?.api) {
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
  }, [gridRef.current]); /** DARK INTEGRATED END **/

  const onFirstDataRendered = useCallback((params: FirstDataRenderedEvent) => {
    params.api.createRangeChart({
      chartContainer: document.querySelector("#myChart") as HTMLElement,
      cellRange: {
        columns: ["timestamp", "cpuUsage"],
      },
      suppressChartRanges: true,
      chartType: "area",
    });
  }, []);

  return (
    <div style={containerStyle}>
      <div className="wrapper">
        <div style={gridStyle} className="my-grid">
          <AgGridReact
            ref={gridRef}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            cellSelection={true}
            popupParent={popupParent}
            enableCharts={true}
            chartThemeOverrides={chartThemeOverrides}
            chartToolPanelsDef={chartToolPanelsDef}
            onGridReady={onGridReady}
            onFirstDataRendered={onFirstDataRendered}
          />
        </div>
        <div id="myChart" className="my-chart"></div>
      </div>
    </div>
  );
};

const root = createRoot(document.getElementById("root")!);
root.render(
  <StrictMode>
    <GridExample />
  </StrictMode>,
);
(window as any).tearDownExample = () => root.unmount();
