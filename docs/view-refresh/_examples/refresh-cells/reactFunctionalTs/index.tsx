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
  ColDef,
  ColGroupDef,
  GridApi,
  GridOptions,
  GridReadyEvent,
  HighlightChangesModule,
  IRowNode,
  ModuleRegistry,
  PinnedRowModule,
  RefreshCellsParams,
  RenderApiModule,
  RowApiModule,
  ValidationModule,
  createGrid,
} from "ag-grid-community";
ModuleRegistry.registerModules([
  RenderApiModule,
  RowApiModule,
  HighlightChangesModule,
  PinnedRowModule,
  ClientSideRowModelModule,
  ValidationModule /* Development Only */,
]);

// placing in 13 rows, so there are exactly enough rows to fill the grid, makes
// the row animation look nice when you see all the rows
let data: any[] = [];

let topRowData: any[] = [];

let bottomRowData: any[] = [];

const createData: (count: number) => any[] = (count: number) => {
  const result = [];
  for (let i = 1; i <= count; i++) {
    result.push({
      a: (i * 863) % 100,
      b: (i * 811) % 100,
      c: (i * 743) % 100,
      d: (i * 677) % 100,
      e: (i * 619) % 100,
      f: (i * 571) % 100,
    });
  }
  return result;
};

function isForceRefreshSelected() {
  return (document.querySelector("#forceRefresh") as HTMLInputElement).checked;
}

function isSuppressFlashSelected() {
  return (document.querySelector("#suppressFlash") as HTMLInputElement).checked;
}

function callRefreshAfterMillis(
  params: RefreshCellsParams,
  millis: number,
  api: GridApi,
) {
  setTimeout(() => {
    api.refreshCells(params);
  }, millis);
}

function scramble() {
  data.forEach(scrambleItem);
  topRowData.forEach(scrambleItem);
  bottomRowData.forEach(scrambleItem);
}

function scrambleItem(item: any) {
  ["a", "b", "c", "d", "e", "f"].forEach((colId) => {
    // skip 50% of the cells so updates are random
    if (Math.random() > 0.5) {
      return;
    }
    item[colId] = Math.floor(Math.random() * 100);
  });
}

const GridExample = () => {
  const gridRef = useRef<AgGridReact>(null);
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);
  const [rowData, setRowData] = useState<any[]>([]);
  const [columnDefs, setColumnDefs] = useState<ColDef[]>([
    { field: "a", enableCellChangeFlash: false },
    { field: "b" },
    { field: "c" },
    { field: "d" },
    { field: "e" },
    { field: "f" },
  ]);
  const defaultColDef = useMemo<ColDef>(() => {
    return {
      flex: 1,
      enableCellChangeFlash: true,
    };
  }, []);
  const pinnedTopRowData = useMemo<any[]>(() => {
    return [];
  }, []);
  const pinnedBottomRowData = useMemo<any[]>(() => {
    return [];
  }, []);

  const onGridReady = useCallback((params: GridReadyEvent) => {
    // placing in 13 rows, so there are exactly enough rows to fill the grid, makes
    // the row animation look nice when you see all the rows
    data = createData(14);
    topRowData = createData(2);
    bottomRowData = createData(2);
    params.api.setGridOption("rowData", data);
    params.api.setGridOption("pinnedTopRowData", topRowData);
    params.api.setGridOption("pinnedBottomRowData", bottomRowData);
  }, []);

  const scrambleAndRefreshAll = useCallback(() => {
    scramble();
    const params = {
      force: isForceRefreshSelected(),
      suppressFlash: isSuppressFlashSelected(),
    };
    gridRef.current!.api.refreshCells(params);
  }, []);

  const scrambleAndRefreshLeftToRight = useCallback(() => {
    scramble();
    ["a", "b", "c", "d", "e", "f"].forEach((col, index) => {
      const millis = index * 100;
      const params = {
        force: isForceRefreshSelected(),
        suppressFlash: isSuppressFlashSelected(),
        columns: [col],
      };
      callRefreshAfterMillis(params, millis, gridRef.current!.api);
    });
  }, []);

  const scrambleAndRefreshTopToBottom = useCallback(() => {
    scramble();
    let frame = 0;
    let i;
    let rowNode;
    for (i = 0; i < gridRef.current!.api.getPinnedTopRowCount(); i++) {
      rowNode = gridRef.current!.api.getPinnedTopRow(i)!;
      refreshRow(rowNode, gridRef.current!.api);
    }
    for (i = 0; i < gridRef.current!.api.getDisplayedRowCount(); i++) {
      rowNode = gridRef.current!.api.getDisplayedRowAtIndex(i)!;
      refreshRow(rowNode, gridRef.current!.api);
    }
    for (i = 0; i < gridRef.current!.api.getPinnedBottomRowCount(); i++) {
      rowNode = gridRef.current!.api.getPinnedBottomRow(i)!;
      refreshRow(rowNode, gridRef.current!.api);
    }
    function refreshRow(rowNode: IRowNode, api: GridApi) {
      const millis = frame++ * 100;
      const rowNodes = [rowNode]; // params needs an array
      const params: RefreshCellsParams = {
        force: isForceRefreshSelected(),
        suppressFlash: isSuppressFlashSelected(),
        rowNodes: rowNodes,
      };
      callRefreshAfterMillis(params, millis, api);
    }
  }, []);

  return (
    <div style={containerStyle}>
      <div className="example-wrapper">
        <div className="example-header">
          <div>
            <button onClick={scrambleAndRefreshAll}>
              Scramble &amp; Refresh All
            </button>
            <button onClick={scrambleAndRefreshLeftToRight}>
              Scramble &amp; Refresh Left to Right
            </button>
            <button onClick={scrambleAndRefreshTopToBottom}>
              Scramble &amp; Refresh Top to Bottom
            </button>
          </div>
          <div>
            <label>
              <input type="checkbox" id="forceRefresh" />
              Force Refresh
            </label>
            <label>
              <input type="checkbox" id="suppressFlash" />
              Suppress Flash
            </label>
          </div>
        </div>

        <div style={gridStyle}>
          <AgGridReact
            ref={gridRef}
            rowData={rowData}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            pinnedTopRowData={pinnedTopRowData}
            pinnedBottomRowData={pinnedBottomRowData}
            onGridReady={onGridReady}
          />
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
