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
import { getData } from "./data";
ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  IntegratedChartsModule.with(AgChartsEnterpriseModule),
  ColumnMenuModule,
  ContextMenuModule,
  RowGroupingModule,
  ValidationModule /* Development Only */,
]);

let chartRef;

const chartConfig = {
  pie: {
    chartColumns: ["period", "individual"],
  },
  donut: {
    chartColumns: ["period", "recurring", "individual"],
  },
};

const GridExample = () => {
  const gridRef = useRef(null);
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);
  const [rowData, setRowData] = useState();
  const [columnDefs, setColumnDefs] = useState([
    {
      field: "period",
      chartDataType: "category",
      headerName: "Financial Period",
      width: 150,
    },
    {
      field: "recurring",
      chartDataType: "series",
      headerName: "Recurring revenue",
    },
    {
      field: "individual",
      chartDataType: "series",
      headerName: "Individual sales",
    },
  ]);
  const defaultColDef = useMemo(() => {
    return {
      flex: 1,
      minWidth: 100,
    };
  }, []);
  const popupParent = useMemo(() => {
    return document.body;
  }, []);
  const chartToolPanelsDef = useMemo(() => {
    return {
      defaultToolPanel: "settings",
    };
  }, []);

  const onGridReady = useCallback((params) => {
    getData().then((rowData) => setRowData(rowData));
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

  const onFirstDataRendered = useCallback(
    (params) => {
      const chartType = "pie";
      chartRef = params.api.createRangeChart({
        chartContainer: document.querySelector("#myChart"),
        chartType,
        cellRange: {
          rowStartIndex: 0,
          rowEndIndex: 3,
          columns: chartConfig[chartType].chartColumns,
        },
      });
    },
    [chartConfig],
  );

  const updateChart = useCallback(
    (chartType) => {
      gridRef.current.api.updateChart({
        type: "rangeChartUpdate",
        chartId: `${chartRef.chartId}`,
        chartType,
        cellRange: {
          rowStartIndex: 0,
          rowEndIndex: 3,
          columns: chartConfig[chartType].chartColumns,
        },
      });
    },
    [chartRef, chartConfig],
  );

  return (
    <div style={containerStyle}>
      <div className="wrapper">
        <div className="button-container">
          <button onClick={() => updateChart("pie")}>Pie</button>
          <button onClick={() => updateChart("donut")}>Donut</button>
        </div>

        <div style={gridStyle}>
          <AgGridReact
            ref={gridRef}
            rowData={rowData}
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

const root = createRoot(document.getElementById("root"));
root.render(
  <StrictMode>
    <GridExample />
  </StrictMode>,
);
window.tearDownExample = () => root.unmount();
