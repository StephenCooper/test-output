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
  CsvExportModule,
  ModuleRegistry,
  NumberEditorModule,
  TextEditorModule,
  ValidationModule,
} from "ag-grid-community";
import { ColumnMenuModule, ContextMenuModule } from "ag-grid-enterprise";
ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  CsvExportModule,
  ColumnMenuModule,
  ContextMenuModule,
  NumberEditorModule,
  TextEditorModule,
  ValidationModule /* Development Only */,
]);

function getBoolean(inputSelector) {
  return !!document.querySelector(inputSelector).checked;
}

function getParams() {
  return {
    suppressQuotes: getBoolean("#suppressQuotes"),
  };
}

const GridExample = () => {
  const gridRef = useRef(null);
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);
  const [rowData, setRowData] = useState([
    { make: "Toyota", model: "Celica", price: 35000 },
    { make: "Ford", model: "Mondeo", price: 32000 },
    { make: "Porsche", model: "Boxster", price: 72000 },
  ]);
  const defaultColDef = useMemo(() => {
    return {
      editable: true,
      minWidth: 100,
      flex: 1,
    };
  }, []);
  const popupParent = useMemo(() => {
    return document.body;
  }, []);
  const [columnDefs, setColumnDefs] = useState([
    { field: "make" },
    { field: "model" },
    { field: "price" },
  ]);

  const onBtnExport = useCallback(() => {
    const params = getParams();
    if (params.suppressQuotes) {
      alert(
        "NOTE: you are downloading a file with non-standard quotes - it may not render correctly in Excel.",
      );
    }
    gridRef.current.api.exportDataAsCsv(params);
  }, [alert]);

  const onBtnUpdate = useCallback(() => {
    document.querySelector("#csvResult").value =
      gridRef.current.api.getDataAsCsv(getParams());
  }, []);

  return (
    <div style={containerStyle}>
      <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
        <div style={{ display: "flex" }}>
          <div>
            <div className="row">
              <label htmlFor="suppressQuotes">
                <input type="checkbox" id="suppressQuotes" />
                suppressQuotes
              </label>
            </div>
          </div>
        </div>

        <div style={{ margin: "10px 0" }}>
          <button onClick={onBtnUpdate}>Show CSV export content text</button>
          <button onClick={onBtnExport}>Download CSV export file</button>
        </div>

        <div
          style={{
            flex: "1 1 0",
            position: "relative",
            display: "flex",
            flexDirection: "row",
            gap: "20px",
          }}
        >
          <div id="gridContainer" style={{ flex: "1" }}>
            <div style={gridStyle}>
              <AgGridReact
                ref={gridRef}
                rowData={rowData}
                defaultColDef={defaultColDef}
                suppressExcelExport={true}
                popupParent={popupParent}
                columnDefs={columnDefs}
              />
            </div>
          </div>
          <textarea
            id="csvResult"
            style={{ flex: "1" }}
            placeholder="Click the Show CSV export content button to view exported CSV here"
          ></textarea>
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
