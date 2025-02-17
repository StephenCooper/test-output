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
  CellStyleModule,
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  GridApi,
  GridOptions,
  ModuleRegistry,
  ValidationModule,
} from "ag-grid-community";
import { IOlympicData } from "./interfaces";
ModuleRegistry.registerModules([
  CellStyleModule,
  ClientSideRowModelModule,
  ValidationModule /* Development Only */,
]);
import { useFetchJson } from "./useFetchJson";

const GridExample = () => {
  const { data, loading } = useFetchJson<IOlympicData>(
    "https://www.ag-grid.com/example-assets/olympic-winners.json",
  );
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);

  const [columnDefs, setColumnDefs] = useState<ColDef[]>([
    {
      field: "athlete",
      suppressMovable: true,
      cellClass: "suppress-movable-col",
    },
    { field: "age", lockPosition: "left", cellClass: "locked-col" },
    { field: "country" },
    { field: "year" },
    { field: "total", lockPosition: "right", cellClass: "locked-col" },
  ]);
  const defaultColDef = useMemo<ColDef>(() => {
    return {
      flex: 1,
      lockPinned: true, // Dont allow pinning for this example
    };
  }, []);

  return (
    <div style={containerStyle}>
      <div className="wrapper">
        <div className="legend-bar">
          <span className="legend-box locked-col"></span> Position Locked Column
          &nbsp;&nbsp;&nbsp;&nbsp;
          <span className="legend-box suppress-movable-col"></span> Suppress
          Movable Column
        </div>

        <div style={gridStyle}>
          <AgGridReact<IOlympicData>
            rowData={data}
            loading={loading}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            suppressDragLeaveHidesColumns={true}
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
