"use client";

import React, {
  useCallback,
  useMemo,
  useRef,
  useState,
  StrictMode,
} from "react";
import { createRoot } from "react-dom/client";
import { AgGridReact } from "ag-grid-react";
import {
  CellSelectionOptions,
  ColDef,
  ColGroupDef,
  GridApi,
  GridOptions,
  ModuleRegistry,
  Theme,
  themeQuartz,
} from "ag-grid-community";
import { AllEnterpriseModule } from "ag-grid-enterprise";
import { IOlympicData } from "./interfaces";
ModuleRegistry.registerModules([AllEnterpriseModule]);
import { useFetchJson } from "./useFetchJson";

const myTheme = themeQuartz.withParams({
  // color and style of border around selection
  rangeSelectionBorderColor: "rgb(193, 0, 97)",
  rangeSelectionBorderStyle: "dashed",
  // background color of selection - you can use a semi-transparent color
  // and it wil overlay on top of the existing cells
  rangeSelectionBackgroundColor: "rgb(255, 0, 128, 0.1)",
  // color used to indicate that data has been copied form the cell range
  rangeSelectionHighlightColor: "rgb(60, 188, 0, 0.3)",
});

const GridExample = () => {
  const { data, loading } = useFetchJson<IOlympicData>(
    "https://www.ag-grid.com/example-assets/olympic-winners.json",
  );
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);

  const theme = useMemo<Theme | "legacy">(() => {
    return myTheme;
  }, []);
  const [columnDefs, setColumnDefs] = useState<ColDef[]>([
    { field: "athlete", minWidth: 150 },
    { field: "age", maxWidth: 90 },
    { field: "country", minWidth: 150 },
    { field: "year", maxWidth: 90 },
    { field: "date", minWidth: 150 },
    { field: "sport", minWidth: 150 },
    { field: "gold" },
    { field: "silver" },
    { field: "bronze" },
    { field: "total" },
  ]);
  const defaultColDef = useMemo<ColDef>(() => {
    return {
      flex: 1,
      minWidth: 100,
    };
  }, []);

  return (
    <div style={containerStyle}>
      <div style={gridStyle}>
        <AgGridReact<IOlympicData>
          rowData={data}
          loading={loading}
          theme={theme}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          cellSelection={true}
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
