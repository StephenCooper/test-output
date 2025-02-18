"use client";

import React, { useCallback, useMemo, useState, StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { AgGridReact } from "ag-grid-react";
import {
  ClientSideRowModelModule,
  ModuleRegistry,
  NumberFilterModule,
  ValidationModule,
} from "ag-grid-community";
import {
  ColumnMenuModule,
  ColumnsToolPanelModule,
  ContextMenuModule,
  SetFilterModule,
} from "ag-grid-enterprise";
ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  ColumnsToolPanelModule,
  ColumnMenuModule,
  ContextMenuModule,
  SetFilterModule,
  NumberFilterModule,
  ValidationModule /* Development Only */,
]);

function replaceAccents(value) {
  return value
    .replace(new RegExp("[àáâãäå]", "g"), "a")
    .replace(new RegExp("æ", "g"), "ae")
    .replace(new RegExp("ç", "g"), "c")
    .replace(new RegExp("[èéêë]", "g"), "e")
    .replace(new RegExp("[ìíîï]", "g"), "i")
    .replace(new RegExp("ñ", "g"), "n")
    .replace(new RegExp("[òóôõøö]", "g"), "o")
    .replace(new RegExp("œ", "g"), "oe")
    .replace(new RegExp("[ùúûü]", "g"), "u")
    .replace(new RegExp("[ýÿ]", "g"), "y")
    .replace(new RegExp("\\W", "g"), "");
}

const filterParams = {
  textFormatter: replaceAccents,
};

const GridExample = () => {
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);
  const [rowData, setRowData] = useState();
  const [columnDefs, setColumnDefs] = useState([
    // set filter
    {
      field: "athlete",
      filter: "agSetColumnFilter",
      filterParams: filterParams,
    },
    // number filters
    { field: "gold", filter: "agNumberColumnFilter" },
    { field: "silver", filter: "agNumberColumnFilter" },
    { field: "bronze", filter: "agNumberColumnFilter" },
  ]);
  const defaultColDef = useMemo(() => {
    return {
      flex: 1,
      minWidth: 200,
      floatingFilter: true,
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
