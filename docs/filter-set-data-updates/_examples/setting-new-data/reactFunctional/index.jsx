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
  TextEditorModule,
  TextFilterModule,
  ValidationModule,
  createGrid,
} from "ag-grid-community";
import {
  ColumnMenuModule,
  ColumnsToolPanelModule,
  ContextMenuModule,
  FiltersToolPanelModule,
  SetFilterModule,
} from "ag-grid-enterprise";
ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  ColumnsToolPanelModule,
  FiltersToolPanelModule,
  ColumnMenuModule,
  ContextMenuModule,
  SetFilterModule,
  TextFilterModule,
  TextEditorModule,
  ValidationModule /* Development Only */,
]);

const getRowData = () => {
  return [{ col1: "A" }, { col1: "A" }, { col1: "B" }, { col1: "C" }];
};

const GridExample = () => {
  const gridRef = useRef();
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);
  const [rowData, setRowData] = useState(getRowData());
  const [columnDefs, setColumnDefs] = useState([
    {
      headerName: "Set Filter Column",
      field: "col1",
      filter: "agSetColumnFilter",
      editable: true,
      minWidth: 250,
    },
  ]);

  const onFirstDataRendered = useCallback((params) => {
    params.api.getToolPanelInstance("filters").expandFilters();
  }, []);

  const updateOne = useCallback(() => {
    const newData = [
      { col1: "A" },
      { col1: "A" },
      { col1: "C" },
      { col1: "D" },
      { col1: "E" },
    ];
    setRowData(newData);
  }, []);

  const updateTwo = useCallback(() => {
    const newData = [
      { col1: "A" },
      { col1: "A" },
      { col1: "B" },
      { col1: "C" },
      { col1: "D" },
      { col1: "E" },
      { col1: "B" },
      { col1: "B" },
    ];
    setRowData(newData);
  }, []);

  const reset = useCallback(() => {
    gridRef.current.api.setFilterModel(null);
    setRowData(getRowData());
  }, []);

  return (
    <div style={containerStyle}>
      <div className="example-wrapper">
        <div style={{ marginBottom: "5px" }}>
          <button onClick={updateOne}>Apply Data Update 1</button>
          <button onClick={updateTwo}>Apply Data Update 2</button>
          <button onClick={reset} style={{ marginLeft: "5px" }}>
            Reset
          </button>
        </div>

        <div style={gridStyle}>
          <AgGridReact
            ref={gridRef}
            rowData={rowData}
            columnDefs={columnDefs}
            sideBar={"filters"}
            onFirstDataRendered={onFirstDataRendered}
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
