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
  ClientSideRowModelApiModule,
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ModuleRegistry,
  NumberFilterModule,
  RowDragCallbackParams,
  RowDragEndEvent,
  RowDragModule,
  ValidationModule,
} from "ag-grid-community";
import {
  ColumnMenuModule,
  ColumnsToolPanelModule,
  ContextMenuModule,
  RowGroupingModule,
  SetFilterModule,
} from "ag-grid-enterprise";
import { getData } from "./data";
ModuleRegistry.registerModules([
  RowDragModule,
  ClientSideRowModelApiModule,
  NumberFilterModule,
  ClientSideRowModelModule,
  ColumnsToolPanelModule,
  ColumnMenuModule,
  ContextMenuModule,
  RowGroupingModule,
  SetFilterModule,
  ValidationModule /* Development Only */,
]);

const rowDrag = function (params: RowDragCallbackParams) {
  // only rows that are NOT groups should be draggable
  return !params.node.group;
};

const GridExample = () => {
  const gridRef = useRef<AgGridReact>(null);
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);
  const [rowData, setRowData] = useState<any[]>();
  const [columnDefs, setColumnDefs] = useState<ColDef[]>([
    { field: "athlete", rowDrag: rowDrag },
    { field: "country", rowGroup: true },
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
    setRowData(getData());
  }, []);

  const onRowDragMove = useCallback((event: RowDragEndEvent) => {
    const movingNode = event.node!;
    const overNode = event.overNode!;
    // find out what country group we are hovering over
    let groupCountry;
    if (overNode.group) {
      // if over a group, we take the group key (which will be the
      // country as we are grouping by country)
      groupCountry = overNode.key;
    } else {
      // if over a non-group, we take the country directly
      groupCountry = overNode.data.country;
    }
    const needToChangeParent = movingNode.data.country !== groupCountry;
    if (needToChangeParent) {
      const movingData = movingNode.data;
      movingData.country = groupCountry;
      gridRef.current!.api.applyTransaction({
        update: [movingData],
      });
      gridRef.current!.api.clearFocusedCell();
    }
  }, []);

  return (
    <div style={containerStyle}>
      <div style={gridStyle}>
        <AgGridReact
          ref={gridRef}
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          groupDefaultExpanded={1}
          onGridReady={onGridReady}
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
