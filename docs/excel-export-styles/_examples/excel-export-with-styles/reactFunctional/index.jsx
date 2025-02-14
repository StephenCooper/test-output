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
  CellStyleModule,
  ClientSideRowModelModule,
  ModuleRegistry,
  TextFilterModule,
  ValidationModule,
  createGrid,
} from "ag-grid-community";
import {
  ColumnMenuModule,
  ContextMenuModule,
  ExcelExportModule,
} from "ag-grid-enterprise";
ModuleRegistry.registerModules([
  TextFilterModule,
  CellStyleModule,
  ClientSideRowModelModule,
  ExcelExportModule,
  ColumnMenuModule,
  ContextMenuModule,
  ValidationModule /* Development Only */,
]);

const GridExample = () => {
  const gridRef = useRef();
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);
  const [rowData, setRowData] = useState();
  const [columnDefs, setColumnDefs] = useState([
    { field: "athlete", minWidth: 200 },
    {
      field: "age",
      cellClassRules: {
        greenBackground: (params) => {
          return params.value < 23;
        },
        redFont: (params) => {
          return params.value < 20;
        },
      },
    },
    {
      field: "country",
      minWidth: 200,
      cellClassRules: {
        redFont: (params) => {
          return params.value === "United States";
        },
      },
    },
    {
      headerName: "Group",
      valueGetter: "data.country.charAt(0)",
      cellClass: ["redFont", "greenBackground"],
    },
    {
      field: "year",
      cellClassRules: {
        notInExcel: (params) => {
          return true;
        },
      },
    },
    { field: "sport", minWidth: 150 },
  ]);
  const defaultColDef = useMemo(() => {
    return {
      cellClassRules: {
        darkGreyBackground: (params) => {
          return (params.node.rowIndex || 0) % 2 == 0;
        },
      },
      filter: true,
      minWidth: 100,
      flex: 1,
    };
  }, []);
  const excelStyles = useMemo(() => {
    return [
      {
        id: "cell",
        alignment: {
          vertical: "Center",
        },
      },
      {
        id: "greenBackground",
        interior: {
          color: "#b5e6b5",
          pattern: "Solid",
        },
      },
      {
        id: "redFont",
        font: {
          fontName: "Calibri Light",
          underline: "Single",
          italic: true,
          color: "#BB0000",
        },
      },
      {
        id: "darkGreyBackground",
        interior: {
          color: "#888888",
          pattern: "Solid",
        },
        font: {
          fontName: "Calibri Light",
          color: "#ffffff",
        },
      },
    ];
  }, []);

  const onGridReady = useCallback((params) => {
    fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
      .then((resp) => resp.json())
      .then((data) => setRowData(data));
  }, []);

  const onBtnExportDataAsExcel = useCallback(() => {
    gridRef.current.api.exportDataAsExcel();
  }, []);

  return (
    <div style={containerStyle}>
      <div className="page-wrapper">
        <div>
          <button
            onClick={onBtnExportDataAsExcel}
            style={{ marginBottom: "5px", fontWeight: "bold" }}
          >
            Export to Excel
          </button>
        </div>

        <div className="grid-wrapper">
          <div style={gridStyle}>
            <AgGridReact
              ref={gridRef}
              rowData={rowData}
              columnDefs={columnDefs}
              defaultColDef={defaultColDef}
              excelStyles={excelStyles}
              onGridReady={onGridReady}
            />
          </div>
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
