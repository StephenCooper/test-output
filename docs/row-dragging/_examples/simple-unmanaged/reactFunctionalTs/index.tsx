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
  ColumnApiModule,
  GetRowIdFunc,
  GetRowIdParams,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ModuleRegistry,
  NumberFilterModule,
  RowDragModule,
  RowDragMoveEvent,
  TextFilterModule,
  ValidationModule,
  createGrid,
} from "ag-grid-community";
import { getData } from "./data";
ModuleRegistry.registerModules([
  RowDragModule,
  TextFilterModule,
  NumberFilterModule,
  ClientSideRowModelModule,
  ColumnApiModule,
  ValidationModule /* Development Only */,
]);

let immutableStore: any[] = getData();

let sortActive = false;

let filterActive = false;

const GridExample = () => {
  const gridRef = useRef<AgGridReact>(null);
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);
  const [rowData, setRowData] = useState<any[]>();
  const [columnDefs, setColumnDefs] = useState<ColDef[]>([
    { field: "athlete", rowDrag: true },
    { field: "country" },
    { field: "year", width: 100 },
    { field: "date" },
    { field: "sport" },
    { field: "gold" },
    { field: "silver" },
    { field: "bronze" },
  ]);
  const defaultColDef = useMemo<ColDef>(() => {
    return {
      width: 170,
      filter: true,
    };
  }, []);

  const onGridReady = useCallback((params: GridReadyEvent) => {
    // add id to each item, needed for immutable store to work
    immutableStore.forEach(function (data, index) {
      data.id = index;
    });
    params.api.setGridOption("rowData", immutableStore);
  }, []);

  // listen for change on sort changed
  const onSortChanged = useCallback(() => {
    const colState = gridRef.current!.api.getColumnState() || [];
    sortActive = colState.some((c) => c.sort);
    // suppress row drag if either sort or filter is active
    const suppressRowDrag = sortActive || filterActive;
    console.log(
      "sortActive = " +
        sortActive +
        ", filterActive = " +
        filterActive +
        ", allowRowDrag = " +
        suppressRowDrag,
    );
    gridRef.current!.api.setGridOption("suppressRowDrag", suppressRowDrag);
  }, [filterActive]);

  // listen for changes on filter changed
  const onFilterChanged = useCallback(() => {
    filterActive = gridRef.current!.api.isAnyFilterPresent();
    // suppress row drag if either sort or filter is active
    const suppressRowDrag = sortActive || filterActive;
    console.log(
      "sortActive = " +
        sortActive +
        ", filterActive = " +
        filterActive +
        ", allowRowDrag = " +
        suppressRowDrag,
    );
    gridRef.current!.api.setGridOption("suppressRowDrag", suppressRowDrag);
  }, [filterActive]);

  const onRowDragMove = useCallback(
    (event: RowDragMoveEvent) => {
      const movingNode = event.node;
      const overNode = event.overNode;
      const rowNeedsToMove = movingNode !== overNode;
      if (rowNeedsToMove) {
        // the list of rows we have is data, not row nodes, so extract the data
        const movingData = movingNode.data;
        const overData = overNode!.data;
        const fromIndex = immutableStore.indexOf(movingData);
        const toIndex = immutableStore.indexOf(overData);
        const newStore = immutableStore.slice();
        moveInArray(newStore, fromIndex, toIndex);
        immutableStore = newStore;
        setRowData(newStore);
        gridRef.current!.api.clearFocusedCell();
      }
      function moveInArray(arr: any[], fromIndex: number, toIndex: number) {
        const element = arr[fromIndex];
        arr.splice(fromIndex, 1);
        arr.splice(toIndex, 0, element);
      }
    },
    [immutableStore],
  );

  const getRowId = useCallback((params: GetRowIdParams) => {
    return String(params.data.id);
  }, []);

  return (
    <div style={containerStyle}>
      <div style={gridStyle}>
        <AgGridReact
          ref={gridRef}
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          getRowId={getRowId}
          onGridReady={onGridReady}
          onSortChanged={onSortChanged}
          onFilterChanged={onFilterChanged}
          onRowDragMove={onRowDragMove}
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
