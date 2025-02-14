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
  ValidationModule,
  createGrid,
} from "ag-grid-community";
ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  ValidationModule /* Development Only */,
]);

const colSpan = function (params) {
  return params.data === 2 ? 3 : 1;
};

const fillAllCellsWithWidthMeasurement = () => {
  Array.prototype.slice
    .call(document.querySelectorAll(".ag-cell"))
    .forEach((cell) => {
      const width = cell.offsetWidth;
      const isFullWidthRow = cell.parentElement.childNodes.length === 1;
      cell.textContent = (isFullWidthRow ? "Total width: " : "") + width + "px";
    });
};

const GridExample = () => {
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);
  const [rowData, setRowData] = useState([1, 2]);
  const [columnDefs, setColumnDefs] = useState([
    {
      headerName: "A",
      field: "author",
      width: 300,
      colSpan: colSpan,
    },
    {
      headerName: "Flexed Columns",
      children: [
        {
          headerName: "B",
          minWidth: 200,
          maxWidth: 350,
          flex: 2,
        },
        {
          headerName: "C",
          flex: 1,
        },
      ],
    },
  ]);

  const onGridReady = useCallback((params) => {
    setInterval(fillAllCellsWithWidthMeasurement, 50);
  }, []);

  return (
    <div style={containerStyle}>
      <div style={gridStyle}>
        <AgGridReact
          rowData={rowData}
          columnDefs={columnDefs}
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
