"use client";

import React, { useCallback, useMemo, useState, StrictMode } from "react";
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
  ValidationModule /* Development Only */,
]);

const filterParams = {
  comparator: (a, b) => {
    const valA = a == null ? 0 : parseInt(a);
    const valB = b == null ? 0 : parseInt(b);
    if (valA === valB) return 0;
    return valA > valB ? 1 : -1;
  },
};

function getRowData() {
  const rows = [];
  for (let i = 1; i < 117; i++) {
    rows.push({ age: i });
  }
  return rows;
}

const GridExample = () => {
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);
  const [rowData, setRowData] = useState(getRowData());
  const [columnDefs, setColumnDefs] = useState([
    {
      headerName: "Age (No Comparator)",
      field: "age",
      filter: "agSetColumnFilter",
    },
    {
      headerName: "Age (With Comparator)",
      field: "age",
      filter: "agSetColumnFilter",
      filterParams: filterParams,
    },
  ]);
  const defaultColDef = useMemo(() => {
    return {
      flex: 1,
      filter: true,
      cellDataType: false,
    };
  }, []);

  const onGridReady = useCallback((params) => {
    params.api.getToolPanelInstance("filters").expandFilters();
  }, []);

  return (
    <div style={containerStyle}>
      <div style={gridStyle}>
        <AgGridReact
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          sideBar={"filters"}
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
