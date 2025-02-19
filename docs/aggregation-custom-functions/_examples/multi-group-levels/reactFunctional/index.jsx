"use client";

import React, { useMemo, useState, StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { AgGridReact } from "ag-grid-react";
import {
  ClientSideRowModelModule,
  ModuleRegistry,
  ValidationModule,
} from "ag-grid-community";
import {
  ColumnMenuModule,
  ColumnsToolPanelModule,
  ContextMenuModule,
  RowGroupingModule,
  SetFilterModule,
} from "ag-grid-enterprise";
ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  ColumnsToolPanelModule,
  ColumnMenuModule,
  ContextMenuModule,
  RowGroupingModule,
  SetFilterModule,
  ValidationModule /* Development Only */,
]);
import { useFetchJson } from "./useFetchJson";

const GridExample = () => {
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);

  const [columnDefs, setColumnDefs] = useState([
    { field: "country", rowGroup: true, hide: true },
    { field: "year", rowGroup: true, hide: true },
    { field: "total", aggFunc: "simpleRange" },
    { field: "total", aggFunc: "range" },
  ]);
  const defaultColDef = useMemo(() => {
    return {
      flex: 1,
      minWidth: 150,
    };
  }, []);
  const autoGroupColumnDef = useMemo(() => {
    return {
      minWidth: 220,
    };
  }, []);
  const aggFuncs = useMemo(() => {
    return {
      simpleRange: (params) => {
        const values = params.values;
        const max = Math.max(...values);
        const min = Math.min(...values);
        return max - min;
      },
      range: (params) => {
        const values = params.values;
        if (params.rowNode.leafGroup) {
          const max = Math.max(...values);
          const min = Math.min(...values);
          return {
            max: max,
            min: min,
            value: max - min,
          };
        }
        let max = values[0].max;
        let min = values[0].min;
        values.forEach((value) => {
          max = Math.max(max, value.max);
          min = Math.min(min, value.min);
        });
        return {
          max: max,
          min: min,
          value: max - min,
        };
      },
    };
  }, []);

  const { data, loading } = useFetchJson(
    "https://www.ag-grid.com/example-assets/olympic-winners.json",
  );

  return (
    <div style={containerStyle}>
      <div style={gridStyle}>
        <AgGridReact
          rowData={data}
          loading={loading}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          autoGroupColumnDef={autoGroupColumnDef}
          aggFuncs={aggFuncs}
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
