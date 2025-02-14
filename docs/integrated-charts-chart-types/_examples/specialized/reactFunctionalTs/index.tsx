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

const GridExample = () => {
  const gridRef = useRef<AgGridReact>(null);
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);

  const [columnDefs, setColumnDefs] = useState<ColDef[]>(heatmapColDefs);
  const defaultColDef = useMemo<ColDef>(() => {
    return {
      flex: 1,
      minWidth: 100,
    };
  }, []);
  const popupParent = useMemo<HTMLElement | null>(() => {
    return document.body;
  }, []);
  const chartToolPanelsDef = useMemo<ChartToolPanelsDef>(() => {
    return {
      defaultToolPanel: "settings",
    };
  }, []);

  const onGridReady = useCallback((params: GridReadyEvent) => {
    getData("heatmap").then((rowData) =>
      params.api.setGridOption("rowData", rowData),
    );
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
      chartRef = params.api.createRangeChart({
        chartContainer: document.querySelector("#myChart") as any,
        chartType: "heatmap",
        cellRange: {
          columns: heatmapColIds,
        },
      })!;
    },
    [heatmapColIds],
  );

  const updateChart = useCallback(
    (chartType: "heatmap" | "waterfall") => {
      getData(chartType).then((rowData) => {
        gridRef.current!.api.updateGridOptions({
          columnDefs:
            chartType === "heatmap" ? heatmapColDefs : waterfallColDefs,
          rowData,
        });
        setTimeout(() => {
          gridRef.current!.api.updateChart({
            type: "rangeChartUpdate",
            chartId: chartRef.chartId,
            chartType,
            cellRange: {
              columns:
                chartType === "heatmap" ? heatmapColIds : waterfallColIds,
            },
          });
        });
      });
    },
    [
      getData,
      heatmapColDefs,
      waterfallColDefs,
      chartRef,
      heatmapColIds,
      waterfallColIds,
    ],
  );

  return (
    <div style={containerStyle}>
      <div className="wrapper">
        <div className="button-container">
          <button onClick={() => updateChart("heatmap")}>Heatmap</button>
          <button onClick={() => updateChart("waterfall")}>Waterfall</button>
        </div>

        <div style={gridStyle}>
          <AgGridReact
            ref={gridRef}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            popupParent={popupParent}
            cellSelection={true}
            enableCharts={true}
            chartToolPanelsDef={chartToolPanelsDef}
            onGridReady={onGridReady}
            onFirstDataRendered={onFirstDataRendered}
          />
        </div>
        <div id="myChart"></div>
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
