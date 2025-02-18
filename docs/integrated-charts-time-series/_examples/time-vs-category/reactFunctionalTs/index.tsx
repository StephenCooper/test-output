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
  ColumnApiModule,
  FirstDataRenderedEvent,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ModuleRegistry,
  ValidationModule,
  ValueFormatterParams,
} from "ag-grid-community";
import {
  ColumnMenuModule,
  ContextMenuModule,
  IntegratedChartsModule,
  RowGroupingModule,
} from "ag-grid-enterprise";
import { getData } from "./data";
ModuleRegistry.registerModules([
  ColumnApiModule,
  ClientSideRowModelModule,
  IntegratedChartsModule.with(AgChartsEnterpriseModule),
  ColumnMenuModule,
  ContextMenuModule,
  RowGroupingModule,
  ValidationModule /* Development Only */,
]);

let currentChartRef: any;

function getColumnDefs() {
  return [
    { field: "date", valueFormatter: dateFormatter },
    { field: "avgTemp" },
  ];
}

function dateFormatter(params: ValueFormatterParams) {
  return params.value
    ? params.value.toISOString().substring(0, 10)
    : params.value;
}

function formatDate(date: Date | number) {
  return Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: undefined,
  }).format(new Date(date));
}

const GridExample = () => {
  const gridRef = useRef<AgGridReact>(null);
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);
  const [rowData, setRowData] = useState<any[]>();
  const [columnDefs, setColumnDefs] = useState<ColDef[]>(getColumnDefs());
  const defaultColDef = useMemo<ColDef>(() => {
    return { flex: 1 };
  }, []);
  const chartThemeOverrides = useMemo<AgChartThemeOverrides>(() => {
    return {
      line: {
        title: {
          enabled: true,
          text: "Average Daily Temperatures",
        },
        navigator: {
          enabled: true,
          height: 20,
          spacing: 25,
        },
        axes: {
          time: {
            label: {
              rotation: 0,
              format: "%d %b",
            },
          },
          category: {
            label: {
              rotation: 0,
              formatter: (params: any) => {
                // charts typings
                return formatDate(params.value);
              },
            },
          },
          number: {
            label: {
              formatter: (params: any) => {
                // charts typings
                return params.value + "°C";
              },
            },
          },
        },
        series: {
          tooltip: {
            renderer: ({ datum, xKey, yKey }) => {
              return {
                content: `${formatDate(datum[xKey])}: ${Math.round(datum[yKey])}°C`,
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
    getData().then((rowData) => setRowData(rowData));
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

  const onFirstDataRendered = useCallback(
    (params: FirstDataRenderedEvent) => {
      if (currentChartRef) {
        currentChartRef.destroyChart();
      }
      currentChartRef = params.api.createRangeChart({
        chartContainer: document.querySelector("#myChart") as HTMLElement,
        cellRange: {
          columns: ["date", "avgTemp"],
        },
        suppressChartRanges: true,
        chartType: "line",
      });
    },
    [currentChartRef],
  );

  const toggleAxis = useCallback(() => {
    const axisBtn = document.querySelector("#axisBtn") as any;
    axisBtn.textContent = axisBtn.value;
    axisBtn.value = axisBtn.value === "time" ? "category" : "time";
    const columnDefs: ColDef[] = getColumnDefs();
    columnDefs.forEach((colDef) => {
      if (colDef.field === "date") {
        colDef.chartDataType = axisBtn.value;
      }
    });
    gridRef.current!.api.setGridOption("columnDefs", columnDefs);
  }, []);

  return (
    <div style={containerStyle}>
      <label>Switch Axis to: </label>
      <button id="axisBtn" onClick={toggleAxis} value="time">
        Category
      </button>
      <div className="wrapper">
        <div style={gridStyle} className="my-grid">
          <AgGridReact
            ref={gridRef}
            rowData={rowData}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            cellSelection={true}
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
