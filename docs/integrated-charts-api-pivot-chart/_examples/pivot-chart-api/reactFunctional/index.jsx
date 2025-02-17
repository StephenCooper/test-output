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
  NumberEditorModule,
  NumberFilterModule,
  RowApiModule,
  TextEditorModule,
  TextFilterModule,
  ValidationModule,
} from "ag-grid-community";
import {
  ColumnMenuModule,
  ContextMenuModule,
  IntegratedChartsModule,
  PivotModule,
} from "ag-grid-enterprise";
ModuleRegistry.registerModules([
  NumberEditorModule,
  TextEditorModule,
  TextFilterModule,
  NumberFilterModule,
  RowApiModule,
  ClientSideRowModelModule,
  IntegratedChartsModule.with(AgChartsEnterpriseModule),
  ColumnMenuModule,
  ContextMenuModule,
  PivotModule,
  ValidationModule /* Development Only */,
]);
import { useFetchJson } from "./useFetchJson";

const GridExample = () => {
  const gridRef = useRef(null);
  const { data, loading } = useFetchJson(
    "https://www.ag-grid.com/example-assets/wide-spread-of-sports.json",
  );
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);

  const [columnDefs, setColumnDefs] = useState([
    { field: "country", pivot: true },
    { field: "year", rowGroup: true },
    { field: "sport", rowGroup: true },
    { field: "total", aggFunc: "sum" },
    { field: "gold", aggFunc: "sum" },
  ]);
  const defaultColDef = useMemo(() => {
    return {
      editable: true,
      flex: 1,
      minWidth: 150,
      filter: true,
    };
  }, []);
  const autoGroupColumnDef = useMemo(() => {
    return {
      minWidth: 150,
    };
  }, []);
  const popupParent = useMemo(() => {
    return document.body;
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
    params.api.createPivotChart({
      chartType: "groupedColumn",
      chartContainer: document.querySelector("#myChart"),
      chartThemeOverrides: {
        common: {
          navigator: {
            enabled: true,
            height: 10,
          },
        },
      },
    });
    // expand one row for demonstration purposes
    setTimeout(() => params.api.getDisplayedRowAtIndex(2).setExpanded(true), 0);
  }, []);

  return (
    <div style={containerStyle}>
      <div id="container">
        <div id="myGrid" style={gridStyle}>
          <AgGridReact
            ref={gridRef}
            rowData={data}
            loading={loading}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            autoGroupColumnDef={autoGroupColumnDef}
            pivotMode={true}
            popupParent={popupParent}
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
