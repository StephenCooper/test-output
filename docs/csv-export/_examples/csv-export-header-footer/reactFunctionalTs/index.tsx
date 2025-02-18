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
  ColDef,
  ColGroupDef,
  CsvExportModule,
  GridApi,
  GridOptions,
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

function getValue(inputSelector: string) {
  const text = (document.querySelector(inputSelector) as HTMLInputElement)
    .value;
  switch (text) {
    case "string":
      return (
        'Here is a comma, and a some "quotes". You can see them using the\n' +
        "api.getDataAsCsv() button but they will not be visible when the downloaded\n" +
        "CSV file is opened in Excel because string content passed to\n" +
        "prependContent and appendContent is not escaped."
      );
    case "array":
      return [
        [],
        [
          {
            data: {
              value: 'Here is a comma, and a some "quotes".',
              type: "String",
            },
          },
        ],
        [
          {
            data: {
              value:
                "They are visible when the downloaded CSV file is opened in Excel because custom content is properly escaped (provided that suppressQuotes is not set to true)",
              type: "String",
            },
          },
        ],
        [
          { data: { value: "this cell:", type: "String" }, mergeAcross: 1 },
          {
            data: {
              value: "is empty because the first cell has mergeAcross=1",
              type: "String",
            },
          },
        ],
        [],
      ];
    case "none":
      return;
    default:
      return text;
  }
}

function getParams() {
  return {
    prependContent: getValue("#prependContent"),
    appendContent: getValue("#appendContent"),
    suppressQuotes: undefined,
    columnSeparator: undefined,
  };
}

const GridExample = () => {
  const gridRef = useRef<AgGridReact>(null);
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);
  const [rowData, setRowData] = useState<any[]>([
    { make: "Toyota", model: "Celica", price: 35000 },
    { make: "Ford", model: "Mondeo", price: 32000 },
    { make: "Porsche", model: "Boxster", price: 72000 },
  ]);
  const defaultColDef = useMemo<ColDef>(() => {
    return {
      editable: true,
      minWidth: 100,
      flex: 1,
    };
  }, []);
  const popupParent = useMemo<HTMLElement | null>(() => {
    return document.body;
  }, []);
  const [columnDefs, setColumnDefs] = useState<ColDef[]>([
    { field: "make" },
    { field: "model" },
    { field: "price" },
  ]);

  const onBtnExport = useCallback(() => {
    const params = getParams();
    if (params.suppressQuotes || params.columnSeparator) {
      alert(
        "NOTE: you are downloading a file with non-standard quotes or separators - it may not render correctly in Excel.",
      );
    }
    gridRef.current!.api.exportDataAsCsv(params);
  }, [alert]);

  const onBtnUpdate = useCallback(() => {
    (document.querySelector("#csvResult") as any).value =
      gridRef.current!.api.getDataAsCsv(getParams());
  }, []);

  return (
    <div style={containerStyle}>
      <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
        <div style={{ display: "flex" }}>
          <div style={{ marginLeft: "10px" }}>
            <div className="row">
              <label>prependContent = </label>
              <select id="prependContent">
                <option>none</option>
                <option value="array">CSVCell[][] (recommended format)</option>
                <option value="string">string (legacy format)</option>
              </select>
            </div>
            <div className="row">
              <label>appendContent = </label>
              <select id="appendContent">
                <option>none</option>
                <option value="array">CSVCell[][] (recommended format)</option>
                <option value="string">string (legacy format)</option>
              </select>
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

const root = createRoot(document.getElementById("root")!);
root.render(
  <StrictMode>
    <GridExample />
  </StrictMode>,
);
(window as any).tearDownExample = () => root.unmount();
