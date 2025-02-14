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
  ClientSideRowModelModule,
  ModuleRegistry,
  NumberFilterModule,
  TextFilterModule,
  ValidationModule,
  createGrid,
} from "ag-grid-community";
import {
  ColumnMenuModule,
  ColumnsToolPanelModule,
  ContextMenuModule,
} from "ag-grid-enterprise";
ModuleRegistry.registerModules([
  TextFilterModule,
  NumberFilterModule,
  ClientSideRowModelModule,
  ColumnsToolPanelModule,
  ColumnMenuModule,
  ContextMenuModule,
  ValidationModule /* Development Only */,
]);

const GridExample = () => {
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);
  const [rowData, setRowData] = useState();
  const [columnDefs, setColumnDefs] = useState([
    {
      field: "athlete",
      minWidth: 200,
      filter: true,
      suppressHeaderMenuButton: true,
    },
    {
      field: "age",
      filter: true,
      floatingFilter: true,
      suppressHeaderMenuButton: true,
    },
    {
      field: "country",
      minWidth: 200,
      filter: true,
      suppressHeaderFilterButton: true,
    },
    {
      field: "year",
      filter: true,
      floatingFilter: true,
      suppressHeaderFilterButton: true,
    },
    { field: "sport", minWidth: 200, suppressHeaderContextMenu: true },
    {
      field: "gold",
      suppressHeaderMenuButton: true,
      suppressHeaderFilterButton: true,
    },
    {
      field: "silver",
      filter: true,
      suppressHeaderMenuButton: true,
      suppressHeaderFilterButton: true,
    },
    {
      field: "bronze",
      filter: true,
      floatingFilter: true,
      suppressHeaderMenuButton: true,
      suppressHeaderFilterButton: true,
    },
    {
      field: "total",
      filter: true,
      suppressHeaderMenuButton: true,
      suppressHeaderFilterButton: true,
      suppressHeaderContextMenu: true,
    },
  ]);
  const defaultColDef = useMemo(() => {
    return {
      flex: 1,
      minWidth: 100,
    };
  }, []);

  const onGridReady = useCallback((params) => {
    fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
      .then((resp) => resp.json())
      .then((data) => setRowData(data));
  }, []);

  return (
    <div style={containerStyle}>
      <div style={gridStyle}>
        <AgGridReact
          rowData={rowData}
          columnDefs={columnDefs}
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
