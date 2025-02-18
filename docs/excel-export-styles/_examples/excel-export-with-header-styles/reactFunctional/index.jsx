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
  NumberFilterModule,
  TextFilterModule,
  ValidationModule,
} from "ag-grid-community";
import {
  ColumnMenuModule,
  ContextMenuModule,
  ExcelExportModule,
} from "ag-grid-enterprise";
ModuleRegistry.registerModules([
  TextFilterModule,
  NumberFilterModule,
  ClientSideRowModelModule,
  ExcelExportModule,
  ColumnMenuModule,
  ContextMenuModule,
  ValidationModule /* Development Only */,
]);

const GridExample = () => {
  const gridRef = useRef(null);
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);
  const [rowData, setRowData] = useState();
  const [columnDefs, setColumnDefs] = useState([
    { field: "athlete" },
    { field: "sport", minWidth: 150 },
    {
      headerName: "Medals",
      children: [
        { field: "gold", headerClass: "gold-header" },
        { field: "silver", headerClass: "silver-header" },
        { field: "bronze", headerClass: "bronze-header" },
      ],
    },
  ]);
  const defaultColDef = useMemo(() => {
    return {
      filter: true,
      minWidth: 100,
      flex: 1,
    };
  }, []);
  const defaultExcelExportParams = useMemo(() => {
    return {
      headerRowHeight: 30,
    };
  }, []);
  const excelStyles = useMemo(() => {
    return [
      {
        id: "header",
        alignment: {
          vertical: "Center",
        },
        interior: {
          color: "#f8f8f8",
          pattern: "Solid",
          patternColor: undefined,
        },
        borders: {
          borderBottom: {
            color: "#ffab00",
            lineStyle: "Continuous",
            weight: 1,
          },
        },
      },
      {
        id: "headerGroup",
        font: {
          bold: true,
        },
      },
      {
        id: "gold-header",
        interior: {
          color: "#E4AB11",
          pattern: "Solid",
        },
      },
      {
        id: "silver-header",
        interior: {
          color: "#bbb4bb",
          pattern: "Solid",
        },
      },
      {
        id: "bronze-header",
        interior: {
          color: "#be9088",
          pattern: "Solid",
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
              defaultExcelExportParams={defaultExcelExportParams}
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
