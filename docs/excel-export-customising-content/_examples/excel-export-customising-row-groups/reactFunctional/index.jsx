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
  CsvExportModule,
  ModuleRegistry,
  NumberFilterModule,
  ValidationModule,
} from "ag-grid-community";
import {
  ColumnMenuModule,
  ContextMenuModule,
  ExcelExportModule,
  RowGroupingModule,
  SetFilterModule,
} from "ag-grid-enterprise";
ModuleRegistry.registerModules([
  NumberFilterModule,
  ClientSideRowModelModule,
  CsvExportModule,
  ExcelExportModule,
  ColumnMenuModule,
  ContextMenuModule,
  RowGroupingModule,
  SetFilterModule,
  ValidationModule /* Development Only */,
]);

const getParams = () => ({
  processCellCallback(params) {
    const value = params.value;
    return value === undefined ? "" : `_${value}_`;
  },
  processRowGroupCallback(params) {
    const { node } = params;
    if (!node.footer) {
      return `row group: ${node.key}`;
    }
    const isRootLevel = node.level === -1;
    if (isRootLevel) {
      return "Grand Total";
    }
    return `Sub Total (${node.key})`;
  },
});

const GridExample = () => {
  const gridRef = useRef(null);
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);
  const [rowData, setRowData] = useState();
  const [columnDefs, setColumnDefs] = useState([
    { field: "athlete", minWidth: 200 },
    { field: "country", minWidth: 200, rowGroup: true, hide: true },
    { field: "sport", minWidth: 150 },
    { field: "gold", aggFunc: "sum" },
  ]);
  const defaultColDef = useMemo(() => {
    return {
      filter: true,
      minWidth: 150,
      flex: 1,
    };
  }, []);
  const popupParent = useMemo(() => {
    return document.body;
  }, []);
  const defaultExcelExportParams = useMemo(() => {
    return getParams();
  }, []);

  const onGridReady = useCallback((params) => {
    fetch("https://www.ag-grid.com/example-assets/small-olympic-winners.json")
      .then((resp) => resp.json())
      .then((data) => setRowData(data.filter((rec) => rec.country != null)));
  }, []);

  const onBtExport = useCallback(() => {
    gridRef.current.api.exportDataAsExcel(getParams());
  }, [getParams]);

  return (
    <div style={containerStyle}>
      <div className="container">
        <div>
          <button
            onClick={onBtExport}
            style={{ margin: "5px 0px", fontWeight: "bold" }}
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
              groupTotalRow={"bottom"}
              grandTotalRow={"bottom"}
              popupParent={popupParent}
              defaultExcelExportParams={defaultExcelExportParams}
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
