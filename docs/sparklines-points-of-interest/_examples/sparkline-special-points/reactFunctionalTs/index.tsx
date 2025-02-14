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
import {
  AgChartsCommunityModule,
  AgSparklineOptions,
} from "ag-charts-community";
import {
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  GridApi,
  GridOptions,
  ModuleRegistry,
  ValidationModule,
  createGrid,
} from "ag-grid-community";
import { SparklinesModule } from "ag-grid-enterprise";
import { getData } from "./data";
ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  SparklinesModule.with(AgChartsCommunityModule),
  ValidationModule /* Development Only */,
]);

const palette = {
  blue: "rgb(20,94,140)",
  lightBlue: "rgb(182,219,242)",
  green: "rgb(63,141,119)",
  lightGreen: "rgba(75,168,142, 0.2)",
};

function barItemStyler(params: any) {
  const { yValue, highlighted } = params;
  if (highlighted) {
    return;
  }
  return { fill: yValue <= 50 ? palette.lightBlue : palette.blue };
}

function lineItemStyler(params: any) {
  const { first, last, highlighted } = params;
  const color = highlighted
    ? palette.blue
    : last
      ? palette.lightBlue
      : palette.green;
  return {
    size: highlighted || first || last ? 5 : 0,
    fill: color,
    stroke: color,
  };
}

function columnItemStyler(params: any) {
  const { yValue, highlighted } = params;
  if (highlighted) {
    return;
  }
  return { fill: yValue < 0 ? palette.lightBlue : palette.blue };
}

function areaItemStyler(params: any) {
  const { min, highlighted } = params;
  return {
    size: min || highlighted ? 5 : 0,
    fill: palette.green,
    stroke: palette.green,
  };
}

const GridExample = () => {
  const gridRef = useRef<AgGridReact>(null);
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);
  const [rowData, setRowData] = useState<any[]>(getData());
  const [columnDefs, setColumnDefs] = useState<ColDef[]>([
    {
      field: "bar",
      headerName: "Bar Sparkline",
      minWidth: 100,
      cellRenderer: "agSparklineCellRenderer",
      cellRendererParams: {
        sparklineOptions: {
          type: "bar",
          direction: "horizontal",
          min: 0,
          max: 100,
          label: {
            enabled: true,
            color: "#5577CC",
            placement: "outside-end",
            formatter: function (params) {
              return `${params.value}%`;
            },
            fontSize: 8,
            fontWeight: "bold",
            fontFamily: "Arial, Helvetica, sans-serif",
          },
          padding: {
            top: 15,
            bottom: 15,
          },
          itemStyler: barItemStyler,
        } as AgSparklineOptions,
      },
    },
    {
      field: "line",
      headerName: "Line Sparkline",
      minWidth: 100,
      cellRenderer: "agSparklineCellRenderer",
      cellRendererParams: {
        sparklineOptions: {
          type: "line",
          stroke: "rgb(63,141,119)",
          padding: {
            top: 10,
            bottom: 10,
          },
          marker: {
            enabled: true,
            itemStyler: lineItemStyler,
          },
        } as AgSparklineOptions,
      },
    },
    {
      field: "column",
      headerName: "Column Sparkline",
      minWidth: 100,
      cellRenderer: "agSparklineCellRenderer",
      cellRendererParams: {
        sparklineOptions: {
          type: "bar",
          direction: "vertical",
          label: {
            color: "#5577CC",
            enabled: true,
            placement: "outside-end",
            fontSize: 8,
            fontFamily: "Arial, Helvetica, sans-serif",
          },
          padding: {
            top: 15,
            bottom: 15,
          },
          itemStyler: columnItemStyler,
        } as AgSparklineOptions,
      },
    },
    {
      field: "area",
      headerName: "Area Sparkline",
      minWidth: 100,
      cellRenderer: "agSparklineCellRenderer",
      cellRendererParams: {
        sparklineOptions: {
          type: "area",
          fill: "rgba(75,168,142, 0.2)",
          stroke: "rgb(63,141,119)",
          padding: {
            top: 10,
            bottom: 10,
          },
          marker: {
            enabled: true,
            itemStyler: areaItemStyler,
          },
        } as AgSparklineOptions,
      },
    },
  ]);
  const defaultColDef = useMemo<ColDef>(() => {
    return {
      flex: 1,
      minWidth: 100,
    };
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

  return (
    <div style={containerStyle}>
      <div style={gridStyle}>
        <AgGridReact
          ref={gridRef}
          rowData={rowData}
          rowHeight={70}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
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
