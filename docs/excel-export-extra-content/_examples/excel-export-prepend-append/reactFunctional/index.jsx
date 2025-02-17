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

const getRows = () => [
  { cells: [] },
  {
    cells: [
      {
        data: {
          value: 'Here is a comma, and a some "quotes".',
          type: "String",
        },
      },
    ],
  },
  {
    cells: [
      {
        data: {
          value:
            "They are visible when the downloaded file is opened in Excel because custom content is properly escaped.",
          type: "String",
        },
      },
    ],
  },
  {
    cells: [
      { data: { value: "this cell:", type: "String" }, mergeAcross: 1 },
      {
        data: {
          value: "is empty because the first cell has mergeAcross=1",
          type: "String",
        },
      },
    ],
  },
  { cells: [] },
];

const getBoolean = (inputSelector) =>
  !!document.querySelector(inputSelector).checked;

const getParams = () => ({
  prependContent: getBoolean("#prependContent") ? getRows() : undefined,
  appendContent: getBoolean("#appendContent") ? getRows() : undefined,
});

const GridExample = () => {
  const gridRef = useRef(null);
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);
  const [rowData, setRowData] = useState();
  const [columnDefs, setColumnDefs] = useState([
    { field: "athlete", minWidth: 200 },
    { field: "country", minWidth: 200 },
    { field: "sport", minWidth: 150 },
    { field: "gold" },
    { field: "silver" },
    { field: "bronze" },
    { field: "total" },
  ]);
  const defaultColDef = useMemo(() => {
    return {
      filter: true,
      minWidth: 100,
      flex: 1,
    };
  }, []);
  const popupParent = useMemo(() => {
    return document.body;
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
        <div className="columns">
          <label className="option" htmlFor="prependContent">
            <input type="checkbox" id="prependContent" />
            Prepend Content
          </label>
          <label className="option" htmlFor="appendContent">
            <input type="checkbox" id="appendContent" /> Append Content
          </label>
        </div>
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
              popupParent={popupParent}
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
