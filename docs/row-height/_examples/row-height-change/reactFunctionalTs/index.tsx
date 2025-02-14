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
  ClientSideRowModelApiModule,
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  GridApi,
  GridOptions,
  ModuleRegistry,
  RowApiModule,
  RowHeightParams,
  ValidationModule,
} from "ag-grid-community";
import {
  ColumnMenuModule,
  ColumnsToolPanelModule,
  ContextMenuModule,
  RowGroupingModule,
} from "ag-grid-enterprise";
import { getData } from "./data";
import { IOlympicData } from "./interfaces";
ModuleRegistry.registerModules([
  ClientSideRowModelApiModule,
  RowApiModule,
  ClientSideRowModelModule,
  ColumnsToolPanelModule,
  ColumnMenuModule,
  ContextMenuModule,
  RowGroupingModule,
  ValidationModule /* Development Only */,
]);

let swimmingHeight: number;

let groupHeight: number;

let usaHeight: number;

const GridExample = () => {
  const gridRef = useRef<AgGridReact<IOlympicData>>(null);
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);
  const [rowData, setRowData] = useState<IOlympicData[]>(getData());
  const [columnDefs, setColumnDefs] = useState<ColDef[]>([
    { field: "country", rowGroup: true },
    { field: "athlete" },
    { field: "date" },
    { field: "sport" },
    { field: "gold" },
    { field: "silver" },
    { field: "bronze" },
    { field: "total" },
  ]);

  const setSwimmingHeight = useCallback((height: number) => {
    swimmingHeight = height;
    gridRef.current!.api.resetRowHeights();
  }, []);

  const setGroupHeight = useCallback((height: number) => {
    groupHeight = height;
    gridRef.current!.api.resetRowHeights();
  }, []);

  const setUsaHeight = useCallback((height: number) => {
    // this is used next time resetRowHeights is called
    usaHeight = height;
    gridRef.current!.api.forEachNode(function (rowNode) {
      if (rowNode.data && rowNode.data.country === "United States") {
        rowNode.setRowHeight(height);
      }
    });
    gridRef.current!.api.onRowHeightChanged();
  }, []);

  const getRowHeight = useCallback(
    (params: RowHeightParams<IOlympicData>): number | undefined | null => {
      if (params.node.group && groupHeight != null) {
        return groupHeight;
      } else if (
        params.data &&
        params.data.country === "United States" &&
        usaHeight != null
      ) {
        return usaHeight;
      } else if (
        params.data &&
        params.data.sport === "Swimming" &&
        swimmingHeight != null
      ) {
        return swimmingHeight;
      }
    },
    [groupHeight, usaHeight, swimmingHeight],
  );

  return (
    <div style={containerStyle}>
      <div className="example-wrapper">
        <div
          style={{
            marginBottom: "5px",
            fontFamily: "Verdana, Geneva, Tahoma, sans-serif",
            fontSize: "13px",
          }}
        >
          <div>
            Top Level Groups:
            <button onClick={() => setGroupHeight(42)}>42px</button>
            <button onClick={() => setGroupHeight(75)}>75px</button>
            <button onClick={() => setGroupHeight(125)}>125px</button>
          </div>
          <div style={{ marginTop: "5px" }}>
            Swimming Leaf Rows:
            <button onClick={() => setSwimmingHeight(42)}>42px</button>
            <button onClick={() => setSwimmingHeight(75)}>75px</button>
            <button onClick={() => setSwimmingHeight(125)}>125px</button>
          </div>
          <div style={{ marginTop: "5px" }}>
            United States Leaf Rows:
            <button onClick={() => setUsaHeight(42)}>42px</button>
            <button onClick={() => setUsaHeight(75)}>75px</button>
            <button onClick={() => setUsaHeight(125)}>125px</button>
          </div>
        </div>

        <div style={gridStyle}>
          <AgGridReact<IOlympicData>
            ref={gridRef}
            rowData={rowData}
            columnDefs={columnDefs}
            groupDefaultExpanded={1}
            getRowHeight={getRowHeight}
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
(window as any).tearDownExample = () => root.unmount();
