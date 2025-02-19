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
import "./styles.css";
import {
  ClientSideRowModelModule,
  ModuleRegistry,
  ValidationModule,
} from "ag-grid-community";
ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  ValidationModule /* Development Only */,
]);
import { useFetchJson } from "./useFetchJson";

const createNormalColDefs = () => {
  return [
    {
      headerName: "Athlete Details",
      headerClass: "participant-group",
      children: [
        { field: "athlete", colId: "athlete" },
        { field: "country", colId: "country" },
      ],
    },
    { field: "age", colId: "age" },
    {
      headerName: "Sports Results",
      headerClass: "medals-group",
      children: [
        { field: "sport", colId: "sport" },
        { field: "gold", colId: "gold" },
      ],
    },
  ];
};

const createExtraColDefs = () => {
  return [
    {
      headerName: "Athlete Details",
      headerClass: "participant-group",
      children: [
        { field: "athlete", colId: "athlete" },
        { field: "country", colId: "country" },
        { field: "region1", colId: "region1" },
        { field: "region2", colId: "region2" },
      ],
    },
    { field: "age", colId: "age" },
    { field: "distance", colId: "distance" },
    {
      headerName: "Sports Results",
      headerClass: "medals-group",
      children: [
        { field: "sport", colId: "sport" },
        { field: "gold", colId: "gold" },
      ],
    },
  ];
};

const GridExample = () => {
  const gridRef = useRef(null);
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);

  const defaultColDef = useMemo(() => {
    return {
      width: 150,
    };
  }, []);
  const [columnDefs, setColumnDefs] = useState(createNormalColDefs());

  const { data, loading } = useFetchJson(
    "https://www.ag-grid.com/example-assets/olympic-winners.json",
  );

  const onBtNormalCols = useCallback(() => {
    gridRef.current.api.setGridOption("columnDefs", createNormalColDefs());
  }, []);

  const onBtExtraCols = useCallback(() => {
    gridRef.current.api.setGridOption("columnDefs", createExtraColDefs());
  }, []);

  return (
    <div style={containerStyle}>
      <div className="test-container">
        <div className="test-header">
          <button onClick={onBtNormalCols}>Normal Cols</button>
          <button onClick={onBtExtraCols}>Extra Cols</button>
        </div>

        <div style={gridStyle} className="test-grid">
          <AgGridReact
            ref={gridRef}
            rowData={data}
            loading={loading}
            defaultColDef={defaultColDef}
            columnDefs={columnDefs}
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
