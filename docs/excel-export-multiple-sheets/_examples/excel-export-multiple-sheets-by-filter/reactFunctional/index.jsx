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
  RowApiModule,
  ValidationModule,
} from "ag-grid-community";
import {
  ColumnMenuModule,
  ContextMenuModule,
  ExcelExportModule,
  SetFilterModule,
} from "ag-grid-enterprise";
ModuleRegistry.registerModules([
  NumberFilterModule,
  RowApiModule,
  ClientSideRowModelModule,
  ExcelExportModule,
  ColumnMenuModule,
  ContextMenuModule,
  SetFilterModule,
  ValidationModule /* Development Only */,
]);

const GridExample = () => {
  const gridRef = useRef(null);
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);
  const [rowData, setRowData] = useState();
  const [columnDefs, setColumnDefs] = useState([
    { field: "athlete", minWidth: 200 },
    { field: "age" },
    { field: "country", minWidth: 200 },
    { field: "year" },
    { field: "date", minWidth: 150 },
    { field: "sport", minWidth: 150 },
    { field: "gold" },
    { field: "silver" },
  ]);
  const defaultColDef = useMemo(() => {
    return {
      filter: true,
      minWidth: 100,
      flex: 1,
    };
  }, []);

  const onGridReady = useCallback((params) => {
    fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
      .then((resp) => resp.json())
      .then((data) => setRowData(data));
  }, []);

  const onBtExport = useCallback(() => {
    const sports = {};
    gridRef.current.api.forEachNode(function (node) {
      if (!sports[node.data.sport]) {
        sports[node.data.sport] = true;
      }
    });
    let spreadsheets = [];
    const performExport = async () => {
      for (const sport in sports) {
        await gridRef.current.api.setColumnFilterModel("sport", {
          values: [sport],
        });
        gridRef.current.api.onFilterChanged();
        if (gridRef.current.api.getColumnFilterModel("sport") == null) {
          throw new Error("Example error: Filter not applied");
        }
        const sheet = gridRef.current.api.getSheetDataForExcel({
          sheetName: sport,
        });
        if (sheet) {
          spreadsheets.push(sheet);
        }
      }
      await gridRef.current.api.setColumnFilterModel("sport", null);
      gridRef.current.api.onFilterChanged();
      gridRef.current.api.exportMultipleSheetsAsExcel({
        data: spreadsheets,
        fileName: "ag-grid.xlsx",
      });
      spreadsheets = [];
    };
    performExport();
  }, []);

  return (
    <div style={containerStyle}>
      <div className="container">
        <div>
          <button
            onClick={onBtExport}
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
