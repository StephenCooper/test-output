"use client";

import React, { useCallback, useMemo, useState, StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { AgGridReact } from "ag-grid-react";
import {
  ClientSideRowModelModule,
  ModuleRegistry,
  ValidationModule,
} from "ag-grid-community";
import { RowGroupingModule } from "ag-grid-enterprise";
import CustomGroupCellRenderer from "./customGroupCellRenderer.jsx";
ModuleRegistry.registerModules([
  ClientSideRowModelModule,
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
    {
      field: "country",
      rowGroup: true,
      hide: true,
    },
    {
      field: "year",
      rowGroup: true,
      hide: true,
    },
    {
      field: "athlete",
    },
    {
      field: "total",
      aggFunc: "sum",
    },
  ]);
  const autoGroupColumnDef = useMemo(() => {
    return {
      cellRenderer: CustomGroupCellRenderer,
    };
  }, []);
  const defaultColDef = useMemo(() => {
    return {
      flex: 1,
      minWidth: 120,
    };
  }, []);

  const onCellDoubleClicked = useCallback((params) => {
    if (params.colDef.showRowGroup) {
      params.node.setExpanded(!params.node.expanded);
    }
  }, []);

  const onCellKeyDown = useCallback((params) => {
    if (!("colDef" in params)) {
      return;
    }
    if (!(params.event instanceof KeyboardEvent)) {
      return;
    }
    if (params.event.code !== "Enter") {
      return;
    }
    if (params.colDef.showRowGroup) {
      params.node.setExpanded(!params.node.expanded);
    }
  }, []);

  return (
    <div style={containerStyle}>
      <div style={gridStyle}>
        <AgGridReact
          rowData={data}
          loading={loading}
          columnDefs={columnDefs}
          autoGroupColumnDef={autoGroupColumnDef}
          defaultColDef={defaultColDef}
          groupDefaultExpanded={1}
          onCellDoubleClicked={onCellDoubleClicked}
          onCellKeyDown={onCellKeyDown}
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
