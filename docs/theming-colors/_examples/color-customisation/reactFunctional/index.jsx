"use client";

import React, { useCallback, useMemo, useState, StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { AgGridReact } from "ag-grid-react";
import {
  AllCommunityModule,
  ModuleRegistry,
  themeQuartz,
} from "ag-grid-community";
ModuleRegistry.registerModules([AllCommunityModule]);

const myTheme = themeQuartz.withParams({
  backgroundColor: "rgb(249, 245, 227)",
  foregroundColor: "rgb(126, 46, 132)",
  headerTextColor: "rgb(204, 245, 172)",
  headerBackgroundColor: "rgb(209, 64, 129)",
  oddRowBackgroundColor: "rgb(0, 0, 0, 0.03)",
  headerColumnResizeHandleColor: "rgb(126, 46, 132)",
});

const GridExample = () => {
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);
  const [rowData, setRowData] = useState();
  const [columnDefs, setColumnDefs] = useState([
    { field: "athlete", minWidth: 170 },
    { field: "age" },
    { field: "country" },
    { field: "year" },
    { field: "date" },
  ]);
  const theme = useMemo(() => {
    return myTheme;
  }, []);
  const defaultColDef = useMemo(() => {
    return {
      editable: true,
      filter: true,
    };
  }, []);

  const onGridReady = useCallback((params) => {
    fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
      .then((resp) => resp.json())
      .then((data) => setRowData(data));
  }, []);

  return (
    <div style={containerStyle}>
      <div style={gridStyle} className="ag-theme-quartz">
        <AgGridReact
          rowData={rowData}
          columnDefs={columnDefs}
          theme={theme}
          defaultColDef={defaultColDef}
          onGridReady={onGridReady}
        />
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
