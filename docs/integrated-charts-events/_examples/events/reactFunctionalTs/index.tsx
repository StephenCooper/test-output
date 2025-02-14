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
  ChartCreatedEvent,
  ChartDestroyedEvent,
  ChartOptionsChangedEvent,
  ChartRangeSelectionChangedEvent,
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
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
ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  IntegratedChartsModule.with(AgChartsEnterpriseModule),
  ColumnMenuModule,
  ContextMenuModule,
  RowGroupingModule,
  ValidationModule /* Development Only */,
]);

const GridExample = () => {
  const gridRef = useRef<AgGridReact>(null);
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);
  const [rowData, setRowData] = useState<any[]>();
  const [columnDefs, setColumnDefs] = useState<ColDef[]>([
    { field: "Month", width: 150, chartDataType: "category" },
    { field: "Sunshine (hours)", chartDataType: "series" },
    { field: "Rainfall (mm)", chartDataType: "series" },
  ]);
  const defaultColDef = useMemo<ColDef>(() => {
    return {
      flex: 1,
    };
  }, []);
  const popupParent = useMemo<HTMLElement | null>(() => {
    return document.body;
  }, []);

  const onGridReady = useCallback((params: GridReadyEvent) => {
    fetch("https://www.ag-grid.com/example-assets/weather-se-england.json")
      .then((resp) => resp.json())
      .then((data: any[]) => {
        setRowData(data);
      });
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

  const onChartCreated = useCallback((event: ChartCreatedEvent) => {
    console.log("Created chart with ID " + event.chartId, event);
  }, []);

  const onChartRangeSelectionChanged = useCallback(
    (event: ChartRangeSelectionChangedEvent) => {
      console.log(
        "Changed range selection of chart with ID " + event.chartId,
        event,
      );
    },
    [],
  );

  const onChartOptionsChanged = useCallback(
    (event: ChartOptionsChangedEvent) => {
      console.log("Changed options of chart with ID " + event.chartId, event);
    },
    [],
  );

  const onChartDestroyed = useCallback((event: ChartDestroyedEvent) => {
    console.log("Destroyed chart with ID " + event.chartId, event);
  }, []);

  return (
    <div style={containerStyle}>
      <div style={gridStyle}>
        <AgGridReact
          ref={gridRef}
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          cellSelection={true}
          popupParent={popupParent}
          enableCharts={true}
          onGridReady={onGridReady}
          onChartCreated={onChartCreated}
          onChartRangeSelectionChanged={onChartRangeSelectionChanged}
          onChartOptionsChanged={onChartOptionsChanged}
          onChartDestroyed={onChartDestroyed}
        />
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
