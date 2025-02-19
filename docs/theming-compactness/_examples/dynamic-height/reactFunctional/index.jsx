"use client";

import React, { useCallback, useMemo, useState, StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { AgGridReact } from "ag-grid-react";
import { ModuleRegistry } from "ag-grid-community";
import { AllEnterpriseModule } from "ag-grid-enterprise";
ModuleRegistry.registerModules([AllEnterpriseModule]);
import { useFetchJson } from "./useFetchJson";

const GridExample = () => {
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);

  const [columnDefs, setColumnDefs] = useState([
    { field: "athlete", minWidth: 170 },
    { field: "age" },
    { field: "country" },
    { field: "year" },
    { field: "date" },
    { field: "sport" },
    { field: "gold" },
    { field: "silver" },
    { field: "bronze" },
    { field: "total" },
  ]);
  const defaultColDef = useMemo(() => {
    return {
      editable: true,
      filter: true,
    };
  }, []);

  const { data, loading } = useFetchJson(
    "https://www.ag-grid.com/example-assets/olympic-winners.json",
  );

  const changeSize = useCallback((value) => {
    document.documentElement.style.setProperty("--ag-spacing", `${value}px`);
    document.getElementById("spacing").innerText = value.toFixed(1);
  }, []);

  return (
    <div style={containerStyle}>
      <div
        style={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          gap: "0.5rem",
        }}
      >
        <div
          style={{
            flex: "none",
            display: "flex",
            gap: "8px",
            alignItems: "center",
          }}
        >
          spacing ={" "}
          <span style={{ minWidth: "50px" }}>
            <span id="spacing">8.0</span>px
          </span>
          <input
            type="range"
            onInput={() => changeSize(event.target.valueAsNumber)}
            defaultValue="8"
            min="0"
            max="20"
            step="0.1"
            style={{ width: "200px" }}
          />
        </div>

        <div style={gridStyle}>
          <AgGridReact
            rowData={data}
            loading={loading}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            sideBar={"columns"}
            animateRows={false}
          />
        </div>
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
