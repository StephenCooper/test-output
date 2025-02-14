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
import "./style.css";
import {} from "./style.css.jsx";
import {
  AllCommunityModule,
  ModuleRegistry,
  createGrid,
  themeQuartz,
} from "ag-grid-community";
import { AllEnterpriseModule } from "ag-grid-enterprise";
import "./style.css";
ModuleRegistry.registerModules([AllCommunityModule, AllEnterpriseModule]);

const myCustomTheme = themeQuartz.withoutPart("checkboxStyle");

const GridExample = () => {
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);
  const [rowData, setRowData] = useState(
    (() => {
      const rowData = [];
      for (let i = 0; i < 10; i++) {
        rowData.push({
          make: "Toyota",
          model: "Celica",
          price: 35000 + i * 1000,
        });
        rowData.push({
          make: "Ford",
          model: "Mondeo",
          price: 32000 + i * 1000,
        });
        rowData.push({
          make: "Porsche",
          model: "Boxster",
          price: 72000 + i * 1000,
        });
      }
      return rowData;
    })(),
  );
  const [columnDefs, setColumnDefs] = useState([
    { field: "make" },
    { field: "model" },
    { field: "price" },
  ]);
  const theme = useMemo(() => {
    return myCustomTheme;
  }, []);
  const defaultColDef = useMemo(() => {
    return {
      editable: true,
      flex: 1,
      minWidth: 100,
      filter: true,
    };
  }, []);
  const initialState = useMemo(() => {
    return {
      rowSelection: ["1", "2", "3"],
    };
  }, []);
  const rowSelection = useMemo(() => {
    return { mode: "multiRow", checkboxes: true };
  }, []);

  return (
    <div style={containerStyle}>
      <div style={gridStyle}>
        <AgGridReact
          rowData={rowData}
          columnDefs={columnDefs}
          theme={theme}
          defaultColDef={defaultColDef}
          initialState={initialState}
          rowSelection={rowSelection}
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
