"use client";

import React, { useCallback, useMemo, useState, StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { AgGridReact } from "ag-grid-react";
import {
  ClientSideRowModelModule,
  ModuleRegistry,
  RowApiModule,
  RowSelectionModule,
  ValidationModule,
} from "ag-grid-community";
import {
  ColumnMenuModule,
  ColumnsToolPanelModule,
  ContextMenuModule,
  RowGroupingModule,
} from "ag-grid-enterprise";
ModuleRegistry.registerModules([
  RowSelectionModule,
  RowApiModule,
  ClientSideRowModelModule,
  ColumnsToolPanelModule,
  ColumnMenuModule,
  ContextMenuModule,
  RowGroupingModule,
  ValidationModule /* Development Only */,
]);
import { useFetchJson } from "./useFetchJson";

const GridExample = () => {
  const { data, loading } = useFetchJson(
    "https://www.ag-grid.com/example-assets/small-olympic-winners.json",
  );
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);

  const [columnDefs, setColumnDefs] = useState([
    { field: "athlete" },
    { field: "sport" },
    { field: "year", maxWidth: 120 },
  ]);
  const defaultColDef = useMemo(() => {
    return {
      flex: 1,
      minWidth: 100,
    };
  }, []);
  const rowSelection = useMemo(() => {
    return {
      mode: "multiRow",
      checkboxes: (params) => params.data?.year === 2012,
    };
  }, []);

  const onFirstDataRendered = useCallback((params) => {
    const nodesToSelect = [];
    params.api.forEachNode((node) => {
      if (node.data && node.data.year <= 2008 && node.data.year >= 2004) {
        nodesToSelect.push(node);
      }
    });
    params.api.setNodesSelected({ nodes: nodesToSelect, newValue: true });
  }, []);

  return (
    <div style={containerStyle}>
      <div style={gridStyle}>
        <AgGridReact
          rowData={data}
          loading={loading}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          rowSelection={rowSelection}
          onFirstDataRendered={onFirstDataRendered}
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
