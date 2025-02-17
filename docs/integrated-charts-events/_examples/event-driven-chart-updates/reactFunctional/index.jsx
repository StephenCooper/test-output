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
  ClientSideRowModelModule,
  ModuleRegistry,
  ValidationModule,
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

function updateTitle(api, chartId) {
  const cellRange = api.getCellRanges()[1];
  if (!cellRange) return;
  const columnCount = cellRange.columns.length;
  const rowCount = cellRange.endRow.rowIndex - cellRange.startRow.rowIndex + 1;
  const subtitle = `Using series data from ${columnCount} column(s) and ${rowCount} row(s)`;
  api.updateChart({
    type: "rangeChartUpdate",
    chartId: chartId,
    chartThemeOverrides: {
      common: {
        subtitle: { text: subtitle },
      },
    },
  });
}

const GridExample = () => {
  const gridRef = useRef(null);
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);
  const [rowData, setRowData] = useState();
  const [columnDefs, setColumnDefs] = useState([
    { field: "Month", width: 150, chartDataType: "category" },
    { field: "Sunshine (hours)", chartDataType: "series" },
    { field: "Rainfall (mm)", chartDataType: "series" },
  ]);
  const defaultColDef = useMemo(() => {
    return { flex: 1 };
  }, []);
  const popupParent = useMemo(() => {
    return document.body;
  }, []);
  const chartThemeOverrides = useMemo(() => {
    return {
      common: {
        title: { enabled: true, text: "Monthly Weather" },
        subtitle: { enabled: true },
        legend: { enabled: true },
      },
    };
  }, []);

  const onGridReady = useCallback((params) => {
    fetch("https://www.ag-grid.com/example-assets/weather-se-england.json")
      .then((resp) => resp.json())
      .then((data) => {
        setRowData(data);
      });
  }, []);
  /** DARK INTEGRATED START **/ const [tick, setTick] = useState(0);
  useEffect(() => {
    setTick(1);
    const isInitialModeDark =
      document.documentElement.dataset.agThemeMode?.includes("dark");

    // update chart themes based on dark mode status
    const updateChartThemes = (isDark) => {
      const themes = [
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

      let modifiedThemes = customTheme
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

    // event handler for color scheme changes
    const handleColorSchemeChange = (event) => {
      const { darkMode } = event.detail;
      updateChartThemes(darkMode);
    };

    // listen for user-triggered dark mode changes (not removing listener is fine here!)
    document.addEventListener("color-scheme-change", handleColorSchemeChange);
  }, [gridRef.current]); /** DARK INTEGRATED END **/

  const onFirstDataRendered = useCallback((params) => {
    const createRangeChartParams = {
      cellRange: {
        rowStartIndex: 0,
        rowEndIndex: 3,
        columns: ["Month", "Sunshine (hours)"],
      },
      chartType: "stackedColumn",
      chartContainer: document.querySelector("#myChart"),
    };
    params.api.createRangeChart(createRangeChartParams);
  }, []);

  const onChartCreated = useCallback((event) => {
    console.log("Created chart with ID " + event.chartId);
    updateTitle(gridRef.current.api, event.chartId);
  }, []);

  const onChartRangeSelectionChanged = useCallback((event) => {
    console.log("Changed range selection of chart with ID " + event.chartId);
    updateTitle(gridRef.current.api, event.chartId);
  }, []);

  const onChartOptionsChanged = useCallback((event) => {
    console.log("Changed options of chart with ID " + event.chartId);
  }, []);

  return (
    <div style={containerStyle}>
      <div className="wrapper">
        <div style={gridStyle} className="my-grid">
          <AgGridReact
            ref={gridRef}
            rowData={rowData}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            cellSelection={true}
            popupParent={popupParent}
            enableCharts={true}
            chartThemeOverrides={chartThemeOverrides}
            onGridReady={onGridReady}
            onFirstDataRendered={onFirstDataRendered}
            onChartCreated={onChartCreated}
            onChartRangeSelectionChanged={onChartRangeSelectionChanged}
            onChartOptionsChanged={onChartOptionsChanged}
          />
        </div>
        <div id="myChart" className="my-chart"></div>
      </div>
    </div>
  );
};

const root = createRoot(document.getElementById("root"));
root.render(
  <StrictMode>
    <GridExample />
  </StrictMode>,
);
window.tearDownExample = () => root.unmount();
