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
  PinnedRowModule,
  TextEditorModule,
  ValidationModule,
  createGrid,
} from "ag-grid-community";
import { ColumnMenuModule, ContextMenuModule } from "ag-grid-enterprise";
ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  CsvExportModule,
  ColumnMenuModule,
  ContextMenuModule,
  PinnedRowModule,
  NumberEditorModule,
  TextEditorModule,
  ValidationModule /* Development Only */,
]);

function getBoolean(id: string) {
  const field: any = document.querySelector("#" + id);
  return !!field.checked;
}

function getParams() {
  return {
    skipPinnedTop: getBoolean("skipPinnedTop"),
    skipPinnedBottom: getBoolean("skipPinnedBottom"),
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
  const pinnedTopRowData = useMemo<any[]>(() => {
    return [{ make: "Top Make", model: "Top Model", price: 0 }];
  }, []);
  const pinnedBottomRowData = useMemo<any[]>(() => {
    return [{ make: "Bottom Make", model: "Bottom Model", price: 10101010 }];
  }, []);

  const onBtnExport = useCallback(() => {
    gridRef.current!.api.exportDataAsCsv(getParams());
  }, []);

  const onBtnUpdate = useCallback(() => {
    (document.querySelector("#csvResult") as any).value =
      gridRef.current!.api.getDataAsCsv(getParams());
  }, []);

  return (
    <div style={containerStyle}>
      <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
        <div style={{ display: "flex" }}>
          <div className="row">
            <label htmlFor="skipPinnedTop">
              <input id="skipPinnedTop" type="checkbox" />
              Skip Pinned Top Rows
            </label>
            <label htmlFor="skipPinnedBottom">
              <input id="skipPinnedBottom" type="checkbox" />
              Skip Pinned Bottom Rows
            </label>
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
                pinnedTopRowData={pinnedTopRowData}
                pinnedBottomRowData={pinnedBottomRowData}
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
