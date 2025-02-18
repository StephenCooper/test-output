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
import "./styles.css";
import { AgChartsEnterpriseModule } from "ag-charts-enterprise";
import {
  AgChartThemeOverrides,
  CellSelectionOptions,
  ChartCreatedEvent,
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  CreateRangeChartParams,
  FirstDataRenderedEvent,
  GetChartImageDataUrlParams,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ModuleRegistry,
  NumberEditorModule,
  TextEditorModule,
  TextFilterModule,
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
  TextEditorModule,
  TextFilterModule,
  NumberEditorModule,
  ClientSideRowModelModule,
  IntegratedChartsModule.with(AgChartsEnterpriseModule),
  ColumnMenuModule,
  ContextMenuModule,
  RowGroupingModule,
  ValidationModule /* Development Only */,
]);

let chartId: string | undefined;

const GridExample = () => {
  const gridRef = useRef<AgGridReact>(null);
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);
  const [rowData, setRowData] = useState<any[]>();
  const [columnDefs, setColumnDefs] = useState<ColDef[]>([
    { field: "country", chartDataType: "category" },
    { field: "sugar", chartDataType: "series" },
    { field: "fat", chartDataType: "series" },
    { field: "weight", chartDataType: "series" },
  ]);
  const defaultColDef = useMemo<ColDef>(() => {
    return {
      editable: true,
      flex: 1,
      minWidth: 100,
      filter: true,
    };
  }, []);
  const popupParent = useMemo<HTMLElement | null>(() => {
    return document.body;
  }, []);
  const chartThemeOverrides = useMemo<AgChartThemeOverrides>(() => {
    return {
      bar: {
        axes: {
          category: {
            label: {
              rotation: 335,
            },
          },
        },
      },
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

  const onFirstDataRendered = useCallback((params: FirstDataRenderedEvent) => {
    const createRangeChartParams: CreateRangeChartParams = {
      cellRange: {
        columns: ["country", "sugar", "fat", "weight"],
      },
      chartType: "groupedColumn",
      chartContainer: document.querySelector("#myChart") as any,
    };
    params.api.createRangeChart(createRangeChartParams);
  }, []);

  const onChartCreated = useCallback((event: ChartCreatedEvent) => {
    chartId = event.chartId;
  }, []);

  const downloadChart = useCallback(
    (dimensions: { width: number; height: number }) => {
      if (!chartId) return;
      gridRef.current!.api.downloadChart({
        fileName: "resizedImage",
        fileFormat: "image/jpeg",
        chartId,
        dimensions,
      });
    },
    [chartId],
  );

  const downloadChartImage = useCallback(
    (fileFormat: string) => {
      if (!chartId) return;
      const params: GetChartImageDataUrlParams = { fileFormat, chartId };
      const imageDataURL = gridRef.current!.api.getChartImageDataURL(params);
      if (imageDataURL) {
        const a = document.createElement("a");
        a.href = imageDataURL;
        a.download = "image";
        a.style.display = "none";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
    },
    [chartId],
  );

  const openChartImage = useCallback(
    (fileFormat: string) => {
      if (!chartId) return;
      const params: GetChartImageDataUrlParams = { fileFormat, chartId };
      const imageDataURL = gridRef.current!.api.getChartImageDataURL(params);
      if (imageDataURL) {
        const image = new Image();
        image.src = imageDataURL;
        const w = window.open("")!;
        w.document.write(image.outerHTML);
        w.document.close();
      }
    },
    [chartId, Image, window],
  );

  return (
    <div style={containerStyle}>
      <div className="wrapper">
        <div id="buttons">
          <button onClick={() => downloadChartImage("image/png")}>
            Download Chart Image (PNG)
          </button>
          <button onClick={() => downloadChart({ width: 800, height: 500 })}>
            Download Chart Image (JPG 800x500)
          </button>
          <button onClick={() => openChartImage("image/jpeg")}>
            Open Chart Image (JPG)
          </button>
        </div>

        <div id="myGrid" style={gridStyle}>
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
