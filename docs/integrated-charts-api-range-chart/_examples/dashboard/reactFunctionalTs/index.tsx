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
import { AgChartsEnterpriseModule } from "ag-charts-enterprise";
import {
  CellSelectionOptions,
  ChartToolPanelsDef,
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  FirstDataRenderedEvent,
  GetChartToolbarItems,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ModuleRegistry,
  NumberEditorModule,
  NumberFilterModule,
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
  NumberEditorModule,
  TextEditorModule,
  TextFilterModule,
  NumberFilterModule,
  ClientSideRowModelModule,
  IntegratedChartsModule.with(AgChartsEnterpriseModule),
  ColumnMenuModule,
  ContextMenuModule,
  RowGroupingModule,
  ValidationModule /* Development Only */,
]);

function createGroupedBarChart(
  params: FirstDataRenderedEvent,
  selector: string,
  columns: string[],
) {
  params.api.createRangeChart({
    chartContainer: document.querySelector(selector) as HTMLElement,
    cellRange: {
      rowStartIndex: 0,
      rowEndIndex: 4,
      columns,
    },
    suppressChartRanges: true,
    chartType: "groupedBar",
  });
}

function createPieChart(
  params: FirstDataRenderedEvent,
  selector: string,
  columns: string[],
) {
  params.api.createRangeChart({
    chartContainer: document.querySelector(selector) as HTMLElement,
    cellRange: { columns },
    suppressChartRanges: true,
    chartType: "pie",
    aggFunc: "sum",
    chartThemeOverrides: {
      common: {
        padding: {
          top: 20,
          left: 10,
          bottom: 30,
          right: 10,
        },
        legend: {
          position: "right",
        },
      },
    },
  });
}

const GridExample = () => {
  const gridRef = useRef<AgGridReact>(null);
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "30%", width: "100%" }), []);

  const [columnDefs, setColumnDefs] = useState<ColDef[]>([
    { field: "country", width: 150, chartDataType: "category" },
    { field: "group", chartDataType: "category" },
    { field: "gold", chartDataType: "series" },
    { field: "silver", chartDataType: "series" },
    { field: "bronze", chartDataType: "series" },
  ]);
  const defaultColDef = useMemo<ColDef>(() => {
    return {
      editable: true,
      flex: 1,
      minWidth: 100,
      filter: true,
    };
  }, []);
  const chartToolPanelsDef = useMemo<ChartToolPanelsDef>(() => {
    return { panels: [] };
  }, []);
  const popupParent = useMemo<HTMLElement | null>(() => {
    return document.body;
  }, []);
  const getChartToolbarItems = useCallback(() => [], []);

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

  const onFirstDataRendered = useCallback((event: FirstDataRenderedEvent) => {
    createGroupedBarChart(event, "#chart1", ["country", "gold", "silver"]);
    createPieChart(event, "#chart2", ["group", "gold"]);
    createPieChart(event, "#chart3", ["group", "silver"]);
  }, []);

  return (
    <div style={containerStyle}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          width: "100%",
          overflow: "hidden",
        }}
      >
        <div style={gridStyle}>
          <AgGridReact
            ref={gridRef}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            cellSelection={true}
            enableCharts={true}
            chartToolPanelsDef={chartToolPanelsDef}
            popupParent={popupParent}
            getChartToolbarItems={getChartToolbarItems}
            onGridReady={onGridReady}
            onFirstDataRendered={onFirstDataRendered}
          />
        </div>
        <div
          id="chart1"
          className="my-chart"
          style={{ flex: "1 1 auto", height: "30%" }}
        ></div>
        <div
          style={{
            display: "flex",
            flex: "1 1 auto",
            height: "30%",
            gap: "8px",
          }}
        >
          <div
            id="chart2"
            className="my-chart"
            style={{ flex: "1 1 auto", width: "50%" }}
          ></div>
          <div
            id="chart3"
            className="my-chart"
            style={{ flex: "1 1 auto", width: "50%" }}
          ></div>
        </div>
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
