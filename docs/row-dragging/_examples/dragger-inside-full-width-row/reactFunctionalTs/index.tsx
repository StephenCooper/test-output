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
import "./style.css";
import {
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  GridApi,
  GridOptions,
  ICellRendererParams,
  IsFullWidthRowParams,
  ModuleRegistry,
  RowDragModule,
  RowHeightParams,
  TextFilterModule,
  ValidationModule,
} from "ag-grid-community";
import { getData } from "./data";
import FullWidthCellRenderer from "./fullWidthCellRenderer.tsx";
ModuleRegistry.registerModules([
  TextFilterModule,
  RowDragModule,
  ClientSideRowModelModule,
  ValidationModule /* Development Only */,
]);

function countryCellRenderer(params: ICellRendererParams) {
  if (!params.fullWidth) {
    return params.value;
  }
  const flag =
    '<img border="0" width="15" height="10" src="https://www.ag-grid.com/example-assets/flags/' +
    params.data.code +
    '.png">';
  return (
    '<span style="cursor: default;">' + flag + " " + params.value + "</span>"
  );
}

function isFullWidth(data: any) {
  // return true when country is Peru, France or Italy
  return ["Peru", "France", "Italy"].indexOf(data.name) >= 0;
}

const GridExample = () => {
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);
  const [rowData, setRowData] = useState<any[]>(getData());
  const [columnDefs, setColumnDefs] = useState<ColDef[]>([
    { field: "name", cellRenderer: countryCellRenderer },
    { field: "continent" },
    { field: "language" },
  ]);
  const defaultColDef = useMemo<ColDef>(() => {
    return {
      flex: 1,
      filter: true,
    };
  }, []);
  const getRowHeight = useCallback((params: RowHeightParams) => {
    // return 100px height for full width rows
    if (isFullWidth(params.data)) {
      return 100;
    }
  }, []);
  const isFullWidthRow = useCallback((params: IsFullWidthRowParams) => {
    return isFullWidth(params.rowNode.data);
  }, []);
  const fullWidthCellRenderer = useCallback(FullWidthCellRenderer, []);

  return (
    <div style={containerStyle}>
      <div style={gridStyle}>
        <AgGridReact
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          rowDragManaged={true}
          getRowHeight={getRowHeight}
          isFullWidthRow={isFullWidthRow}
          fullWidthCellRenderer={fullWidthCellRenderer}
        />
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
