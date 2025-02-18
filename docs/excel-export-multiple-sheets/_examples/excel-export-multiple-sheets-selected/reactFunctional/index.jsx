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
  RowSelectionModule,
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
  RowSelectionModule,
  RowApiModule,
  ClientSideRowModelModule,
  ExcelExportModule,
  ColumnMenuModule,
  ContextMenuModule,
  ValidationModule /* Development Only */,
]);
import { useFetchJson } from "./useFetchJson";

const GridExample = () => {
  const gridRef = useRef(null);
  const { data, loading } = useFetchJson(
    "https://www.ag-grid.com/example-assets/olympic-winners.json",
  );
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);

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
  const rowSelection = useMemo(() => {
    return {
      mode: "multiRow",
      checkboxes: false,
      headerCheckbox: false,
    };
  }, []);

  const onBtExport = useCallback(() => {
    const spreadsheets = [];
    let nodesToExport = [];
    gridRef.current.api.forEachNode((node, index) => {
      nodesToExport.push(node);
      if (index % 100 === 99) {
        gridRef.current.api.setNodesSelected({
          nodes: nodesToExport,
          newValue: true,
        });
        spreadsheets.push(
          gridRef.current.api.getSheetDataForExcel({
            onlySelected: true,
          }),
        );
        gridRef.current.api.deselectAll();
        nodesToExport = [];
      }
    });
    // check if the last page was exported
    if (gridRef.current.api.getSelectedNodes().length) {
      spreadsheets.push(
        gridRef.current.api.getSheetDataForExcel({
          onlySelected: true,
        }),
      );
      gridRef.current.api.deselectAll();
    }
    gridRef.current.api.exportMultipleSheetsAsExcel({
      data: spreadsheets,
      fileName: "ag-grid.xlsx",
    });
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
              rowData={data}
              loading={loading}
              columnDefs={columnDefs}
              defaultColDef={defaultColDef}
              rowSelection={rowSelection}
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
